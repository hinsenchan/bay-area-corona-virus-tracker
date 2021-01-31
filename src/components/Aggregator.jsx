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

/**
 * Determines whether series is a notable event.
 * @param {Object} series
 * @return {boolean} value
 */
function isNotablEventSeries(series) {
  return isEqual(series.name, "Notable Events");
}

/**
 * Determines whether series is an inactive category.
 * @param {Object} series
 * @param {string} category
 * @return {boolean} value
 */
function isInactiveCategorySeries(series, category) {
  return !startsWith(series.category, category);
}

/**
 * Determines whether granularity has max value.
 * @param {string} granularity
 * @return {boolean} value
 */
function isMaxGranularity(granularity) {
  return isEqual(granularity, "max");
}

/**
 * Format category series value.
 * @param {Object} series
 * @returns {string} value
 */
function formatSeriesCategory(series) {
  return startCase(series.category);
}

/**
 * Get series aggregator granularity value.
 * @param {Object} series
 * @param {string} aggregator
 * @param {string} granularity
 * @returns {string} value
 */
function getAggregatorGranularityValue(series, aggregator, granularity) {
  return get(series, `${aggregator}.${granularity}`, "-");
}

/**
 * Format aggregator series value.
 * @param {string} aggregator
 * @returns {string} value
 */
function formatSeriesAggregator(aggregator) {
  return startCase(trimEnd(aggregator, "s"));
}

/**
 * Presenter for series aggregation by category and granularity.
 */
function Aggregator({ series, category, granularity, aggregator }) {
  return (
    <StyledAggregatorContainer data-testid="aggregator">
      {map(series, (highchartSeries) => {
        if (
          isNotablEventSeries(highchartSeries) ||
          isInactiveCategorySeries(highchartSeries, category) ||
          isMaxGranularity(granularity)
        ) {
          return;
        }
        const key = `${highchartSeries.name}_${aggregator}_${granularity}`;
        return (
          <StyledAggregatorCard
            data-testid="aggregator-card"
            key={key}
            variant="outlined"
          >
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {formatSeriesCategory(highchartSeries)}
              </Typography>
              <Typography variant="h5" component="h3">
                {getAggregatorGranularityValue(
                  highchartSeries,
                  aggregator,
                  granularity
                )}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {formatSeriesAggregator(aggregator)}
              </Typography>
            </CardContent>
          </StyledAggregatorCard>
        );
      })}
    </StyledAggregatorContainer>
  );
}

export default Aggregator;
