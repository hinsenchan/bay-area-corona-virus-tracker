import { useState } from "react";
import moment from "moment";

const GRANULARITY_DATETIME = {
  week: moment().subtract(7, "days").valueOf(),
  month: moment().subtract(30, "days").valueOf(),
  year: moment("2020-01-25").valueOf(),
};

export function useDataFilters() {
  const [aggregator, setAggregator] = useState("multiples");
  const [category, setCategory] = useState("Total");
  const [granularity, setGranularity] = useState("week");

  const handleAggregator = (event, newAggregator) => {
    setAggregator(newAggregator);
  };

  const handleCategory = (event, newCategory) => {
    setCategory(newCategory);
  };

  const handleGranularity = (event, newGranularity) => {
    setGranularity(newGranularity);
  };

  const startDateTime = GRANULARITY_DATETIME[granularity];

  return [
    aggregator,
    handleAggregator,
    category,
    handleCategory,
    granularity,
    handleGranularity,
    startDateTime,
  ];
}
