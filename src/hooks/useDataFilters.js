import { useState } from "react";
import moment from "moment";

const DATA_START_DATE = "2020-01-25";
const DATA_END_DATE = "2020-09-22";

const GRANULARITY_DATETIME = {
  month: moment(DATA_START_DATE).add(30, "days").valueOf(),
  quarter: moment(DATA_START_DATE).add(90, "days").valueOf(),
  halfYear: moment(DATA_START_DATE).add(180, "days").valueOf(),
  max: moment(DATA_END_DATE).valueOf(),
};

/**
 * Maintains data filter states and handlers to modify it.
 * @returns {Array} aggregator, handleAggregator, category, categoryHandler, granularity, handleGranularity, endDateTime, startDateTime
 */
export function useDataFilters() {
  const [aggregator, setAggregator] = useState("multiples");
  const [category, setCategory] = useState("Total");
  const [granularity, setGranularity] = useState("month");

  const handleAggregator = (event, newAggregator) => {
    setAggregator(newAggregator);
  };

  const handleCategory = (event, newCategory) => {
    setCategory(newCategory);
  };

  const handleGranularity = (event, newGranularity) => {
    setGranularity(newGranularity);
  };

  const endDateTime = GRANULARITY_DATETIME[granularity];
  const startDateTime = moment(DATA_START_DATE).valueOf();

  return [
    aggregator,
    handleAggregator,
    category,
    handleCategory,
    granularity,
    handleGranularity,
    endDateTime,
    startDateTime,
  ];
}
