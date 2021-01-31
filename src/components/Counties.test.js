import React from "react";
import { render } from "@testing-library/react";
import Counties from "./Counties";

describe("Counties", () => {
  describe("renders", () => {
    test("active category series", () => {
      const category = "Total";
      const transformedCountiesData = {
        "BAY AREA": [
          {
            category: "Total Cases",
          },
        ],
      };
      const { container } = render(
        <Counties
          transformedCountiesData={transformedCountiesData}
          category={category}
        />
      );
      const highchartsSeries = container.querySelectorAll(".highcharts-series");
      expect(highchartsSeries).toHaveLength(1);
      expect(highchartsSeries[0]).toHaveClass("highcharts-series-0");
    });

    test("flags series", () => {
      const transformedCountiesData = {
        "BAY AREA": [
          {
            category: "Notable Events",
            type: "flags",
          },
        ],
      };
      const { container } = render(
        <Counties transformedCountiesData={transformedCountiesData} />
      );
      const highchartsSeries = container.querySelectorAll(".highcharts-series");
      expect(highchartsSeries).toHaveLength(1);
      expect(highchartsSeries[0]).toHaveClass("highcharts-flags-series");
    });
  });

  test("hides inactive category series", () => {
    const category = "New";
    const transformedCountiesData = {
      "BAY AREA": [
        {
          category: "Total Cases",
        },
      ],
    };
    const { container } = render(
      <Counties
        transformedCountiesData={transformedCountiesData}
        category={category}
      />
    );
    const highchartsSeries = container.querySelectorAll(".highcharts-series");
    expect(highchartsSeries).toHaveLength(1);
    expect(highchartsSeries[0]).toHaveAttribute("visibility", "hidden");
  });
});
