/**
 * This script sorts the order ID's on the unfulfilled sheet by pick range by ranges in the Open Orders sheet.
 * It assumes you have two sheets: "Open Orders" and "Unfulfilled".
 * ts-ignore comments are just to keep VSCode from getting upset - not necessary when using script in excel
 */
//@ts-ignore
function main(workbook: ExcelScript.Workbook) {
  const openOrders = workbook.getWorksheet("Open Orders");
  const unfulfilled = workbook.getWorksheet("Unfulfilled");

  clearValues(openOrders);

  // Find the ranges for batches that are still in the exposed rows
  let ranges: {start: number; end: number; row: number; brand: string}[] = [];

  const openOrdersRange = openOrders.getUsedRange();
  const openOrdersValues = openOrdersRange.getValues();
  openOrders.getCell(0, 7).setValue("Completed by Warehouse");

  for (let i = 1; i < openOrdersValues.length; i++) {
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

  // Loop through the order ID's and brand for each order in the unfulfilled worksheet
  const unfulfilledRange = unfulfilled.getUsedRange();
  const unfulfilledValues = unfulfilledRange.getValues();

  for (let i = 0; i < unfulfilledValues.length; i++) {
    const orderNumber = unfulfilledValues[i][0];
    const brand = unfulfilledValues[i][1];

    // Check if the value falls within any of the open batches
    for (const rng of ranges) {
      if (
        typeof orderNumber === "number" &&
        orderNumber >= rng.start &&
        orderNumber <= rng.end &&
        rng.brand === brand
      ) {
        addValue(openOrders, orderNumber, rng.row);
        break;
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

// Adds the unfulfilled order ID to the appropriate row in the "Completed by Warehouse" column
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

function splitString(cellValue: string): [string, string] {
  const values = cellValue.split("-");
  if (values.length >= 2) {
    return [values[0], values[1]];
  } else {
    return [cellValue, cellValue];
  }
}

//@ts-ignore
function clearValues(openOrders: ExcelScript.Worksheet) {
  const usedRange = openOrders.getUsedRange();
  const rowCount = usedRange.getRowCount();

  for (let i = 0; i < rowCount; i++) {
    //@ts-ignore
    openOrders.getCell(i, 7).clear(ExcelScript.ClearApplyTo.contents);
  }
}
