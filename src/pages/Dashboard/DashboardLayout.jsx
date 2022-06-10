import React from "react";
import { Box, Grid, makeStyles } from "@material-ui/core";
import Price from "./Price";
import Volume from "./Volume";
import Overview from "./Overview";
import { HistoryProvider } from "src/context/history-context";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(3),
    },
  },
}));

export default function DashboardLayout() {
  const classes = useStyles();

  return (
    <HistoryProvider>
      <Box className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Overview />
          </Grid>
          <Grid item xs={12} style={{ marginTop: "2rem" }}>
            <Price />
          </Grid>
          <Grid item xs={12} style={{ marginTop: "2rem" }}>
            <Volume />
          </Grid>
        </Grid>
      </Box>
    </HistoryProvider>
  );
}
