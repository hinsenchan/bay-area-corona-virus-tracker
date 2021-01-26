import React from "react";
import { Container } from "@material-ui/core";
import styled from "styled-components/macro";
import DrawerButtonGroup from "./DrawerButtonGroup";
import PopperButtonGroup from "./PopperButtonGroup";

const StyledFabContainer = styled(Container)`
  position: fixed;
  bottom: 44px;
  display: flex;
  justify-content: flex-end;
`;

function Fab({
  aggregator,
  handleAggregator,
  category,
  handleCategory,
  granularity,
  handleGranularity,
}) {
  return (
    <StyledFabContainer>
      <DrawerButtonGroup
        aggregator={aggregator}
        handleAggregator={handleAggregator}
        category={category}
        handleCategory={handleCategory}
        granularity={granularity}
        handleGranularity={handleGranularity}
      />
      <PopperButtonGroup
        aggregator={aggregator}
        handleAggregator={handleAggregator}
        category={category}
        handleCategory={handleCategory}
        granularity={granularity}
        handleGranularity={handleGranularity}
      />
    </StyledFabContainer>
  );
}

export default Fab;
