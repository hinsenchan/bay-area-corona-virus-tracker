import React from "react";
import { render } from "@testing-library/react";
import County from "./County";

describe("County", () => {
  test("render", () => {
    const name = "Bay Area";
    const { getByTestId, getByText } = render(<County name={name} />);
    expect(getByText(name)).toBeInTheDocument();
    expect(getByTestId("aggregator")).toBeInTheDocument();
    expect(getByTestId("chart")).toBeInTheDocument();
  });
});
