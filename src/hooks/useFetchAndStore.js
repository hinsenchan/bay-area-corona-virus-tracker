import { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import moment from "moment";
import store from "store2";
import { fetchAPIData } from "../api/fetchService";

/**
 * Cache data into local storage
 * @param {string} key
 * @param {Array} data
 * @returns {void}
 */
function setStoreData(key, data) {
  store.set(key, data);
}

/**
 * Get cached data from local storage
 * @param {string} key
 * @returns {Array} data
 */
function getStoreData(key) {
  return store.get(key);
}

/**
 * Fetch data, cache into local storage, execute callback
 * @param {string} key
 * @param {Array} data
 * @param {Function} setData
 * @returns {void}
 */
async function fetchAndStore(key, data, setData) {
  if (isEmpty(data)) {
    const payload = await fetchAPIData();
    setStoreData(key, payload);
    setData(payload);
  }
}

/**
 * Fetch today's data, cache into local storage, set local React state.
 * @returns {Array} payload data
 */
export function useFetchAndStore() {
  const key = moment().format("YYYY-MM-DD");
  const storeData = getStoreData(key) || [];
  const [data, setData] = useState(storeData);

  useEffect(() => {
    fetchAndStore(key, data, setData);
  }, [key, data]);

  return data;
}
