import React, { Fragment } from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { isEqual, isNull } from "lodash";
import styled from "styled-components/macro";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  margin: 8px;
`;

/**
 * Enforce at least one button to be active.
 * @param {Function} onChange
 * @returns {Function} onChange
 */
function enforceValueOnChange(onChange) {
  return (event, newValue) => {
    !isNull(newValue) && onChange(newValue);
  };
}

/**
 * Presenter for granularity data filter button group.
 */
function GranularityButtonGroup({ granularity, handleGranularity }) {
  return (
    <StyledToggleButtonGroup
      value={granularity}
      exclusive
      onChange={enforceValueOnChange(handleGranularity)}
      aria-label="granularity"
    >
      <ToggleButton value="month" aria-label="month">
        1m
      </ToggleButton>
      <ToggleButton value="quarter" aria-label="quarter">
        3m
      </ToggleButton>
      <ToggleButton value="halfYear" aria-label="halfYear">
        6m
      </ToggleButton>
      <ToggleButton value="max" aria-label="max">
        Max
      </ToggleButton>
    </StyledToggleButtonGroup>
  );
}

/**
 * Presenter for category data filter button group.
 */
function CategoryButtonGroup({ category, handleCategory }) {
  return (
    <StyledToggleButtonGroup
      value={category}
      exclusive
      onChange={enforceValueOnChange(handleCategory)}
      aria-label="category"
    >
      <ToggleButton value="New" aria-label="new">
        New
      </ToggleButton>
      <ToggleButton value="Total" aria-label="total">
        Total
      </ToggleButton>
    </StyledToggleButtonGroup>
  );
}

/**
 * Presenter for aggregator data filter button group.
 */
function AggregatorButtonGroup({ aggregator, handleAggregator }) {
  return (
    <StyledToggleButtonGroup
      value={aggregator}
      exclusive
      onChange={enforceValueOnChange(handleAggregator)}
      aria-label="aggregator"
    >
      <ToggleButton value="growthRates" aria-label="growthRates">
        Growth Rate
      </ToggleButton>
      <ToggleButton value="multiples" aria-label="multiples">
        Multiple
      </ToggleButton>
    </StyledToggleButtonGroup>
  );
}

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
      <GranularityButtonGroup
        granularity={granularity}
        handleGranularity={handleGranularity}
      />
      <CategoryButtonGroup
        category={category}
        handleCategory={handleCategory}
      />
      {isEqual(granularity, "max") ? (
        ""
      ) : (
        <AggregatorButtonGroup
          aggregator={aggregator}
          handleAggregator={handleAggregator}
        />
      )}
    </Fragment>
  );
}
