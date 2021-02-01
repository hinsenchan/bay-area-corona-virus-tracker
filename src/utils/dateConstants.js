import moment from "moment";

export const DATA_START_DATE = "2020-01-25";
export const DATA_END_DATE = "2020-09-22";

// TODO: Convert granularity timestamp values into constants.
export const GRANULARITY_DATETIME = {
  month: moment(DATA_END_DATE).subtract(30, "days").valueOf(),
  quarter: moment(DATA_END_DATE).subtract(90, "days").valueOf(),
  halfYear: moment(DATA_END_DATE).subtract(180, "days").valueOf(),
  max: moment(DATA_START_DATE).valueOf(),
};
