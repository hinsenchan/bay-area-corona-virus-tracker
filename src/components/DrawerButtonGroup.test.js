import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import DrawerButtonGroup from "./DrawerButtonGroup";

describe("DrawerButtonGroup", () => {
  test("toggle drawer", async () => {
    const { getByLabelText, getByText } = render(<DrawerButtonGroup />);
    fireEvent.click(getByLabelText("filter"));
    const filtersHeader = getByText("Filters");
    expect(filtersHeader).toBeInTheDocument();
    fireEvent.click(getByLabelText("close"));
    await waitFor(() => {
      expect(filtersHeader).not.toBeInTheDocument();
    });
  });
});
