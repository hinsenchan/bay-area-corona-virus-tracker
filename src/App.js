import React, {useState, useEffect} from 'react';
import {isEmpty, isEqual, keyBy, map, mapValues, omit, toNumber} from "lodash";
import moment from "moment";
import store from "store2";
import logo from './logo.svg';
import './App.css';

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
  console.log(bayAreaCountiesTimeSeries);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
