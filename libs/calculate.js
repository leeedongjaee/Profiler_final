/**
 *
 * @param {{ core: string; task: string; value: number }[]} data
 * @param {string} filterKey ex) task
 * @param {string} filterValue ex) task3
 * @param {string} valueKey ex) core
 */
function calcPerformance(data, filterKey, filterValue, valueKey) {
  const groups = {};

  data.forEach((item) => {
    if (item[filterKey] !== filterValue) return;
    const groupKey = item[valueKey];
    const value = item.value;

    if (!groups[groupKey]) {
      groups[groupKey] = {
        count: 0,
        sum: 0,
        min: Number.MAX_SAFE_INTEGER,
        max: Number.MIN_SAFE_INTEGER,
      };
    }

    const group = groups[groupKey];
    group.count++;
    group.sum += value;
    group.min = Math.min(group.min, value);
    group.max = Math.max(group.max, value);
  });

  const result = [];
  for (const groupKey in groups) {
    const group = groups[groupKey];
    result.push({
      name: groupKey,
      avg: group.sum / group.count,
      min: group.min,
      max: group.max,
    });
  }

  return result;
}

module.exports = {
  calcPerformance,
};
