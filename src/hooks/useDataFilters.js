import { useState } from "react";
import moment from "moment";

const GRANULARITY_DATETIME = {
  month: moment("2020-01-25").add(30, "days").valueOf(),
  quarter: moment("2020-01-25").add(90, "days").valueOf(),
  halfYear: moment("2020-01-25").add(180, "days").valueOf(),
  max: moment("2020-09-22").valueOf(),
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
  const startDateTime = moment("2020-01-25").valueOf();

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
