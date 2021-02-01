import { useState } from "react";
import moment from "moment";
import { DATA_END_DATE, GRANULARITY_DATETIME } from "../utils/dateConstants";

/**
 * Maintains data filter states and handlers to modify it.
 * @returns {Array} aggregator, handleAggregator, category, categoryHandler, granularity, handleGranularity, endDateTime, startDateTime
 */
export function useDataFilters() {
  const [aggregator, setAggregator] = useState("multiples");
  const [category, setCategory] = useState("Total");
  const [granularity, setGranularity] = useState("quarter");

  const handleAggregator = (newAggregator) => {
    setAggregator(newAggregator);
  };

  const handleCategory = (newCategory) => {
    setCategory(newCategory);
  };

  const handleGranularity = (newGranularity) => {
    setGranularity(newGranularity);
  };

  const startDateTime = GRANULARITY_DATETIME[granularity];
  const endDateTime = moment(DATA_END_DATE).valueOf();

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
