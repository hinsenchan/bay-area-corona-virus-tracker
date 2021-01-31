import React from "react";
import { render } from "@testing-library/react";
import Aggregator from "./Aggregator";

describe("Aggregator", () => {
  test("renders", () => {
    const series = [
      {
        category: "Total Cases",
        growthRates: {
          month: "100%",
        },
      },
    ];
    const aggregator = "growthRates";
    const category = "Total";
    const granularity = "month";
    const { getByText } = render(
      <Aggregator
        series={series}
        aggregator={aggregator}
        category={category}
        granularity={granularity}
      />
    );
    expect(getByText("Total Cases")).toBeInTheDocument();
    expect(getByText("100%")).toBeInTheDocument();
    expect(getByText("Growth Rate")).toBeInTheDocument();
  });

  describe("skips rendering", () => {
    test("notable events", () => {
      const series = [{ name: "Notable Events" }];
      const { queryByTestId } = render(<Aggregator series={series} />);
      expect(queryByTestId("aggregator-card")).not.toBeInTheDocument();
    });

    test("inactive category", () => {
      const category = "New";
      const series = [
        {
          category: "Total Cases",
        },
      ];
      const { queryByTestId } = render(
        <Aggregator series={series} category={category} />
      );
      expect(queryByTestId("aggregator-card")).not.toBeInTheDocument();
    });

    test("max granularity", () => {
      const series = [{}];
      const { queryByTestId } = render(<Aggregator series={series} />);
      expect(queryByTestId("aggregator-card")).not.toBeInTheDocument();
    });
  });
});
