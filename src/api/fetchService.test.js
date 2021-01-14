import { COVID_19_CASES_AND_DEATHS_URL } from "../utils/urlConstants";
import { fetchAPIData } from "./fetchService";

describe("fetchService", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe("fetchAPIData", () => {
    test("fetch success", async () => {
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
      fetch.mockResponseOnce(JSON.stringify(payload));
      expect.assertions(3);
      await expect(fetchAPIData()).resolves.toEqual(payload);
      expect(fetch.mock.calls.length).toEqual(1);
      expect(fetch.mock.calls[0][0]).toEqual(COVID_19_CASES_AND_DEATHS_URL);
    });

    test("fetch error", async () => {
      const response = new Error("Failed Fetch");
      fetch.mockRejectOnce(response);
      expect.assertions(3);
      await expect(fetchAPIData()).rejects.toEqual(response);
      expect(fetch.mock.calls.length).toEqual(1);
      expect(fetch.mock.calls[0][0]).toEqual(COVID_19_CASES_AND_DEATHS_URL);
    });
  });
});
