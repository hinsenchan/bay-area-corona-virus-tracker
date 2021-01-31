import React from "react";
import { render } from "@testing-library/react";
import Chart from "./Chart";

describe("Chart", () => {
  const START_TIMESTAMP = 0;
  const END_TIMESTAMP = 100;
  const START_VALUE = 1;
  const END_VALUE = 100;
  test("smoke test", () => {
    const series = [
      {
        data: [
          { x: START_TIMESTAMP, y: START_VALUE },
          { x: END_TIMESTAMP, y: END_VALUE },
        ],
      },
    ];
    const { container } = render(<Chart series={series} />);
    const highchartsSeries = container.querySelectorAll(".highcharts-series");
    expect(highchartsSeries).toHaveLength(1);
    expect(highchartsSeries[0]).toHaveClass("highcharts-series-0");
  });
});
