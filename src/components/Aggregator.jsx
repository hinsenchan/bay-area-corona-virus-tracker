import React from "react";
import { isEqual, get, map, startCase, startsWith, trimEnd } from "lodash";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components/macro";

const StyledAggregatorContainer = styled.div`
  display: flex;
  margin-bottom: 16px;

  @media screen and (max-width: 600px) {
    margin-bottom: 12px;
  }
`;

const StyledAggregatorCard = styled(Card)`
  margin-right: 8px;
  flex-grow: 1;

  &:last-child {
    margin-right: 0;
  }

  @media screen and (max-width: 600px) {
    margin-bottom: 12px;
  }
`;

function Aggregator({ series, category, granularity, aggregator }) {
  return (
    <StyledAggregatorContainer>
      {map(series, (series) => {
        if (isEqual(series.name, "Notable Events")) {
          return;
        }
        if (!startsWith(series.category, category)) {
          return;
        }
        if (isEqual(granularity, "year")) {
          return;
        }
        return (
          <StyledAggregatorCard
            key={`${series.name}_${aggregator}_${granularity}`}
            variant="outlined"
          >
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {startCase(series.category)}
              </Typography>
              <Typography variant="h5" component="h3">
                {get(series, `${aggregator}.${granularity}`, "-")}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {startCase(trimEnd(aggregator, "s"))}
              </Typography>
            </CardContent>
          </StyledAggregatorCard>
        );
      })}
    </StyledAggregatorContainer>
  );
}

export default Aggregator;
