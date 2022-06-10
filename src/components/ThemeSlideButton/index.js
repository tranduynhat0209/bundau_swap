import { Box, makeStyles } from "@material-ui/core";
import React from "react";
import { useAppContext } from "src/context/app-context";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    backgroundColor: theme.palette.background.primary,
    borderRadius: 24,
    position: "relative",
    cursor: "pointer",
    boxShadow: "0px 3px 10px rgb(0 0 0 / 12%)",
    transition: "backgroundColor 250ms linear"
  },
  icon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(1),
    zIndex: 1,
    width: 35,
    height: 35,
    color: theme.palette.text.primary,
    transition: "color 250ms linear",
  },
  activeSlide: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 35,
    backgroundColor: "white",
    borderRadius: 24,
    transition: "left 250ms linear",
  },
  activeLight: {
    left: 0,
    
  },
  activeDark: {
    left: "50%",
  },
  active: {
    color: "#374244",
  },
}));

export default function ThemeSlideButton() {
  const classes = useStyles();
  const { themeMode, toggleThemeMode } = useAppContext();

  return (
    <Box className={classes.root} onClick={() => toggleThemeMode()}>
      <Box
        className={clsx(classes.activeSlide, {
          [classes.activeLight]: themeMode === "light",
          [classes.activeDark]: themeMode === "dark",
        })}
      ></Box>
      <Box className={clsx(classes.icon, { [classes.active]: themeMode === "light" })}>
        <svg width={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 455.09 455.05" fill="currentColor">
          <path
            d="M354.53,246.34c-.09,57.6-47.25,104.58-104.87,104.47S145.07,303.53,145.18,246s47.28-104.59,104.87-104.48S354.63,188.72,354.53,246.34Zm-30.84-.29A73.82,73.82,0,1,0,250,320,73.51,73.51,0,0,0,323.69,246.05Z"
            transform="translate(-22.32 -18.63)"
          />
          <path
            d="M270.61,70c0,10.83.57,21.7-.16,32.48-.68,9.83-8.91,17-18.9,18A20.84,20.84,0,0,1,230.3,106.9a27.22,27.22,0,0,1-1.42-8.83q-.18-28.3,0-56.6c.09-13.49,9-22.93,21.14-22.84s20.82,9.52,21,23.07c.12,9.43,0,18.87,0,28.3Z"
            transform="translate(-22.32 -18.63)"
          />
          <path
            d="M73.34,267.26c-9.44,0-18.87.11-28.31,0C31.62,267,22.13,258,22.32,245.9s9.44-20.68,22.6-20.78q28.3-.21,56.61,0c13.43.1,22.9,9.13,22.72,21.27-.19,12-9.46,20.53-22.61,20.86H73.34Z"
            transform="translate(-22.32 -18.63)"
          />
          <path
            d="M228.82,422.21c0-9.43-.14-18.87,0-28.3.23-13,9.26-22.31,21.22-22.15,11.77.15,20.69,9.24,20.85,21.95q.34,28.89,0,57.8c-.14,13-9.34,22.3-21.26,22.16s-20.64-9.42-20.82-22.56C228.71,441.48,228.82,431.84,228.82,422.21Z"
            transform="translate(-22.32 -18.63)"
          />
          <path
            d="M426.41,267.26c-9.43,0-18.87.12-28.3,0-13.39-.22-22.88-9.29-22.62-21.41s9.46-20.6,22.68-20.7q28.31-.21,56.61,0c13.16.1,22.44,8.78,22.63,20.76s-9.29,21.14-22.69,21.35C445.29,267.38,435.85,267.26,426.41,267.26Z"
            transform="translate(-22.32 -18.63)"
          />
          <path
            d="M167.2,139.69c-.4,11.24-4.09,17.86-11.86,21.54s-16.16,3.4-22.53-2.67c-15.38-14.68-30.49-29.67-45.11-45.12-7.54-8-6.24-20.79,1.54-28.34s20.41-8.38,28.41-.71q22.6,21.63,44.2,44.33C165,132.08,166.14,137.42,167.2,139.69Z"
            transform="translate(-22.32 -18.63)"
          />
          <path
            d="M145.94,329c8.63.05,15.16,3.92,18.92,11.58,3.85,7.84,3.57,16.16-2.5,22.52-14.81,15.53-30.05,30.67-45.55,45.51-7,6.71-19,6-26.57-.47a20.94,20.94,0,0,1-4.68-26.22,30.45,30.45,0,0,1,4.83-6.1c13.14-13.25,26.39-26.4,39.56-39.63C134.38,331.69,139.47,328.85,145.94,329Z"
            transform="translate(-22.32 -18.63)"
          />
          <path
            d="M353.89,164.49c-9.14-1.4-15.6-5.37-19.21-13.12-3.69-7.93-3.15-16.13,2.95-22.49,14.73-15.33,29.76-30.4,45.17-45,7.64-7.27,20.37-6,27.9,1.48,7.68,7.68,8.73,20.41,1.16,28.36q-21.8,22.88-44.77,44.63C363.75,161.48,358.35,162.49,353.89,164.49Z"
            transform="translate(-22.32 -18.63)"
          />
          <path
            d="M331.42,350.78c1.34-9.55,5.36-16.21,13.34-19.88,8.18-3.75,16.43-2.87,23,3.45,14.86,14.37,29.54,28.94,43.82,43.88,8,8.41,7,21.45-1.37,29.24a20.55,20.55,0,0,1-28.8-.28c-14.48-14.17-28.89-28.43-42.86-43.1C335.17,360.58,333.73,355.26,331.42,350.78Z"
            transform="translate(-22.32 -18.63)"
          />
        </svg>
      </Box>
      <Box className={clsx(classes.icon, { [classes.active]: themeMode === "dark" })}>
        <svg width={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430.45 455.05" fill="currentColor">
          <path
            d="M37.43,246.23c1.14-111,81-205.83,190.45-224.47,11.85-2,24-2.4,36.06-3.09,8.57-.49,13.67,2.81,15.8,9.11s.16,11.64-6.82,17Q222.19,84,209,146.78C189.43,240,253.66,333.55,347.67,348.56c34.25,5.47,67.29,1.36,99-13,7.36-3.34,13.14-2.58,17.61,2.29s4.9,10.64,1.07,17.3c-38.85,67.57-96.44,108.13-174,117C173.78,485.61,68.13,408.66,43.49,292.83,40.25,277.56,39.39,261.78,37.43,246.23ZM226.06,50.06C148.59,64,71.22,133.91,66,236.59A199.89,199.89,0,0,0,214.75,440.05c86.64,23,167.48-16.64,203.56-65.6-87.13,13.65-160.11-11.8-208.14-87.92C159.12,205.63,169.64,125.54,226.06,50.06Z"
            transform="translate(-37.43 -18.63)"
          />
        </svg>
      </Box>
    </Box>
  );
}
