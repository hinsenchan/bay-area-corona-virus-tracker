import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
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
import { Helmet } from "react-helmet";
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

  let id = 0;
  return (
    <div className="App">
      <Helmet>
        <title>Bay Area Corona Virus Tracker</title>
        <meta
          name="description"
          content="Track corona virus growth rates across Bay Area counties. Let's flatten the curve together!"
        />
      </Helmet>
      {map(
        newAndTotalGroupedSortedBayAreaCountiesTimeSeriesObj,
        (series, name) => {
          id++;
          const options = {
            title: {
              text: name
            },
            chart: {
              zoomType: "x"
            },
            xAxis: {
              labels: {
                format: "{value:%m-%d}"
              },
              type: "datetime"
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
              options={options}
            />
          );
        }
      )}
      <div>Created by Hinsen Chan</div>
      <a
        href="https://github.com/hinsenchan"
        target="_blank"
        rel="noopener noreferrer"
      >
        https://github.com/hinsenchan
      </a>
    </div>
  );
}

export default App;
