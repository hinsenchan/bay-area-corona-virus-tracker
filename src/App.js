import React from "react";
import * as firebase from "firebase/app";
import "firebase/analytics";
import { Container } from "@material-ui/core";
import styled from "styled-components/macro";
import Counties from "./components/Counties";
import Fab from "./components/Fab";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useCountiesData } from "./hooks/useCountiesData";
import { useDataFilters } from "./hooks/useDataFilters";
import { FIREBASE_CONFIG } from "./utils/firebaseConstants";

const StyledContainer = styled(Container)`
  background: white;
`;

firebase.initializeApp(FIREBASE_CONFIG);
firebase.analytics();

function App() {
  const countiesData = useCountiesData();
  const [
    aggregator,
    handleAggregator,
    category,
    handleCategory,
    granularity,
    handleGranularity,
    startDateTime,
  ] = useDataFilters();
  return (
    <StyledContainer>
      <Header />
      <Counties
        transformedCountiesData={countiesData}
        category={category}
        granularity={granularity}
        aggregator={aggregator}
        startDateTime={startDateTime}
      />
      <Fab
        aggregator={aggregator}
        handleAggregator={handleAggregator}
        category={category}
        handleCategory={handleCategory}
        granularity={granularity}
        handleGranularity={handleGranularity}
      />
      <Footer />
    </StyledContainer>
  );
}

export default App;
