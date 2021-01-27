export const LINE_CHART = {
  chart: {
    type: "line",
    zoomType: "x",
  },
  xAxis: {
    labels: {
      format: "{value:%Y-%m-%d}",
    },
    type: "datetime",
  },
  yAxis: {
    title: {
      enabled: false,
    },
    min: 0,
  },
  credits: {
    enabled: false,
  },
  legend: {
    enabled: true,
  },
  navigator: {
    enabled: false,
  },
  rangeSelector: {
    enabled: false,
  },
  scrollbar: {
    enabled: false,
  },
  tooltip: {
    xDateFormat: "%Y-%m-%d",
  },
  series: [
    {
      data: [],
    },
  ],
};

export const STOCK_CHART = "stockChart";
