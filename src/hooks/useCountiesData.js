import {
  cloneDeep,
  concat,
  isEqual,
  find,
  forEach,
  get,
  groupBy,
  isNumber,
  keyBy,
  map,
  mapValues,
  omit,
  replace,
  round,
  sortBy,
  startCase,
  toNumber,
} from "lodash";
import moment from "moment";
import { useFetchAndStore } from "./useFetchAndStore";
import { DATA_END_DATE, GRANULARITY_DATETIME } from "../utils/dateConstants";
import { NOTABLE_EVENTS } from "../utils/eventConstants";

/**
 * Map fetched data by counties.
 * Set attributes used to render county series for charts.
 * Calculate growth rates and multiples for county series.
 * Set attributes used to render notable event series for charts.
 * @returns {Object} transformed counties data
 */
export function useCountiesData() {
  const data = useFetchAndStore();
  const bayAreaCounties = data.filter((county) =>
    isEqual(county["BAY AREA"], "YES")
  );
  const bayAreaCountiesDataSet = keyBy(
    bayAreaCounties,
    (county) => `${county["GEOGRAPHY"]} new ${county["CATEGORY"]}`
  );
  const bayAreaCountiesTimeSeriesObj = mapValues(
    bayAreaCountiesDataSet,
    (county) => {
      return omit(county, [
        "ROW",
        "GEOGRAPHY",
        "BAY AREA",
        "CATEGORY",
        "TOTALS",
      ]);
    }
  );
  const bayAreaCountiesTimeSeries = mapValues(
    bayAreaCountiesTimeSeriesObj,
    (county) => {
      return map(county, (value, key) => {
        return { x: moment(key, "MM-DD-YYYY").valueOf(), y: toNumber(value) };
      });
    }
  );
  const sortedBayAreaCountiesTimeSeries = mapValues(
    bayAreaCountiesTimeSeries,
    (series) => {
      return sortBy(series, ["x"]);
    }
  );
  const sortedBayAreaCountiesTimeSeriesObj = map(
    sortedBayAreaCountiesTimeSeries,
    (value, key) => {
      return { name: key, data: value };
    }
  );
  const groupedSortedBayAreaCountiesTimeSeriesObj = groupBy(
    sortedBayAreaCountiesTimeSeriesObj,
    (county) => {
      let key = county.name;
      forEach(
        [" new cases", " new deaths"],
        (suffix) => (key = replace(key, suffix, ""))
      );
      return key;
    }
  );
  const clonedGroupedSortedBayAreaCountiesTimeSeriesObj = cloneDeep(
    groupedSortedBayAreaCountiesTimeSeriesObj
  );
  const totalGroupedSortedBayAreaCountiesTimeSeriesObj = mapValues(
    clonedGroupedSortedBayAreaCountiesTimeSeriesObj,
    (countySeries) => {
      return map(countySeries, (series) => {
        let count = 0;
        series.name = replace(series.name, " new", " total");
        series.data = map(series.data, (timeSeriesObj) => {
          timeSeriesObj.y = count += timeSeriesObj.y;
          return timeSeriesObj;
        });
        return series;
      });
    }
  );
  const newAndTotalGroupedSortedBayAreaCountiesTimeSeriesObj = mapValues(
    totalGroupedSortedBayAreaCountiesTimeSeriesObj,
    (series, name) =>
      concat(series, groupedSortedBayAreaCountiesTimeSeriesObj[name])
  );

  const newAndTotalGroupedSortedBayAreaCountiesTimeSeriesObjWithFlags = mapValues(
    newAndTotalGroupedSortedBayAreaCountiesTimeSeriesObj,
    (series, name) => concat(series, NOTABLE_EVENTS)
  );
  const countyWithMultiples = mapValues(
    newAndTotalGroupedSortedBayAreaCountiesTimeSeriesObjWithFlags,
    (countySeries, name) => {
      return map(countySeries, (series) => {
        if (isEqual(series.type, "flags")) {
          return series;
        }
        const endTimestamp = moment(DATA_END_DATE).valueOf();
        const monthTimestamp = get(GRANULARITY_DATETIME, "month");
        const quarterTimestamp = get(GRANULARITY_DATETIME, "quarter");
        const halfYearTimestamp = get(GRANULARITY_DATETIME, "halfYear");
        const endData = find(series.data, ["x", endTimestamp]) || {};
        const monthData = find(series.data, ["x", monthTimestamp]) || {};
        const quarterData = find(series.data, ["x", quarterTimestamp]) || {};
        const halfYearData = find(series.data, ["x", halfYearTimestamp]) || {};
        let monthMultiple;
        let quarterMultiple;
        let halfYearMultiple;
        if (isNumber(endData.y) && isNumber(monthData.y) && monthData.y > 0) {
          monthMultiple = `${round(endData.y / monthData.y, 2)}x`;
        }
        if (
          isNumber(endData.y) &&
          isNumber(quarterData.y) &&
          quarterData.y > 0
        ) {
          quarterMultiple = `${round(endData.y / quarterData.y, 2)}x`;
        }
        if (
          isNumber(endData.y) &&
          isNumber(halfYearData.y) &&
          halfYearData.y > 0
        ) {
          halfYearMultiple = `${round(endData.y / halfYearData.y, 2)}x`;
        }
        series.multiples = {
          month: monthMultiple,
          quarter: quarterMultiple,
          halfYear: halfYearMultiple,
        };
        return series;
      });
    }
  );
  const countyWithGrowthRates = mapValues(
    countyWithMultiples,
    (countySeries, name) => {
      return map(countySeries, (series) => {
        if (isEqual(series.type, "flags")) {
          return series;
        }
        const endTimestamp = moment(DATA_END_DATE).valueOf();
        const monthTimestamp = get(GRANULARITY_DATETIME, "month");
        const quarterTimestamp = get(GRANULARITY_DATETIME, "quarter");
        const halfYearTimestamp = get(GRANULARITY_DATETIME, "halfYear");
        const endData = find(series.data, ["x", endTimestamp]) || {};
        const monthData = find(series.data, ["x", monthTimestamp]) || {};
        const quarterData = find(series.data, ["x", quarterTimestamp]) || {};
        const halfYearData = find(series.data, ["x", halfYearTimestamp]) || {};
        let monthGrowthRate;
        let quarterGrowthRate;
        let halfYearGrowthRate;
        if (isNumber(endData.y) && isNumber(monthData.y) && monthData.y > 0) {
          monthGrowthRate = `${round(
            ((endData.y - monthData.y) / monthData.y) * 100,
            2
          )}%`;
        }
        if (
          isNumber(endData.y) &&
          isNumber(quarterData.y) &&
          quarterData.y > 0
        ) {
          quarterGrowthRate = `${round(
            ((endData.y - quarterData.y) / quarterData.y) * 100,
            2
          )}%`;
        }
        if (
          isNumber(endData.y) &&
          isNumber(halfYearData.y) &&
          halfYearData.y > 0
        ) {
          halfYearGrowthRate = `${round(
            ((endData.y - halfYearData.y) / halfYearData.y) * 100,
            2
          )}%`;
        }
        series.growthRates = {
          month: monthGrowthRate,
          quarter: quarterGrowthRate,
          halfYear: halfYearGrowthRate,
        };
        return series;
      });
    }
  );
  const transformedCountiesData = mapValues(
    countyWithGrowthRates,
    (countySeries, name) => {
      return map(countySeries, (series) => {
        series.category = replace(series.name, `${name} `, "");
        series.name = startCase(series.category);
        if (isEqual(series.type, "flags")) {
          return series;
        }
        series.geography = name;
        series.category = replace(series.name, `${name} `, "");
        return series;
      });
    }
  );
  return transformedCountiesData;
}
