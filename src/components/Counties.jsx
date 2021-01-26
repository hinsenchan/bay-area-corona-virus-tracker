import React from "react";
import { isEqual, map, startsWith } from "lodash";
import County from "./County";

function Counties({
  transformedCountiesData,
  category,
  granularity,
  aggregator,
  startDateTime,
}) {
  let id = 0;
  return map(transformedCountiesData, (series, name) => {
    id++;
    series = map(series, (series) => {
      const isActive = startsWith(series.category, category);
      series.visible = isActive || isEqual(series.type, "flags");
      series.showInLegend = isActive;
      return series;
    });
    return (
      <County
        key={id}
        name={name}
        series={series}
        category={category}
        granularity={granularity}
        aggregator={aggregator}
        startDateTime={startDateTime}
      />
    );
  });
}

export default Counties;