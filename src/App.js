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
import "./App.css";

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
        return { x: moment(key).valueOf(), y: toNumber(value) };
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

  let id = 0;
  return (
    <div className="App">
      <h1>Bay Area Corona Virus Tracker - alpha</h1>
      <p>
        Monitor corona virus growth rates across Bay Area counties. Keep your
        friends and family informed. Let's flatten the curve together!
      </p>
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
            plotOptions: {
              series: {
                marker: {
                  enabled: true
                }
              }
            },
            xAxis: {
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
            <HighchartsReact
              key={id}
              highcharts={Highcharts}
              constructorType={"stockChart"}
              options={options}
            />
          );
        }
      )}
      <h6>
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
      </h6>
    </div>
  );
}

export default App;
