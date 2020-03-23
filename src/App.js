import React from 'react';
import logo from './logo.svg';
import './App.css';

async function fetchData() {
  const response = await fetch("https://files.sfchronicle.com/project-feeds/covid19_us_cases_ca_by_county_.json");
  const payload = await response.json();
  console.log(payload);
}

function App() {
  fetchData()
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
