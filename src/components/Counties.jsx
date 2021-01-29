import React from "react";
import { isEqual, map, startsWith } from "lodash";
import County from "./County";

/**
 * Presenter for counties data.
 */
function Counties({
  transformedCountiesData,
  category,
  granularity,
  aggregator,
  endDateTime,
  startDateTime,
}) {
  return map(transformedCountiesData, (series, name) => {
    series = map(series, (series) => {
      const isActive = startsWith(series.category, category);
      series.visible = isActive || isEqual(series.type, "flags");
      series.showInLegend = isActive;
      return series;
    });
    return (
      <County
        key={name}
        name={name}
        series={series}
        category={category}
        granularity={granularity}
        aggregator={aggregator}
        endDateTime={endDateTime}
        startDateTime={startDateTime}
      />
    );
  });
}

export default Counties;
