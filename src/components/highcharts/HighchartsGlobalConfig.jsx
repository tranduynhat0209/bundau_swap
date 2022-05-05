import Highcharts from "highcharts";
// import HC_exporting from "highcharts/modules/exporting";
import { useMemo } from "react";

export default function HighchartsGlobalConfig() {
  useMemo(() => {
    // HC_exporting(Highcharts);

    Highcharts.setOptions({
      credits: {
        enabled: false,
      },
      chart: {
        backgroundColor: "transparent",
        style: {
          fontFamily: "'Fira Sans', sans-serif",
          fontSize: "12px",
        },
      },
      colors: [
        "#00c8e2",
        "#434348",
        "#90ed7d",
        "#f7a35b",
        "#8085e9",
        "#1aadce",
        "#492970",
        "#f28f43",
        "#77a1e5",
        "#c42525",
      ],
      time: {
        useUTC: false,
      },
      tooltip: {
        backgroundColor: {
          linearGradient: [0, 0, 0, 60],
          stops: [
            [0, "#FFFFFF"],
            [1, "#E0E0E0"],
          ],
        },
      },
    });
  }, []);

  return null;
}
