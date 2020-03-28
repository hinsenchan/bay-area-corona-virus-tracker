import React, { useState, useEffect } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import {
  cloneDeep,
  concat,
  isEmpty,
  isEqual,
  forEach,
  groupBy,
  keyBy,
  map,
  mapValues,
  omit,
  replace,
  sortBy,
  toNumber
} from "lodash";
import * as firebase from "firebase/app";
import "firebase/analytics";
import moment from "moment";
import store from "store2";
import { Container } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components/macro";

const StyledContainer = styled(Container)`
  background: white;
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
`;

const StyledCardActions = styled(CardActions)`
  justify-content: center;
`;

const ChartWrapper = styled.div`
  margin-bottom: 16px;
`;

const firebaseConfig = {
  apiKey: "AIzaSyAOs83YSuTuIKk-Zob_QFw49IM6_k-AM3w",
  authDomain: "bay-area-corona-virus-tracker.firebaseapp.com",
  databaseURL: "https://bay-area-corona-virus-tracker.firebaseio.com",
  projectId: "bay-area-corona-virus-tracker",
  storageBucket: "bay-area-corona-virus-tracker.appspot.com",
  messagingSenderId: "971181577619",
  appId: "1:971181577619:web:f8aba198bdf5a2177ac466",
  measurementId: "G-Z8F0C0GN96"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

async function fetchAPIData() {
  const response = await fetch(
    "https://files.sfchronicle.com/project-feeds/covid19_us_cases_ca_by_county_.json"
  );
  const payload = await response.json();
  return payload;
}

async function fetchAndStore(key, data, setData) {
  if (isEmpty(data)) {
    const payload = await fetchAPIData();
    setStoreData(key, payload);
    setData(payload);
  }
}

function setStoreData(key, payload) {
  store.set(key, payload);
}

function getStoreData(key) {
  return store.get(key);
}

const GRANULARITY_DATETIME = {
  week: moment()
    .subtract(7, "days")
    .valueOf(),
  month: moment()
    .subtract(30, "days")
    .valueOf(),
  year: moment("2020-01-25").valueOf()
};

function App() {
  const key = moment().format("YYYY-MM-DD");
  const storeData = getStoreData(key) || [];
  const [data, setData] = useState(storeData);

  useEffect(() => {
    fetchAndStore(key, data, setData);
  }, [key, data]);

  const bayAreaCounties = data.filter(county =>
    isEqual(county["BAY AREA"], "YES")
  );
  const bayAreaCountiesDataSet = keyBy(
    bayAreaCounties,
    county => `${county["GEOGRAPHY"]} new ${county["CATEGORY"]}`
  );
  const bayAreaCountiesTimeSeriesObj = mapValues(
    bayAreaCountiesDataSet,
    county => {
      return omit(county, [
        "ROW",
        "GEOGRAPHY",
        "BAY AREA",
        "CATEGORY",
        "TOTALS"
      ]);
    }
  );
  const bayAreaCountiesTimeSeries = mapValues(
    bayAreaCountiesTimeSeriesObj,
    county => {
      return map(county, (value, key) => {
        return { x: moment(key, "MM-DD-YYYY").valueOf(), y: toNumber(value) };
      });
    }
  );
  const sortedBayAreaCountiesTimeSeries = mapValues(
    bayAreaCountiesTimeSeries,
    series => {
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
    county => {
      let key = county.name;
      forEach(
        [" new cases", " new deaths"],
        suffix => (key = replace(key, suffix, ""))
      );
      return key;
    }
  );
  const clonedGroupedSortedBayAreaCountiesTimeSeriesObj = cloneDeep(
    groupedSortedBayAreaCountiesTimeSeriesObj
  );
  const totalGroupedSortedBayAreaCountiesTimeSeriesObj = mapValues(
    clonedGroupedSortedBayAreaCountiesTimeSeriesObj,
    seriesArray => {
      return map(seriesArray, series => {
        let count = 0;
        series.name = replace(series.name, " new", " total");
        series.data = map(series.data, timeSeriesObj => {
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
      data: [
        {
          x: moment("2020-03-11").valueOf(),
          title: "E",
          text: "WHO declares COVID 19 a pandemic."
        },
        {
          x: moment("2020-03-16").valueOf(),
          title: "E",
          text: "Bay Area orders Shelter in Place"
        },
        {
          x: moment("2020-03-19").valueOf(),
          title: "E",
          text: "California orders Stay at Home"
        },
        {
          x: moment("2020-03-24").valueOf(),
          title: "E",
          text: "California closes vehicular traffic to state parks"
        }
      ]
    }
  ];

  const newAndTotalGroupedSortedBayAreaCountiesTimeSeriesObjWithFlags = mapValues(
    newAndTotalGroupedSortedBayAreaCountiesTimeSeriesObj,
    (series, name) => {
      series = concat(series, NOTABLE_EVENTS);
      return series;
    }
  );

  const [granularity, setGranularity] = useState("month");

  const startDateTime = GRANULARITY_DATETIME[granularity];

  const handleGranularity = (event, newGranularity) => {
    setGranularity(newGranularity);
  };

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
        <StyledCardActions>
          <ToggleButtonGroup
            value={granularity}
            exclusive
            onChange={handleGranularity}
            aria-label="granularity"
          >
            <ToggleButton value="week" aria-label="week">
              Week
            </ToggleButton>
            <ToggleButton value="month" aria-label="month">
              Month
            </ToggleButton>
            <ToggleButton value="year" aria-label="year">
              YTD
            </ToggleButton>
          </ToggleButtonGroup>
        </StyledCardActions>
      </StyledCard>

      {map(
        newAndTotalGroupedSortedBayAreaCountiesTimeSeriesObjWithFlags,
        (series, name) => {
          id++;
          const options = {
            title: {
              text: name
            },
            chart: {
              type: "line",
              zoomType: "x"
            },
            xAxis: {
              floor: startDateTime,
              labels: {
                format: "{value:%m-%d}"
              },
              type: "datetime"
            },
            yAxis: {
              title: {
                enabled: false
              },
              min: 0
            },
            credits: {
              enabled: false
            },
            legend: {
              enabled: true
            },
            navigator: {
              enabled: false
            },
            rangeSelector: {
              enabled: false
            },
            scrollbar: {
              enabled: false
            },
            tooltip: {
              xDateFormat: "%m-%d"
            },
            series: series
          };
          return (
            <ChartWrapper key={id}>
              <HighchartsReact
                highcharts={Highcharts}
                constructorType={"stockChart"}
                options={options}
              />
            </ChartWrapper>
          );
        }
      )}
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
