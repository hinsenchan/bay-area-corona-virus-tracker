import React from "react";
import { render } from "@testing-library/react";
import Fab from "./Fab";

describe("Fab", () => {
  test("smoke test", () => {
    const { getAllByLabelText } = render(<Fab />);
    expect(getAllByLabelText("filter").length).toEqual(2);
  });
});
