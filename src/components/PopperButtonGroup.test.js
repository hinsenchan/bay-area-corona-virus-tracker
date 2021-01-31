import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import PopperButtonGroup from "./PopperButtonGroup";

describe("PopperButtonGroup", () => {
  test("toggle popper", async () => {
    const { getByLabelText, getByText } = render(<PopperButtonGroup />);
    const filterButton = getByLabelText("filter");
    fireEvent.click(filterButton);
    const monthButton = getByText("1m");
    expect(monthButton).toBeInTheDocument();
    fireEvent.click(filterButton);
    await waitFor(() => {
      expect(monthButton).not.toBeInTheDocument();
    });
  });
});
