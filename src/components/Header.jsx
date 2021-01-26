import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components/macro";

const StyledCard = styled(Card)`
  margin-bottom: 16px;
`;

function Header() {
  return (
    <StyledCard elevation={0}>
      <CardContent>
        <Typography gutterBottom variant="h4" component="h1">
          Bay Area Corona Virus Tracker - alpha
        </Typography>
        <Typography variant="body1" color="textSecondary" component="p">
          Monitor corona virus growth rates across Bay Area counties. Keep your
          friends and family informed. Let's flatten the curve together!
        </Typography>
      </CardContent>
    </StyledCard>
  );
}

export default Header;
