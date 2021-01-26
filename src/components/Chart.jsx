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

function Chart({ startDateTime, series }) {
  const options = {
    xAxis: {
      floor: startDateTime,
      labels: {
        format: "{value:%m-%d}",
      },
      type: "datetime",
    },
    series: series,
  };
  const mergedOptions = merge({}, LINE_CHART, options);
  return (
    <StyledChart>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={STOCK_CHART}
        options={mergedOptions}
      />
    </StyledChart>
  );
}

export default Chart;
