import React, { Fragment, useState } from "react";
import { Fab } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import styled from "styled-components/macro";
import ButtonGroup from "./ButtonGroup";
import Popper from "@material-ui/core/Popper";
import Fade from "@material-ui/core/Fade";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";

const StyledFab = styled(Fab)`
  margin: 16px;

  @media (min-width: 600px) {
    margin: 24px;
    margin: 24px;
  }
`;

const StyledCardActions = styled(CardActions)`
  margin-bottom: 16px;
  flex-direction: column;
  min-height: 208px;
  min-width: 250px;
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
        placement="left"
        id={id}
        open={open}
        anchorEl={anchorEl}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Card>
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
            </Card>
          </Fade>
        )}
      </Popper>
    </Fragment>
  );
}
