import {
  cloneDeep,
  concat,
  isEqual,
  forEach,
  groupBy,
  isNumber,
  keyBy,
  last,
  map,
  mapValues,
  nth,
  omit,
  replace,
  round,
  sortBy,
  startCase,
  toNumber,
} from "lodash";
import moment from "moment";
import { useFetchAndStore } from "./useFetchAndStore";
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
    (seriesArray) => {
      return map(seriesArray, (series) => {
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
    (series, name) => {
      series = concat(series, groupedSortedBayAreaCountiesTimeSeriesObj[name]);
      return series;
    }
  );

  const newAndTotalGroupedSortedBayAreaCountiesTimeSeriesObjWithFlags = mapValues(
    newAndTotalGroupedSortedBayAreaCountiesTimeSeriesObj,
    (series, name) => {
      series = concat(series, NOTABLE_EVENTS);
      return series;
    }
  );
  const countyWithMultiples = mapValues(
    newAndTotalGroupedSortedBayAreaCountiesTimeSeriesObjWithFlags,
    (series, name) => {
      return map(series, (series) => {
        if (isEqual(series.type, "flags")) {
          return series;
        }
        const now = last(series.data) || {};
        const month = nth(series.data, -30) || {};
        const quarter = nth(series.data, -90) || {};
        const halfYear = nth(series.data, -180) || {};
        let monthMultiple;
        let quarterMultiple;
        let halfYearMultiple;
        if (isNumber(now.y) && isNumber(month.y) && month.y > 0) {
          monthMultiple = `${round(now.y / month.y, 2)}x`;
        }
        if (isNumber(now.y) && isNumber(quarter.y) && quarter.y > 0) {
          quarterMultiple = `${round(now.y / quarter.y, 2)}x`;
        }
        if (isNumber(now.y) && isNumber(halfYear.y) && halfYear.y > 0) {
          halfYearMultiple = `${round(now.y / halfYear.y, 2)}x`;
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
    (series, name) => {
      return map(series, (series) => {
        if (isEqual(series.type, "flags")) {
          return series;
        }
        const now = last(series.data) || {};
        const month = nth(series.data, -30) || {};
        const quarter = nth(series.data, -90) || {};
        const halfYear = nth(series.data, -180) || {};
        let monthGrowthRate;
        let quarterGrowthRate;
        let halfYearGrowthRate;
        if (isNumber(now.y) && isNumber(month.y) && month.y > 0) {
          monthGrowthRate = `${round(((now.y - month.y) / month.y) * 100, 2)}%`;
        }
        if (isNumber(now.y) && isNumber(quarter.y) && quarter.y > 0) {
          quarterGrowthRate = `${round(
            ((now.y - quarter.y) / quarter.y) * 100,
            2
          )}%`;
        }
        if (isNumber(now.y) && isNumber(halfYear.y) && halfYear.y > 0) {
          halfYearGrowthRate = `${round(
            ((now.y - halfYear.y) / halfYear.y) * 100,
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
    (series, name) => {
      return map(series, (series) => {
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
