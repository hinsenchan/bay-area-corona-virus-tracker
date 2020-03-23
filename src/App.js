import React, {useState, useEffect} from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import {isEmpty, isEqual, keyBy, map, mapValues, omit, sortBy, toNumber} from "lodash";
import * as firebase from "firebase/app";
import "firebase/analytics";
import moment from "moment";
import store from "store2";
import './App.css';

const firebaseConfig = {
  apiKey: "AIzaSyCGQ0tYppWFJkuSxBhOpkH0xVDmX245Vdc",
  authDomain: "project-id.firebaseapp.com",
  databaseURL: "https://project-id.firebaseio.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "637908496727",
  appId: "2:637908496727:web:a4284b4c99e329d5",
  measurementId: "G-9VP01NDSXJ"
};

firebase.initializeApp(firebaseConfig);

async function fetchAPIData() {
  const response = await fetch("https://files.sfchronicle.com/project-feeds/covid19_us_cases_ca_by_county_.json");
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

  const bayAreaCounties = data.filter((county)=>isEqual(county["BAY AREA"], "YES"));
  const bayAreaCountiesDataSet = keyBy(bayAreaCounties, (county)=>`${county["GEOGRAPHY"]} ${county["CATEGORY"]}`);
  const bayAreaCountiesTimeSeriesObj = mapValues(bayAreaCountiesDataSet, (county)=>{return omit(county, ["ROW", "GEOGRAPHY", "BAY AREA", "CATEGORY", "TOTALS"]);});
  const bayAreaCountiesTimeSeries = mapValues(bayAreaCountiesTimeSeriesObj, (county)=>{return map(county, (value, key)=>{return {x: moment(key).valueOf(), y: toNumber(value)}})})
  const sortedBayAreaCountiesTimeSeries = mapValues(bayAreaCountiesTimeSeries, (series)=>{return sortBy(series, ["x"]);})
  console.log(sortedBayAreaCountiesTimeSeries);
  let id = 0;
  return (
    <div className="App">
      {map(sortedBayAreaCountiesTimeSeries, (series, name)=>{
        id++;
        const options = {
          title: {
            text: name
          },
          chart: {
            zoomType: 'x'
          },
          xAxis: {
            labels: {
              format: '{value:%m-%d}'
            },
          },          
          series: [{
            data: series
          }]          
        }
        return (<HighchartsReact
          key={id}
          highcharts={Highcharts}
          options={options}
          />)
      })}
      <div>Created by Hinsen Chan</div>
      <a href="https://github.com/hinsenchan" target="_blank" rel="noopener noreferrer">https://github.com/hinsenchan</a>
    </div>
  );
}

export default App;
