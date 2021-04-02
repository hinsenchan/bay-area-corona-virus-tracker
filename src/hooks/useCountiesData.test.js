import { renderHook } from "@testing-library/react-hooks";
import { useCountiesData } from "./useCountiesData";
import { useFetchAndStore } from "./useFetchAndStore";

jest.mock("./useFetchAndStore");

test("useCountiesData", () => {
  const fetchedData = [
    {
      c2p_pubdate: "January 27, 2020 6:00 PM",
      ROW: "2",
      GEOGRAPHY: "CALIFORNIA",
      "BAY AREA": "",
      CATEGORY: "cases",
      TOTALS: "12",
      "1/26/20": "6",
      "1/25/20": "6",
    },
    {
      ROW: "3",
      GEOGRAPHY: "CALIFORNIA",
      "BAY AREA": "",
      CATEGORY: "deaths",
      TOTALS: "10",
      "1/26/20": "5",
      "1/25/20": "5",
    },
    {
      ROW: "4",
      GEOGRAPHY: "BAY AREA",
      "BAY AREA": "YES",
      CATEGORY: "cases",
      TOTALS: "8",
      "1/26/20": "4",
      "1/25/20": "4",
    },
    {
      ROW: "5",
      GEOGRAPHY: "BAY AREA",
      "BAY AREA": "YES",
      CATEGORY: "deaths",
      TOTALS: "6",
      "1/26/20": "3",
      "1/25/20": "3",
    },

    {
      ROW: "80",
      GEOGRAPHY: "San Francisco County",
      "BAY AREA": "YES",
      CATEGORY: "cases",
      TOTALS: "4",
      "1/26/20": "2",
      "1/25/20": "2",
    },
    {
      ROW: "81",
      GEOGRAPHY: "San Francisco County",
      "BAY AREA": "YES",
      CATEGORY: "deaths",
      TOTALS: "2",
      "1/26/20": "1",
      "1/25/20": "1",
    },
  ];
  useFetchAndStore.mockReturnValueOnce({ data: fetchedData, error: null });
  const { result } = renderHook(() => useCountiesData());
  const { data, error } = result.current;
  expect(data).toEqual({
    "BAY AREA": [
      {
        category: "Total Cases",
        data: [
          {
            x: 1579939200000,
            y: 4,
          },
          {
            x: 1580025600000,
            y: 8,
          },
        ],
        geography: "BAY AREA",
        growthRates: {
          halfYear: undefined,
          month: undefined,
          quarter: undefined,
        },
        multiples: {
          halfYear: undefined,
          month: undefined,
          quarter: undefined,
        },
        name: "Total Cases",
      },
      {
        category: "Total Deaths",
        data: [
          {
            x: 1579939200000,
            y: 3,
          },
          {
            x: 1580025600000,
            y: 6,
          },
        ],
        geography: "BAY AREA",
        growthRates: {
          halfYear: undefined,
          month: undefined,
          quarter: undefined,
        },
        multiples: {
          halfYear: undefined,
          month: undefined,
          quarter: undefined,
        },
        name: "Total Deaths",
      },
      {
        category: "New Cases",
        data: [
          {
            x: 1579939200000,
            y: 4,
          },
          {
            x: 1580025600000,
            y: 4,
          },
        ],
        geography: "BAY AREA",
        growthRates: {
          halfYear: undefined,
          month: undefined,
          quarter: undefined,
        },
        multiples: {
          halfYear: undefined,
          month: undefined,
          quarter: undefined,
        },
        name: "New Cases",
      },
      {
        category: "New Deaths",
        data: [
          {
            x: 1579939200000,
            y: 3,
          },
          {
            x: 1580025600000,
            y: 3,
          },
        ],
        geography: "BAY AREA",
        growthRates: {
          halfYear: undefined,
          month: undefined,
          quarter: undefined,
        },
        multiples: {
          halfYear: undefined,
          month: undefined,
          quarter: undefined,
        },
        name: "New Deaths",
      },
      {
        category: "Notable Events",
        data: [
          {
            text: "WHO declares COVID 19 a pandemic.",
            title: "E",
            x: 1583910000000,
          },
          {
            text: "Bay Area orders Shelter in Place",
            title: "E",
            x: 1584342000000,
          },
          {
            text: "California orders Stay at Home",
            title: "E",
            x: 1584601200000,
          },
          {
            text: "California closes vehicular traffic to state parks",
            title: "E",
            x: 1585033200000,
          },
        ],
        name: "Notable Events",
        shape: "circlepin",
        showInLegend: false,
        type: "flags",
      },
    ],
    "San Francisco County": [
      {
        category: "Total Cases",
        data: [
          {
            x: 1579939200000,
            y: 2,
          },
          {
            x: 1580025600000,
            y: 4,
          },
        ],
        geography: "San Francisco County",
        growthRates: {
          halfYear: undefined,
          month: undefined,
          quarter: undefined,
        },
        multiples: {
          halfYear: undefined,
          month: undefined,
          quarter: undefined,
        },
        name: "Total Cases",
      },
      {
        category: "Total Deaths",
        data: [
          {
            x: 1579939200000,
            y: 1,
          },
          {
            x: 1580025600000,
            y: 2,
          },
        ],
        geography: "San Francisco County",
        growthRates: {
          halfYear: undefined,
          month: undefined,
          quarter: undefined,
        },
        multiples: {
          halfYear: undefined,
          month: undefined,
          quarter: undefined,
        },
        name: "Total Deaths",
      },
      {
        category: "New Cases",
        data: [
          {
            x: 1579939200000,
            y: 2,
          },
          {
            x: 1580025600000,
            y: 2,
          },
        ],
        geography: "San Francisco County",
        growthRates: {
          halfYear: undefined,
          month: undefined,
          quarter: undefined,
        },
        multiples: {
          halfYear: undefined,
          month: undefined,
          quarter: undefined,
        },
        name: "New Cases",
      },
      {
        category: "New Deaths",
        data: [
          {
            x: 1579939200000,
            y: 1,
          },
          {
            x: 1580025600000,
            y: 1,
          },
        ],
        geography: "San Francisco County",
        growthRates: {
          halfYear: undefined,
          month: undefined,
          quarter: undefined,
        },
        multiples: {
          halfYear: undefined,
          month: undefined,
          quarter: undefined,
        },
        name: "New Deaths",
      },
      {
        category: "Notable Events",
        data: [
          {
            text: "WHO declares COVID 19 a pandemic.",
            title: "E",
            x: 1583910000000,
          },
          {
            text: "Bay Area orders Shelter in Place",
            title: "E",
            x: 1584342000000,
          },
          {
            text: "California orders Stay at Home",
            title: "E",
            x: 1584601200000,
          },
          {
            text: "California closes vehicular traffic to state parks",
            title: "E",
            x: 1585033200000,
          },
        ],
        name: "Notable Events",
        shape: "circlepin",
        showInLegend: false,
        type: "flags",
      },
    ],
  });
  expect(error).toBeNull();
});
