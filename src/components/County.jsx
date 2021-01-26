import React from "react";
import Box from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components/macro";
import Aggregator from "./Aggregator";
import Chart from "./Chart";

const StyledBox = styled(Box)`
  box-shadow: none;
  margin-bottom: 16px;
`;

const StyledCountyContainer = styled.div``;

function County({
  name,
  series,
  category,
  granularity,
  aggregator,
  startDateTime,
}) {
  return (
    <StyledCountyContainer>
      <StyledBox>
        <Typography variant="h5" component="h2">
          {name}
        </Typography>
      </StyledBox>
      <Aggregator
        series={series}
        category={category}
        granularity={granularity}
        aggregator={aggregator}
      />
      <Chart startDateTime={startDateTime} series={series} />
    </StyledCountyContainer>
  );
}

export default County;
