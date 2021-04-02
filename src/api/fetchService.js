import { ApiError } from "../utils/errors";
import { COVID_19_CASES_AND_DEATHS_URL } from "../utils/urlConstants";

/**
 * Get a list of Covid-19 cases and deaths by SF Bay Area county
 * @returns {Promise} list of Covid-19 cases and deaths
 */
export async function fetchAPIData() {
  try {
    const response = await fetch(COVID_19_CASES_AND_DEATHS_URL);
    const payload = await response.json();
    return payload;
  } catch (error) {
    throw new ApiError();
  }
}
