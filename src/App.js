import React, { useState } from "react";
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
import * as firebase from "firebase/app";
import "firebase/analytics";
import moment from "moment";
import { Container } from "@material-ui/core";
import styled from "styled-components/macro";
import Counties from "./components/Counties";
import DrawerButtonGroup from "./components/DrawerButtonGroup";
import Footer from "./components/Footer";
import Header from "./components/Header";
import PopperButtonGroup from "./components/PopperButtonGroup";
import { useFetchAndStore } from "./hooks/useFetchAndStore";
import { NOTABLE_EVENTS } from "./utils/eventConstants";
import { FIREBASE_CONFIG } from "./utils/firebaseConstants";

const StyledContainer = styled(Container)`
  background: white;
`;

const StyledFabContainer = styled(Container)`
  position: fixed;
  bottom: 44px;
  display: flex;
  justify-content: flex-end;
`;

firebase.initializeApp(FIREBASE_CONFIG);
firebase.analytics();

const GRANULARITY_DATETIME = {
  week: moment().subtract(7, "days").valueOf(),
  month: moment().subtract(30, "days").valueOf(),
  year: moment("2020-01-25").valueOf(),
};

function App() {
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

  const [granularity, setGranularity] = useState("week");
  const [category, setCategory] = useState("Total");
  const [aggregator, setAggregator] = useState("multiples");

  const startDateTime = GRANULARITY_DATETIME[granularity];

  const handleGranularity = (event, newGranularity) => {
    setGranularity(newGranularity);
  };

  const handleCategory = (event, newCategory) => {
    setCategory(newCategory);
  };

  const handleAggregator = (event, newAggregator) => {
    setAggregator(newAggregator);
  };

  const countyWithMultiples = mapValues(
    newAndTotalGroupedSortedBayAreaCountiesTimeSeriesObjWithFlags,
    (series, name) => {
      return map(series, (series) => {
        if (isEqual(series.type, "flags")) {
          return series;
        }
        const now = last(series.data) || {};
        const week = nth(series.data, -7) || {};
        const month = nth(series.data, -30) || {};
        let weekMultiple;
        let monthMultiple;
        if (isNumber(now.y) && isNumber(week.y) && week.y > 0) {
          weekMultiple = `${round(now.y / week.y, 2)}x`;
        }
        if (isNumber(now.y) && isNumber(month.y) && month.y > 0) {
          monthMultiple = `${round(now.y / month.y, 2)}x`;
        }
        series.multiples = { week: weekMultiple, month: monthMultiple };
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
        const week = nth(series.data, -7) || {};
        const month = nth(series.data, -30) || {};
        let weekGrowthRate;
        let monthGrowthRate;
        if (isNumber(now.y) && isNumber(week.y) && week.y > 0) {
          weekGrowthRate = `${round(((now.y - week.y) / week.y) * 100, 2)}%`;
        }
        if (isNumber(now.y) && isNumber(month.y) && month.y > 0) {
          monthGrowthRate = `${round(((now.y - month.y) / month.y) * 100, 2)}%`;
        }
        series.growthRates = { week: weekGrowthRate, month: monthGrowthRate };
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
  return (
    <StyledContainer>
      <Header />
      <Counties
        transformedCountiesData={transformedCountiesData}
        category={category}
        granularity={granularity}
        aggregator={aggregator}
        startDateTime={startDateTime}
      />
      <StyledFabContainer>
        <DrawerButtonGroup
          aggregator={aggregator}
          handleAggregator={handleAggregator}
          category={category}
          handleCategory={handleCategory}
          granularity={granularity}
          handleGranularity={handleGranularity}
        />
        <PopperButtonGroup
          aggregator={aggregator}
          handleAggregator={handleAggregator}
          category={category}
          handleCategory={handleCategory}
          granularity={granularity}
          handleGranularity={handleGranularity}
        />
      </StyledFabContainer>
      <Footer />
    </StyledContainer>
  );
}

export default App;
