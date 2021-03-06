import React from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { merge } from "lodash";
import styled from "styled-components/macro";
import { LINE_CHART, STOCK_CHART } from "../utils/chartConstants";

const StyledChart = styled.div`
  margin-bottom: 16px;
  flex-grow: 1;
`;

/**
 * Presenter for Highcharts wrapper.
 */
function Chart({ endDateTime, startDateTime, series }) {
  const options = {
    xAxis: {
      ceiling: endDateTime,
      floor: startDateTime,
      labels: {
        format: "{value:%Y-%m-%d}",
      },
      type: "datetime",
    },
    series: series,
  };
  const mergedOptions = merge({}, LINE_CHART, options);
  return (
    <StyledChart data-testid="chart">
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={STOCK_CHART}
        options={mergedOptions}
      />
    </StyledChart>
  );
}

export default Chart;
