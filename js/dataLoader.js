/**
 * dataLoader.js
 * ---------------------------------------------------------------------------
 * Loading and reshaping of the raw CSV data.
 *
 * Raw CSV row:      { date: "1997-01-01", max_temperature: "25", min_temperature: "16" }
 * Daily record:     { date, year, month, day, maxTemperature, minTemperature }
 * Monthly record:   { year, month, maxTemperature, minTemperature, dailyRecords[] }
 *
 * `month` is 0-based (0 = January) everywhere so it can index MONTH_NAMES.
 */

const parseDate = d3.timeParse("%Y-%m-%d");

/**
 * Convert one CSV row into a typed daily record.
 * Used as the row accessor for d3.csv so parsing happens while loading.
 */
function parseDailyRow(row) {
  const date = parseDate(row.date);
  return {
    date,
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    maxTemperature: +row.max_temperature,
    minTemperature: +row.min_temperature,
  };
}

/**
 * Load the daily temperature CSV.
 * @param {string} csvPath - path to temperature_daily.csv
 * @returns {Promise<Array>} daily records sorted by date
 */
export async function loadDailyTemperatures(csvPath) {
  const dailyRecords = await d3.csv(csvPath, parseDailyRow);
  return dailyRecords.sort((a, b) => a.date - b.date);
}

/**
 * Group daily records into one record per (year, month).
 * - maxTemperature: highest daily maximum within the month
 * - minTemperature: lowest daily minimum within the month
 * - dailyRecords:   the month's days (used by the Level 2 mini line charts)
 *
 * @param {Array} dailyRecords - output of loadDailyTemperatures
 * @returns {Array} monthly records sorted by year then month
 */
export function aggregateByMonth(dailyRecords) {
  const groupedByYearMonth = d3.groups(
    dailyRecords,
    (record) => record.year,
    (record) => record.month
  );

  const monthlyRecords = [];
  for (const [year, months] of groupedByYearMonth) {
    for (const [month, daysInMonth] of months) {
      monthlyRecords.push({
        year,
        month,
        maxTemperature: d3.max(daysInMonth, (d) => d.maxTemperature),
        minTemperature: d3.min(daysInMonth, (d) => d.minTemperature),
        dailyRecords: daysInMonth,
      });
    }
  }
  return monthlyRecords.sort((a, b) => a.year - b.year || a.month - b.month);
}

/**
 * Keep only the most recent `numberOfYears` years.
 * Passing null/undefined returns all records unchanged.
 *
 * @param {Array} monthlyRecords - output of aggregateByMonth
 * @param {number|null} numberOfYears - how many recent years to keep
 */
export function filterToRecentYears(monthlyRecords, numberOfYears) {
  if (!numberOfYears) return monthlyRecords;
  const latestYear = d3.max(monthlyRecords, (d) => d.year);
  const firstYearToKeep = latestYear - numberOfYears + 1;
  return monthlyRecords.filter((d) => d.year >= firstYearToKeep);
}
