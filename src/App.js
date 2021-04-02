import React from "react";
import * as firebase from "firebase/app";
import "firebase/analytics";
import { Container } from "@material-ui/core";
import styled from "styled-components/macro";
import Counties from "./components/Counties";
import ErrorBoundary from "./components/ErrorBoundary";
import Fab from "./components/Fab";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useCountiesData } from "./hooks/useCountiesData";
import { useDataFilters } from "./hooks/useDataFilters";
import { FIREBASE_CONFIG } from "./utils/firebaseConstants";

const StyledContainer = styled(Container)`
  background: white;
`;

const StyledErrorBoundary = styled(ErrorBoundary)`
  height: 300px;
`;

firebase.initializeApp(FIREBASE_CONFIG);
firebase.analytics();

function App() {
  const { data: countiesData, error } = useCountiesData();
  const [
    aggregator,
    handleAggregator,
    category,
    handleCategory,
    granularity,
    handleGranularity,
    endDateTime,
    startDateTime,
  ] = useDataFilters();
  return (
    <StyledContainer>
      <Header />
      <StyledErrorBoundary throwableError={error}>
        <Counties
          transformedCountiesData={countiesData}
          category={category}
          granularity={granularity}
          aggregator={aggregator}
          endDateTime={endDateTime}
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
      </StyledErrorBoundary>
      <Footer />
    </StyledContainer>
  );
}

export default App;
