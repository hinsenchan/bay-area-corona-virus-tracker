import React, { Fragment, useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import { Fab } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components/macro";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import ButtonGroup from "./ButtonGroup";

const StyledCardActions = styled(CardActions)`
  flex-direction: column;
  min-height: 208px;
  margin-bottom: 24px;
`;

const StyledFab = styled(Fab)`
  margin: 0 16px;

  @media (min-width: 960px) {
    display: none;
  }
`;

/**
 * Presenter for data filter using drawer buttons.
 */
export default function DrawerButtonGroup(props) {
  const {
    aggregator,
    handleAggregator,
    category,
    handleCategory,
    granularity,
    handleGranularity,
  } = props;
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    setOpen(open);
  };

  return (
    <Fragment>
      <StyledFab
        color="primary"
        aria-label="filter"
        onClick={toggleDrawer(true)}
      >
        <FilterListIcon />
      </StyledFab>
      <Drawer anchor="bottom" open={open} onClose={toggleDrawer(false)}>
        <Card>
          <CardHeader
            action={
              <IconButton aria-label="close" onClick={toggleDrawer(false)}>
                <CloseIcon />
              </IconButton>
            }
            title="Filters"
          />
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
      </Drawer>
    </Fragment>
  );
}
