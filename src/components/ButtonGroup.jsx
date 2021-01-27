import React, { Fragment } from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { isEqual } from "lodash";
import styled from "styled-components/macro";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  margin: 8px;
`;

export default function DrawerButtonGroup(props) {
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
          Month
        </ToggleButton>
        <ToggleButton value="quarter" aria-label="quarter">
          Quarter
        </ToggleButton>
        <ToggleButton value="halfYear" aria-label="halfYear">
          Half Year
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
      {isEqual(granularity, "year") ? (
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
