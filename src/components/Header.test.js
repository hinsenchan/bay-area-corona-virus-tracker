import React from "react";
import { render } from "@testing-library/react";
import Header from "./Header";

describe("Header", () => {
  test("smoke test", () => {
    const { getByText } = render(<Header />);
    expect(
      getByText("Bay Area Corona Virus Tracker", { exact: false })
    ).toBeInTheDocument();
  });
});
