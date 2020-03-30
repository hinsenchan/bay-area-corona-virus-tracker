import React, { Fragment, useState } from "react";
import { Fab } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import styled from "styled-components/macro";
import ButtonGroup from "./ButtonGroup";
import Popper from "@material-ui/core/Popper";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";

const StyledFab = styled(Fab)`
  display: none;

  @media (min-width: 600px) {
    margin: 0 24px;

    display: flex;
  }
`;

const StyledCard = styled(Card)`
  position: fixed;
  right: 8px;
  bottom: -44px;
`;

const StyledCardActions = styled(CardActions)`
  flex-direction: column;
  height: 208px;
  width: 250px;
`;

export default function PopperButtonGroup(props) {
  const {
    aggregator,
    handleAggregator,
    category,
    handleCategory,
    granularity,
    handleGranularity
  } = props;

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "transitions-popper" : undefined;

  return (
    <Fragment>
      <StyledFab color="primary" aria-label="filter" onClick={handleClick}>
        <FilterListIcon />
      </StyledFab>
      <Popper
        disablePortal={true}
        placement="left"
        id={id}
        open={open}
        anchorEl={anchorEl}
      >
        <StyledCard>
          <StyledCardActions>
            <ButtonGroup
              aggregator={aggregator}
              handleAggregator={handleAggregator}
              category={category}
              handleCategory={handleCategory}
              granularity={granularity}
              handleGranularity={handleGranularity}
            />
          </StyledCardActions>
        </StyledCard>
      </Popper>
    </Fragment>
  );
}
