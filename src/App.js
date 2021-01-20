import React, { useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import {
  cloneDeep,
  concat,
  isEqual,
  forEach,
  get,
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
  startsWith,
  toNumber,
  trimEnd,
} from "lodash";
import * as firebase from "firebase/app";
import "firebase/analytics";
import moment from "moment";
import { Container } from "@material-ui/core";
import Box from "@material-ui/core/Card";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components/macro";
import DrawerButtonGroup from "./components/DrawerButtonGroup";
import PopperButtonGroup from "./components/PopperButtonGroup";
import { useFetchAndStore } from "./hooks/useFetchAndStore";
import { FIREBASE_CONFIG } from "./utils/firebaseConstants";

const StyledContainer = styled(Container)`
  background: white;
`;

const StyledCard = styled(Card)`
  margin-bottom: 16px;
`;

const StyledBox = styled(Box)`
  box-shadow: none;
  margin-bottom: 16px;
`;

const StyledCountyContainer = styled.div``;
const StyledAggregatorContainer = styled.div`
  display: flex;
  margin-bottom: 16px;

  @media screen and (max-width: 600px) {
    margin-bottom: 12px;
  }
`;

const StyledAggregatorCard = styled(Card)`
  margin-right: 8px;
  flex-grow: 1;

  &:last-child {
    margin-right: 0;
  }

  @media screen and (max-width: 600px) {
    margin-bottom: 12px;
  }
`;

const StyledFabContainer = styled(Container)`
  position: fixed;
  bottom: 44px;
  display: flex;
  justify-content: flex-end;
`;

const ChartWrapper = styled.div`
  margin-bottom: 16px;
  flex-grow: 1;
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

  const NOTABLE_EVENTS = [
    {
      type: "flags",
      name: "Notable Events",
      shape: "circlepin",
      showInLegend: false,
      data: [
        {
          x: moment("2020-03-11").valueOf(),
          title: "E",
          text: "WHO declares COVID 19 a pandemic.",
        },
        {
          x: moment("2020-03-16").valueOf(),
          title: "E",
          text: "Bay Area orders Shelter in Place",
        },
        {
          x: moment("2020-03-19").valueOf(),
          title: "E",
          text: "California orders Stay at Home",
        },
        {
          x: moment("2020-03-24").valueOf(),
          title: "E",
          text: "California closes vehicular traffic to state parks",
        },
      ],
    },
  ];

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

  let id = 0;
  return (
    <StyledContainer>
      <StyledCard elevation={0}>
        <CardContent>
          <Typography gutterBottom variant="h4" component="h1">
            Bay Area Corona Virus Tracker - alpha
          </Typography>
          <Typography variant="body1" color="textSecondary" component="p">
            Monitor corona virus growth rates across Bay Area counties. Keep
            your friends and family informed. Let's flatten the curve together!
          </Typography>
        </CardContent>
      </StyledCard>

      {map(transformedCountiesData, (series, name) => {
        id++;
        series = map(series, (series) => {
          const isActive = startsWith(series.category, category);
          series.visible = isActive || isEqual(series.type, "flags");
          series.showInLegend = isActive;
          return series;
        });
        const options = {
          chart: {
            type: "line",
            zoomType: "x",
          },
          xAxis: {
            floor: startDateTime,
            labels: {
              format: "{value:%m-%d}",
            },
            type: "datetime",
          },
          yAxis: {
            title: {
              enabled: false,
            },
            min: 0,
          },
          credits: {
            enabled: false,
          },
          legend: {
            enabled: true,
          },
          navigator: {
            enabled: false,
          },
          rangeSelector: {
            enabled: false,
          },
          scrollbar: {
            enabled: false,
          },
          tooltip: {
            xDateFormat: "%m-%d",
          },
          series: series,
        };
        return (
          <StyledCountyContainer key={`${id}_foo`}>
            <StyledBox>
              <Typography variant="h5" component="h2">
                {name}
              </Typography>
            </StyledBox>
            <StyledAggregatorContainer>
              {map(series, (series) => {
                if (isEqual(series.name, "Notable Events")) {
                  return;
                }
                if (!startsWith(series.category, category)) {
                  return;
                }
                if (isEqual(granularity, "year")) {
                  return;
                }
                return (
                  <StyledAggregatorCard
                    key={`${series.name}_${aggregator}_${granularity}`}
                    variant="outlined"
                  >
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        {startCase(series.category)}
                      </Typography>
                      <Typography variant="h5" component="h3">
                        {get(series, `${aggregator}.${granularity}`, "-")}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {startCase(trimEnd(aggregator, "s"))}
                      </Typography>
                    </CardContent>
                  </StyledAggregatorCard>
                );
              })}
            </StyledAggregatorContainer>
            <ChartWrapper key={id}>
              <HighchartsReact
                highcharts={Highcharts}
                constructorType={"stockChart"}
                options={options}
              />
            </ChartWrapper>
          </StyledCountyContainer>
        );
      })}
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

      <Typography align="center" variant="caption" component="h6">
        <p>
          <span>
            The time series data on this page is sourced from SF
            Chronicle's&nbsp;
          </span>
          <a href="https://projects.sfchronicle.com/2020/coronavirus-map/">
            Coronavirus Tracker
          </a>
          <span>
            . Original data compiled by the SF Chronicle was collected from
            the&nbsp;
            <a href="https://www.cdc.gov/coronavirus/2019-ncov/cases-in-us.html">
              Centers for Disese Control
            </a>
            ,&nbsp;
            <a href="https://www.cdph.ca.gov/Programs/CID/DCDC/Pages/Immunization/nCOV2019.aspx">
              California Department of Public Health
            </a>
            , and individual county public health departments.
          </span>
        </p>
        <p>
          <span>Created by Hinsen Chan</span>
          <br />
          <a
            href="https://github.com/hinsenchan"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://github.com/hinsenchan
          </a>
        </p>
      </Typography>
    </StyledContainer>
  );
}

export default App;
