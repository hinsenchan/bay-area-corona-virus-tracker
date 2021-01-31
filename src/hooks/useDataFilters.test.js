import { act, renderHook } from "@testing-library/react-hooks";
import { useDataFilters } from "./useDataFilters";

test("useDataFilters", () => {
  const START_DATE_TIME = 1579939200000;
  const START_DATE_TIME_PLUS_30 = 1582531200000;
  const START_DATE_TIME_PLUS_90 = 1587711600000;
  const { result } = renderHook(() => useDataFilters());
  const [
    aggregator,
    handleAggregator,
    category,
    handleCategory,
    granularity,
    handleGranularity,
    endDateTime,
    startDateTime,
  ] = result.current;
  expect(aggregator).toEqual("multiples");
  expect(category).toEqual("Total");
  expect(granularity).toEqual("month");
  expect(startDateTime).toEqual(START_DATE_TIME);
  expect(endDateTime).toEqual(START_DATE_TIME_PLUS_30);
  act(() => {
    handleAggregator("growthRates");
    handleCategory("New");
    handleGranularity("quarter");
  });
  const [
    _aggregator,
    _handleAggregator,
    _category,
    _handleCategory,
    _granularity,
    _handleGranularity,
    _endDateTime,
    _startDateTime,
  ] = result.current;
  expect(_aggregator).toEqual("growthRates");
  expect(_category).toEqual("New");
  expect(_granularity).toEqual("quarter");
  expect(_startDateTime).toEqual(START_DATE_TIME);
  expect(_endDateTime).toEqual(START_DATE_TIME_PLUS_90);
});
