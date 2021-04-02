import { renderHook } from "@testing-library/react-hooks";
import store from "store2";
import { fetchAPIData } from "../api/fetchService";
import { useFetchAndStore } from "./useFetchAndStore";

jest.mock("store2");
jest.mock("../api/fetchService");

describe("useFetchAndStore", () => {
  test("get cached data", async () => {
    const payload = [
      {
        "3/22/2020": "24",
        "BAY AREA": "YES",
        CATEGORY: "cases",
        GEOGRAPHY: "San Francisco County",
        ROW: "80",
        TOTALS: "108",
      },
      {
        "3/22/2020": "0",
        "BAY AREA": "YES",
        CATEGORY: "deaths",
        GEOGRAPHY: "San Francisco County",
        ROW: "81",
        TOTALS: "0",
      },
    ];
    store.get.mockReturnValueOnce(payload);
    const { result } = renderHook(() => useFetchAndStore());
    expect.assertions(2);
    const { data: initialData, error } = result.current;
    expect(initialData).toEqual(payload);
    expect(error).toBeNull();
  });

  test("get fetched data", async () => {
    const payload = [
      {
        "3/22/2020": "24",
        "BAY AREA": "YES",
        CATEGORY: "cases",
        GEOGRAPHY: "San Francisco County",
        ROW: "80",
        TOTALS: "108",
      },
      {
        "3/22/2020": "0",
        "BAY AREA": "YES",
        CATEGORY: "deaths",
        GEOGRAPHY: "San Francisco County",
        ROW: "81",
        TOTALS: "0",
      },
    ];
    fetchAPIData.mockResolvedValueOnce(payload);
    const { result, waitForNextUpdate } = renderHook(() => useFetchAndStore());
    expect.assertions(3);
    const { data: initialData } = result.current;
    expect(initialData).toEqual([]);
    await waitForNextUpdate();
    const { data: fetchedData, error } = result.current;
    expect(fetchedData).toEqual(payload);
    expect(error).toBeNull();
  });
});
