import React, { Fragment } from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { isEqual } from "lodash";
import styled from "styled-components/macro";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  margin: 8px;
`;

/**
 * Presenter for data filter button group.
 */
export default function ButtonGroup(props) {
  const {
    aggregator,
    handleAggregator,
    category,
    handleCategory,
    granularity,
    handleGranularity,
  } = props;

  return (
    <Fragment>
      <StyledToggleButtonGroup
        value={granularity}
        exclusive
        onChange={handleGranularity}
        aria-label="granularity"
      >
        <ToggleButton value="month" aria-label="month">
          1 Month
        </ToggleButton>
        <ToggleButton value="quarter" aria-label="quarter">
          3 Months
        </ToggleButton>
        <ToggleButton value="halfYear" aria-label="halfYear">
          6 Months
        </ToggleButton>
        <ToggleButton value="max" aria-label="max">
          Max
        </ToggleButton>
      </StyledToggleButtonGroup>
      <StyledToggleButtonGroup
        value={category}
        exclusive
        onChange={handleCategory}
        aria-label="category"
      >
        <ToggleButton value="New" aria-label="new">
          New
        </ToggleButton>
        <ToggleButton value="Total" aria-label="total">
          Total
        </ToggleButton>
      </StyledToggleButtonGroup>
      {isEqual(granularity, "max") ? (
        ""
      ) : (
        <StyledToggleButtonGroup
          value={aggregator}
          exclusive
          onChange={handleAggregator}
          aria-label="aggregator"
        >
          <ToggleButton value="growthRates" aria-label="growthRates">
            Growth Rate
          </ToggleButton>
          <ToggleButton value="multiples" aria-label="multiples">
            Multiple
          </ToggleButton>
        </StyledToggleButtonGroup>
      )}
    </Fragment>
  );
}
