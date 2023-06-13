/**
 * @param {string} rawData
 */
function getDataFromRawData(rawData) {
  const rows = rawData.split("\n");
  const headerRow = rows[0];
  const tasks = headerRow.split("\t").slice(1);
  const values = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    // 헤더인 경우 건너뛰기
    if (row === headerRow) {
      continue;
    }

    const columns = row.split("\t").filter(Boolean);
    const core = columns[0];

    for (let j = 1; j < columns.length; j++) {
      const task = tasks[j - 1];
      const value = Number(columns[j]);

      values.push({ core, task, value });
    }
  }

  return values;
}

module.exports = {
  getDataFromRawData,
};
