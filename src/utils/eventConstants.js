import moment from "moment";

export const NOTABLE_EVENTS = [
  {
    type: "flags",
    name: "Notable Events",
    shape: "circlepin",
    showInLegend: false,
    data: [
      {
        x: moment("2020-03-11").valueOf(),
        title: "E",
        text: "WHO declares COVID 19 a pandemic.",
      },
      {
        x: moment("2020-03-16").valueOf(),
        title: "E",
        text: "Bay Area orders Shelter in Place",
      },
      {
        x: moment("2020-03-19").valueOf(),
        title: "E",
        text: "California orders Stay at Home",
      },
      {
        x: moment("2020-03-24").valueOf(),
        title: "E",
        text: "California closes vehicular traffic to state parks",
      },
    ],
  },
];
