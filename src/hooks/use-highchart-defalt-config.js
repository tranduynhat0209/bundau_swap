import { alpha, useTheme } from "@material-ui/core";
import { useMemo } from "react";

export default function useHighchartsDefaultConfig() {
  const theme = useTheme();

  return useMemo(
    () => ({
      chart:{
        backgroundColor: "transparent",
      },
      title: {
        style: {
          color: theme.palette.text.primary,
          fontSize: "16px",
        },
      },
      yAxis: {
        gridLineColor: alpha(theme.palette.text.primary, 0.1),
        lineColor: alpha(theme.palette.text.primary, 0.1),
        tickColor: alpha(theme.palette.text.primary, 0.1),
        title: {
          style: {
            color: theme.palette.text.primary,
          },
        },
        labels: {
          style: {
            color: theme.palette.text.primary,
          },
        },
      },
      xAxis: {
        gridLineColor: alpha(theme.palette.text.primary, 0.1),
        tickColor: alpha(theme.palette.text.primary, 0.1),
        lineColor: alpha(theme.palette.text.primary, 0.1),
        title: {
          style: {
            color: theme.palette.text.primary,
          },
        },
        labels: {
          style: {
            color: theme.palette.text.primary,
          },
        },
      },
      legend: {
        itemStyle: {
          color: theme.palette.text.primary,
        },
        itemHoverStyle: {
          color: theme.palette.primary.main,
        },
        itemHiddenStyle: {
          color: theme.mode === "dark" ? "#7a7a7a" : "#cccccc",
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            style: {
              color: theme.palette.text.primary,
              textOutline: "none",
            },
          },
        },
      },
    }),
    [theme]
  );
}
