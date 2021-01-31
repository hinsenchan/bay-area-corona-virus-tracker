import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ButtonGroup from "./ButtonGroup";

describe("ButtonGroup", () => {
  test("aggregator", () => {
    const handleAggregatorSpy = jest.fn();
    const { getByText } = render(
      <ButtonGroup
        aggregator="growthRates"
        handleAggregator={handleAggregatorSpy}
      />
    );
    const growthRateButton = getByText("Growth Rate");
    const multipleButton = getByText("Multiple");
    expect(growthRateButton).toBeInTheDocument();
    expect(multipleButton).toBeInTheDocument();
    fireEvent.click(growthRateButton);
    expect(handleAggregatorSpy).toBeCalledTimes(0);
    fireEvent.click(multipleButton);
    expect(handleAggregatorSpy).toBeCalledTimes(1);
    expect(handleAggregatorSpy).toHaveBeenCalledWith("multiples");
  });

  test("category", () => {
    const handleCategorySpy = jest.fn();
    const { getByText } = render(
      <ButtonGroup category="New" handleCategory={handleCategorySpy} />
    );
    const newButton = getByText("New");
    const totalButton = getByText("Total");
    expect(newButton).toBeInTheDocument();
    expect(totalButton).toBeInTheDocument();
    fireEvent.click(newButton);
    expect(handleCategorySpy).toBeCalledTimes(0);
    fireEvent.click(totalButton);
    expect(handleCategorySpy).toBeCalledTimes(1);
    expect(handleCategorySpy).toHaveBeenCalledWith("Total");
  });

  test("granularity", () => {
    const handleGranularitySpy = jest.fn();
    const { getByText } = render(
      <ButtonGroup
        granularity="month"
        handleGranularity={handleGranularitySpy}
      />
    );
    const monthButton = getByText("1m");
    const quarterButton = getByText("3m");
    const halfYearButton = getByText("6m");
    const maxButton = getByText("Max");
    expect(monthButton).toBeInTheDocument();
    expect(quarterButton).toBeInTheDocument();
    expect(halfYearButton).toBeInTheDocument();
    expect(maxButton).toBeInTheDocument();
    fireEvent.click(monthButton);
    expect(handleGranularitySpy).toBeCalledTimes(0);
    fireEvent.click(quarterButton);
    expect(handleGranularitySpy).toBeCalledTimes(1);
    expect(handleGranularitySpy).toHaveBeenCalledWith("quarter");
  });
});
