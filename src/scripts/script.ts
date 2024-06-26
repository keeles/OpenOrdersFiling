/**
 * This script sorts values by ranges in a SharePoint Excel workbook.
 * It assumes you have two sheets: "Open Orders" and "Unfulfilled".
 */
//@ts-ignore
function main(workbook: ExcelScript.Workbook) {
  const openOrders = workbook.getWorksheet("Open Orders");
  const unfulfilled = workbook.getWorksheet("Unfulfilled");

  // Clear values in the open orders worksheet
  clearValues(openOrders);

  // Define a collection to store the ranges
  let ranges: {start: number; end: number; row: number; brand: string}[] = [];

  // Loop through the range where your ranges are defined
  const openOrdersRange = openOrders.getUsedRange();
  const openOrdersValues = openOrdersRange.getValues();

  for (let i = 0; i < openOrdersValues.length; i++) {
    // Skip hidden rows
    if (openOrders.getCell(i, 0).getHidden()) {
      continue;
    }
    const rangeValue = openOrdersValues[i][1];
    const rangeBrand = openOrdersValues[i][0];

    let numberBefore = "",
      numberAfter = "";
    if (typeof rangeValue === "string") {
      [numberBefore, numberAfter] = splitString(rangeValue);
    }

    if (typeof rangeValue === "number") {
      [numberBefore, numberAfter] = [String(rangeValue), String(rangeValue)];
    }

    if (numberBefore && numberAfter) {
      const rangeStart = parseInt(numberBefore, 10);
      const rangeEnd = parseInt(numberAfter, 10);
      const rngRow = i + 1; // Store the row where the range is defined
      // Add the range to the collection

      ranges.push({start: rangeStart, end: rangeEnd, row: rngRow, brand: rangeBrand});
    }
  }

  // Loop through each cell in column A of the unfulfilled worksheet
  const unfulfilledRange = unfulfilled.getUsedRange();
  const unfulfilledValues = unfulfilledRange.getValues();

  for (let i = 0; i < unfulfilledValues.length; i++) {
    const orderNumber = unfulfilledValues[i][0];
    const brand = unfulfilledValues[i][1];

    // Check if the value falls within any of the defined ranges
    for (const rng of ranges) {
      if (
        typeof orderNumber === "number" &&
        orderNumber >= rng.start &&
        orderNumber <= rng.end &&
        rng.brand === brand
      ) {
        addValue(openOrders, orderNumber, rng.row);
        break; // Exit the loop once a match is found
      }
    }
  }

  // Mark batches as complete if all orders have been fulfilled
  const updatedOpenOrdersValues = openOrdersRange.getValues();

  for (const rng of ranges) {
    if (!updatedOpenOrdersValues[rng.row - 1][7]) {
      addValue(openOrders, 0, rng.row);
    }
  }
}

// Adds the value to the specified cell in column H of the row where the range is defined
//@ts-ignore
function addValue(openOrders: ExcelScript.Worksheet, value: number, targetRow: number) {
  const cell = openOrders.getCell(targetRow - 1, 7);
  const currentValue = cell.getValue();

  // For marking as complete pass a 0 into the function call
  if (!value) {
    cell.setValue("Complete");
    return;
  }

  if (currentValue) {
    cell.setValue(currentValue + ", " + value);
  } else {
    cell.setValue(value);
  }
}

// Splits the cell value based on the "-" character
function splitString(cellValue: string): [string, string] {
  const values = cellValue.split("-");
  if (values.length >= 2) {
    return [values[0], values[1]];
  } else {
    return [cellValue, cellValue];
  }
}

// Clears the values in column H (index 7)
//@ts-ignore
function clearValues(openOrders: ExcelScript.Worksheet) {
  const usedRange = openOrders.getUsedRange();
  const rowCount = usedRange.getRowCount();

  for (let i = 0; i < rowCount; i++) {
    //@ts-ignore
    openOrders.getCell(i, 7).clear(ExcelScript.ClearApplyTo.contents);
  }
}
