import React from "react";
import { alpha, Box, Paper, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import LockIcon from "@material-ui/icons/Lock";
import clsx from "clsx";

const PaperContainer = withStyles((theme) => ({
  root: {
    position: "relative",
    padding: theme.spacing(2),
    border: "2px solid green",
    height: "100%",
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(2, 3),
    },
  },
  overlay: {
    
    position: "absolute",
    inset: 0,
    backgroundColor: alpha(theme.palette.background.primary, 0.92),
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "not-allowed",
  },
  fogContent: {
    filter: "blur(2px)",
  },
}))((props) => {
  const { locked, helperText, classes, children, ...other } = props;

  return (
    <Paper classes={{ root: classes.root }} {...other}>
      <Box
        width="100%"
        height="100%"
        className={clsx({
          [classes.fogContent]: locked,
        })}
      >
        {children}
      </Box>
      {locked && (
        <Box className={classes.overlay}>
          <Tooltip title={helperText} arrow placement="top">
            <LockIcon fontSize="large" />
          </Tooltip>
        </Box>
      )}
    </Paper>
  );
});

PaperContainer.defaultProps = {
  locked: false,
  helperText: "",
};

export default PaperContainer;
