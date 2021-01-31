import React from "react";
import { render } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  test("smoke test", () => {
    const { getByText } = render(<Footer />);
    expect(
      getByText("Created by Hinsen Chan", { exact: false })
    ).toBeInTheDocument();
  });
});
