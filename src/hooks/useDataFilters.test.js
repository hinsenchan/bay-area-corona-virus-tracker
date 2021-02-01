import { act, renderHook } from "@testing-library/react-hooks";
import { useDataFilters } from "./useDataFilters";

test("useDataFilters", () => {
  const END_DATE_TIME = 1600758000000;
  const END_DATE_TIME_MINUS_30 = 1598166000000;
  const END_DATE_TIME_MINUS_90 = 1592982000000;
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
  expect(granularity).toEqual("quarter");
  expect(startDateTime).toEqual(END_DATE_TIME_MINUS_90);
  expect(endDateTime).toEqual(END_DATE_TIME);
  act(() => {
    handleAggregator("growthRates");
    handleCategory("New");
    handleGranularity("month");
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
  expect(_granularity).toEqual("month");
  expect(_startDateTime).toEqual(END_DATE_TIME_MINUS_30);
  expect(_endDateTime).toEqual(END_DATE_TIME);
});
