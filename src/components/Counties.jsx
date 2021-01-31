import React from "react";
import { isEqual, map, startsWith } from "lodash";
import County from "./County";

/**
 * Determines whether series is an active category.
 * @param {Object} series
 * @param {string} category
 * @returns {boolean} value
 */
function isActiveSeriesCategory(series, category) {
  return startsWith(series.category, category);
}

/**
 * Determines whether series is a flag type.
 * @param {Object} series
 * @returns {boolean} value
 */
function isFlagSeries(series) {
  return isEqual(series.type, "flags");
}

/**
 * Determines whether series is visible.
 * @param {Object} series
 * @param {string} category
 * @returns {boolean} value
 */
function isVisibleSeries(series, category) {
  return isActiveSeriesCategory(series, category) || isFlagSeries(series);
}

/**
 * Set Highcharts series visibility for county data.
 * @param {Array} countyData
 * @param {string} category
 * @returns {Array} county data
 */
function mapCountyDataSeriesWithVisibility(countyData, category) {
  return map(countyData, (series) => ({
    ...series,
    visible: isVisibleSeries(series, category),
    showInLegend: isActiveSeriesCategory(series, category),
  }));
}

/**
 * Presenter for counties data.
 */
function Counties({
  transformedCountiesData,
  category,
  granularity,
  aggregator,
  endDateTime,
  startDateTime,
}) {
  return map(transformedCountiesData, (countyData, name) => {
    const countySeriesWithVisibility = mapCountyDataSeriesWithVisibility(
      countyData,
      category
    );
    return (
      <County
        key={name}
        name={name}
        series={countySeriesWithVisibility}
        category={category}
        granularity={granularity}
        aggregator={aggregator}
        endDateTime={endDateTime}
        startDateTime={startDateTime}
      />
    );
  });
}

export default Counties;
