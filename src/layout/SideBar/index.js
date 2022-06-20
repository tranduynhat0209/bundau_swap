import {
  Box,
  Drawer,
  Hidden,
  Link,
  List,
  ListItem,
  Typography,
} from "@material-ui/core";
// import LaunchIcon from "@material-ui/icons/Launch";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/styles";
// import clsx from "clsx";
import React, { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import logoImg from "src/assets/images/logo/bundau.png";
// import { DiscordIcon, MediumIcon, TelegramIcon, TwitterIcon } from "src/components/icons";
// import DiscountRanking from "./components/DiscountRanking";
// import SwitchedReputation from "./components/SwitchedReputation";
// import ReputationRank from "./components/ReputationRank";

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    width: 240,
    "&::-webkit-scrollbar": {
      width: 0,
      background: "transparent",
    },
  },
  logoName: {
    fontWeight: 700,
    letterSpacing: "1px",
  },
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  listItem: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    cursor: "pointer",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    "&:hover $navLink": {
      textDecoration: "none",
      color: theme.palette.secondary.main,
    },
    "&:hover $navLinkIcon": {
      fill: theme.palette.secondary.main,
      stroke: theme.palette.secondary.main,
    },
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    color: "inherit",
    textDecoration: "none",
    transition: "color, fill, stroke 0.5s ease",
    width: "100%",
    maxWidth: 160,
    "& .MuiTypography-root": {
      fontWeight: 450,
    },
  },
  externalLink: {
    "& $iconWrapper": {
      visibility: "hidden",
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    "&:hover $iconWrapper": {
      visibility: "visible",
    },
  },
  iconWrapper: {},
  navLinkIcon: {
    fill: theme.palette.text.primary,
    stroke: theme.palette.text.primary,
    width: 20,
  },
  activeLink: {
    color: `${theme.palette.primary.main} !important`,
    "& $navLinkIcon": {
      fill: `${theme.palette.primary.main} !important`,
      stroke: `${theme.palette.primary.main} !important`,
    },
  },
  btnIcon: {
    cursor: "pointer",
    transition: "color 0.3s ease",
    color: theme.palette.text.primary,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  menuIcon: {
    height: 70,
    [theme.breakpoints.down("md")]: {
      height: 140,
    },
    [theme.breakpoints.down(698)]: {
      height: 186,
    },
  },
}));

function SideBar() {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // hide mobile drawer when location changed
    setMobileOpen(false);
  }, [location]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const nav = (
    <Box className={classes.root} py={1}>
      <Box display="flex" flexDirection="column" alignItems="center" pt={2}>
        <img width={55} src={logoImg} alt="bundau logo" />
        <Typography className={classes.logoName} variant="h6">
          BunDAO
        </Typography>
      </Box>
      <Box pt={2} flexGrow={1}>
        <List>
          <ListItem className={classes.listItem}>
            <NavLink
              to="/dashboard"
              className={classes.navLink}
              activeClassName={classes.activeLink}
            >
              <Box display="flex" alignItems="center" mr={2}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 439.99 374.86"
                  strokeWidth={2}
                  className={classes.navLinkIcon}
                >
                  <path
                    d="M452.46,96.75h-262a51.74,51.74,0,0,0-97.34,0H68.83a17.56,17.56,0,0,0,0,35.11H93.14a51.74,51.74,0,0,0,97.34,0h262a17.56,17.56,0,0,0,0-35.11ZM156.33,131.86a22.77,22.77,0,1,1,8.27-17.56A22.64,22.64,0,0,1,156.33,131.86Z"
                    transform="translate(-30 -62.57)"
                  />
                  <path
                    d="M431.17,232.45H405a51.75,51.75,0,0,0-97.34,0H47.54a17.55,17.55,0,0,0,0,35.1H307.69a51.74,51.74,0,0,0,97.34,0h26.14a17.55,17.55,0,0,0,0-35.1ZM356.36,272.8a22.81,22.81,0,1,1,14.54-5.25A22.69,22.69,0,0,1,356.36,272.8Z"
                    transform="translate(-30 -62.57)"
                  />
                  <path
                    d="M431.17,368.16H235.27a51.77,51.77,0,0,0-97.39,0H47.54a17.55,17.55,0,0,0,0,35.09H137.9a51.74,51.74,0,0,0,97.34,0H431.17a17.55,17.55,0,0,0,0-35.09ZM201.09,403.25a22.77,22.77,0,1,1,8.27-17.55A22.6,22.6,0,0,1,201.09,403.25Z"
                    transform="translate(-30 -62.57)"
                  />
                </svg>
              </Box>
              <Typography component="span">Dashboard</Typography>
            </NavLink>
          </ListItem>

          <ListItem className={classes.listItem}>
            <NavLink
              to="/swap"
              className={classes.navLink}
              activeClassName={classes.activeLink}
            >
              <Box display="flex" alignItems="center" mr={2}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 396.12 394.42"
                  strokeWidth={2}
                  className={classes.navLinkIcon}
                >
                  <path
                    d="M302.44,295.53c0,31.79.1,63.58,0,95.39,0,11.9-5.86,21.12-15,28.39-15.53,12.46-33.89,18.45-53,22.19-46.94,9.19-93.48,8.37-139.07-7.36a113.34,113.34,0,0,1-21.44-10.38c-14.75-8.92-21.77-21.6-21.52-39.59.7-54.55.25-109.1.27-163.65,0-7.89-.27-15.8.27-23.65.71-10.15,7.1-17.28,15.94-20.45C84,171,99.52,165.45,115.35,163c48.8-7.48,97.7-7.25,146,4.17,9.56,2.26,18.88,6.27,27.64,10.81,9.6,5,13.43,13.5,13.25,24.7-.5,30.95-.18,61.89-.18,92.84A2.36,2.36,0,0,1,302.44,295.53Zm-20.59-73.87c-34.48,13-69.24,16.26-104.31,16.22-35.35,0-70.35-3.33-104.72-16.45,0,14.92-.37,28.74.3,42.53.13,2.85,3.51,6.76,6.36,8,8,3.63,16.24,7,24.77,8.92,39.58,8.83,79.68,9.53,119.72,4.56,16.47-2.05,32.64-7.18,48.65-11.9,3.71-1.1,8.57-6.12,8.84-9.65C282.47,250.44,281.85,236.83,281.85,221.66ZM72.55,293.09v23.49c0,23,1.25,24.69,23.23,31.81,1.35.43,2.72.84,4.09,1.18,42.28,11,85.13,11.16,128,5.43,14.51-1.94,28.67-6.79,42.72-11.22,4.15-1.32,10.15-5.52,10.42-8.82,1.16-13.87.5-27.89.5-41.58C211.61,313.63,142.79,313.29,72.55,293.09Zm.79,68.19c-4.21,37,1.78,46.15,36.2,56.8,1.62.5,3.26,1,4.9,1.44,36.1,9.42,72.54,10.31,109.21,3.9,16.9-3,33.5-7.12,47.8-17.11,4-2.8,9.08-7.09,9.6-11.21,1.35-10.75.46-21.76.46-33.69-33.89,14.19-68.64,16.79-103.81,16.81C142.24,378.26,107.23,375.35,73.34,361.28ZM282.72,196.07c-8.71-3.42-15.76-7-23.22-9-37.6-9.87-76-10.65-114.39-7.59-18.58,1.48-37,5.72-55.3,9.46-5.66,1.16-10.81,4.79-17,7.64C106.89,224.79,248.92,224.72,282.72,196.07Z"
                    transform="translate(-52.38 -53)"
                  />
                  <path
                    d="M427.35,256.49c-31.78,13.66-64.67,16-97.76,17.15a35.14,35.14,0,0,1-5.13,0c-6.09-.66-10.47-3.54-10.31-10.17s4.26-9.22,10.63-9.7c19.56-1.48,39.27-2.32,58.63-5.26,12.18-1.85,24-6.75,35.73-10.81,6.57-2.28,9.52-7.51,9.33-14.67-.25-11.58-.07-23.19-.07-34.34-17.24,3.81-33.66,8.46-50.39,10.81-17.15,2.39-34.62,2.67-51.95,3.56-6.76.34-12.14-2.33-11.89-10.08.23-7.17,5.34-8.88,11.75-9.51,24.31-2.4,48.6-5.18,72.88-7.89a44.16,44.16,0,0,0,7.44-1.9c21.27-6.41,22.16-7.59,22.19-29.44V117.58c-70,20.8-139.11,20.62-209.58.07,0,5.25.09,10.51,0,15.78-.13,6.66-2.48,12.29-10,12.29s-9.92-5.26-9.83-12.2c.19-12.22.67-24.47,0-36.65s4.86-20.82,15.33-25C227.67,66.5,241.52,61.39,255.63,59c51.88-8.66,103.81-8.62,155.17,4.15,8.69,2.17,17.15,6.14,25,10.45,8.89,4.85,12.68,13.13,12.66,23.46q-.21,93.77-.05,187.51c0,14.09-7,24.26-17.95,32.11-17.81,12.75-38.42,18.45-59.61,21.71-14.6,2.23-29.46,2.64-44.22,3.76-6.84.52-11.95-1.78-12.61-9.37-.55-6.39,4.26-9.6,12.66-10.61,21.39-2.6,42.73-5.68,64.1-8.66a29.31,29.31,0,0,0,6.5-2C431.62,297.4,430,293.39,427.35,256.49ZM218.69,93.8c7.64,3.21,13.91,6.5,20.57,8.57,32.22,10,65.45,11.15,98.86,10.29,25.7-.67,51.1-3.33,75.44-12.14,4.81-1.73,9.19-4.67,14.18-7.27C399.76,66.7,246.9,66.93,218.69,93.8Z"
                    transform="translate(-52.38 -53)"
                  />
                </svg>
              </Box>
              <Typography component="span">Swap</Typography>
            </NavLink>
          </ListItem>

          <ListItem className={classes.listItem}>
            <NavLink
              to="/liquidity"
              className={classes.navLink}
              activeClassName={classes.activeLink}
            >
              <Box display="flex" alignItems="center" mr={2}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 447.75 447.75"
                  strokeWidth={30}
                  className={classes.navLinkIcon}
                >
                  <path
                    fill="none"
                    d="M267.73,46.35,302.8,92.6a22.3,22.3,0,0,0,20.79,8.62l57.51-7.91a22.29,22.29,0,0,1,25.12,25.12l-7.91,57.5a22.31,22.31,0,0,0,8.61,20.8l46.26,35.07a22.29,22.29,0,0,1,0,35.52l-46.26,35.07a22.31,22.31,0,0,0-8.61,20.8l7.91,57.51a22.29,22.29,0,0,1-25.12,25.11l-57.51-7.91a22.3,22.3,0,0,0-20.79,8.62l-35.07,46.25a22.29,22.29,0,0,1-35.52,0l-35.08-46.25a22.29,22.29,0,0,0-20.79-8.62l-57.51,7.91A22.28,22.28,0,0,1,93.72,380.7l7.9-57.51A22.28,22.28,0,0,0,93,302.39L46.76,267.32a22.28,22.28,0,0,1,0-35.52L93,196.73a22.28,22.28,0,0,0,8.61-20.8l-7.9-57.5a22.29,22.29,0,0,1,25.11-25.12l57.51,7.91a22.29,22.29,0,0,0,20.79-8.62l35.08-46.25A22.29,22.29,0,0,1,267.73,46.35Z"
                    transform="translate(-26.09 -25.68)"
                  />
                </svg>
              </Box>
              <Typography component="span">Liquidity</Typography>
            </NavLink>
          </ListItem>

          <ListItem className={classes.listItem}>
            <NavLink
              to="/farming"
              className={classes.navLink}
              activeClassName={classes.activeLink}
            >
              <Box display="flex" alignItems="center" mr={2}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 490.27 353.23"
                  className={classes.navLinkIcon}
                >
                  <path
                    d="M485.22,162.46c-5.92-9.07-12.3-17.82-18.35-26.8a9.28,9.28,0,0,1-1.52-4.78c-.22-13.25-.23-26.5-.39-39.75a18.59,18.59,0,0,0-.81-5.66c-1.94-5.8-5.25-11.12-14.32-11.15-10.49,0-21-.48-31.49-.51q-61.62-.18-123.25-.23c-1.07,0-2.14-.18-3.2-.28h-87c-1.15.1-2.3.27-3.46.28q-68.53.21-137.06.42c-5.25,0-10.51.22-15.74.67A14,14,0,0,0,36.26,86.25a80.63,80.63,0,0,0-.69,11.21c-.11,11.25,0,22.51-.17,33.77a7.9,7.9,0,0,1-1.31,4.1c-7.82,11.51-15.82,22.9-23.61,34.43-2,3-3.51,6.39-5.25,9.6v5c1,3.67,1.9,7.39,3.17,11,4.36,12.29,13,20.72,24.52,26.38a3.89,3.89,0,0,1,2.59,4.11q0,86.28.27,172.56a119,119,0,0,0,.86,15.46c1,7.68,6,12,13.7,12.15,15.56.25,31.12.46,46.68.55v-.06H406.16v0l33.46-.06c3.83,0,7.66-.25,11.49-.43,6.68-.32,11.94-4.71,12.83-11.39a125.69,125.69,0,0,0,1-16.45q.24-84.54.27-169.09c0-2.43.71-3.69,2.9-4.74,14.14-6.76,22.81-18,26.57-33.1.28-1.12.55-2.25.82-3.37v-7.51C492.09,174.38,489,168.22,485.22,162.46ZM50.84,88.84h399v20.4c-.46.05-.7.15-.77.08-4.62-4.62-10.66-4.32-16.4-4.44-22.08-.46-44.17-.92-66.26-.95q-105.28-.15-210.57,0c-30.25,0-60.51.49-90.77.66a20.19,20.19,0,0,0-12.7,4.41,11,11,0,0,1-1,.68c-.05,0-.15,0-.44,0ZM81.31,331.66q-.25-55.77-.54-111.54a5.48,5.48,0,0,1,1.8-4.34c2.54-2.52,4.86-5.26,7.62-8.29,8.57,11.53,19,18.41,32.9,19s25-5.13,35-14.75c8.31,9.58,18.64,14.17,31.22,14.57,12.86.41,22.6-5.68,32-13.71,8.19,9.06,18.19,14.13,30.59,13.9s22-5.87,30.21-14.49c20.27,19.77,40.65,19.19,61.48.56,9.29,10.61,21,15.41,35,13.64s23.43-10.3,30.65-21.76c3.45,4.11,6.89,8.16,10.25,12.28a3.61,3.61,0,0,1,.44,2.1q-.22,56.78-.5,113.55c0,.56-.09,1.12-.15,1.81H81.31C81.31,333.16,81.32,332.41,81.31,331.66Zm67.4-134.52c-2.11,7.26-13.34,13.89-22.86,14.28-10.8.44-19.84-6.75-23.51-14.28Zm-45.28-16.25c1.36-6.37,2.61-12.38,3.94-18.38,2.95-13.23,6-26.43,8.88-39.68.56-2.59,1.6-3.57,4.28-3.55,11.57.07,23.14-.12,34.71,0,3.34,0,3.46.3,3.14,3.54-1.82,18.63-3.71,37.27-5.54,55.9-.15,1.55-.75,2.2-2.33,2.21-14.73.1-29.47.26-44.2.37A22.43,22.43,0,0,1,103.43,180.89ZM213.54,197.1c-2.23,6.9-12.8,13.81-21.27,14.27-11.81.64-21.46-4.69-25.78-14.27ZM169,181c.51-6.5.91-12.48,1.47-18.44,1.26-13.69,2.62-27.37,3.88-41.06.15-1.72.65-2.52,2.53-2.51,13,0,26,0,39-.06a7.39,7.39,0,0,1,1.13.23c-.21,3.35-.32,6.73-.66,10.08-1.65,16.33-3.38,32.65-5,49-.2,2-1.08,2.79-3,2.82-9.16.12-18.32.33-27.49.38C177,181.4,173.17,181.11,169,181Zm58.24.08c.3-4.21.48-8.08.86-11.93,1.57-15.91,3.22-31.81,4.75-47.71.17-1.8.7-2.48,2.53-2.47q15,.09,30,0c1.74,0,2.45.49,2.62,2.37,1.7,18.57,3.53,37.13,5.29,55.7.11,1.14,0,2.31,0,4Zm45.64,16.09c-1.7,7.24-11.54,14-20.69,14.62-8.45.56-19.13-6.2-22.32-14.62Zm55.44-15.85c-10.83,0-21.67.09-32.5,0-5.81-.05-6-.16-6.62-6-1.83-17.06-3.5-34.14-5.19-51.22-.16-1.62,0-3.28,0-5.09,13.59,0,26.84,0,40.08,0,1.57,0,2.21.58,2.35,2.15,1.32,14.85,2.69,29.7,4,44.55.31,3.4.57,6.81.82,10.22.12,1.64.16,3.29.24,5.09C330.24,181.09,329.26,181.27,328.27,181.27Zm6.36,15.88c-3.21,8.1-14.43,15.12-22.36,14.54-9-.67-19.17-7.55-20.83-14.45A420.23,420.23,0,0,1,334.63,197.15Zm17.11-.27h44.32c-4.57,9.07-11.61,14.09-21.54,14.56C363.77,212,357.17,205.7,351.74,196.88Zm31.82-15.43c-11-.14-22-.36-33-.48-1.86,0-2.58-.62-2.77-2.55q-2.69-28-5.59-55.91c-.24-2.3.5-3.29,2.78-3.28l36.46.19a2.3,2.3,0,0,1,2.59,2.07q6.36,28.88,12.85,57.72a20.89,20.89,0,0,1,.18,2.25C392.36,181.46,388,181.51,383.56,181.45ZM27.42,171.63c11.43-16.3,22.92-32.55,34.31-48.88,1.63-2.34,3.55-3.59,6.4-3.57,10.41.09,20.82.13,31.23.2a6.15,6.15,0,0,1,1.29.34c-.64,3.62-1.17,7.22-1.92,10.76C95.44,146,92,161.56,88.81,177.12c-.58,2.8-1.8,3.83-4.66,3.83-18.83,0-37.66.23-56.49.31-1.94,0-3.88-.36-6.32-.6C23.62,177.28,25.47,174.41,27.42,171.63ZM47.11,211.2c-8.43-1.38-19.28-8.57-20.53-14.19,17.61-.62,35.09-.24,53-.37C73.28,207,59.17,213.18,47.11,211.2ZM449.88,411.37H50.77V380.05l399.11,1.18Zm.09-46.48H50.74V227.05l14.52-2.12c0,1.94,0,3.74,0,5.54q.32,46,.66,92,.09,10,.7,20c.26,4.27,2.75,6.43,7,6.47,39,.36,78,.9,117.05,1q91.29.18,182.59-.19c18.09-.05,36.18-.5,54.27-.79,3.72,0,6.3-2.31,6.52-6.1.4-6.74.69-13.49.74-20.24.16-25.35.17-50.69.3-76,0-5.41.23-10.83.43-16.25a34.24,34.24,0,0,1,.56-3.92L450,228.35Zm.68-152.13c-12,.18-20.87-5.56-27.54-16.12,17.92.15,35.31-.36,53.32.64C469.85,206.83,461.77,212.58,450.65,212.76Zm19-31.55c-17.83,0-35.66-.23-53.48-.27-2.68,0-3.73-1.09-4.26-3.66-3.69-18.1-7.53-36.17-11.3-54.26-.22-1-.27-2.11-.44-3.61,4.18-.12,8.14-.35,12.1-.34,7.42,0,14.83.13,22.24.36a4.4,4.4,0,0,1,3.06,1.48q20.06,28.35,40,56.82c.51.74.92,1.55,1.64,2.76C475.68,180.76,472.64,181.22,469.6,181.21Z"
                    transform="translate(-5.23 -73.3)"
                  />
                  <path
                    d="M173.65,275c-.06-8.58-.38-17.16-.89-25.72a6.48,6.48,0,0,0-2.64-4.68,17.86,17.86,0,0,0-7.76-2c-16.75-.3-33.51-.39-50.26-.46a51.54,51.54,0,0,0-8.95.71c-4.23.74-6.13,3.28-6.13,7.5v28.75h0c0,3.75,0,7.51,0,11.26.11,7.16.1,14.34.5,21.49.26,4.66,1.58,5.72,6.14,6.29a35.41,35.41,0,0,0,4.24.31q28.87.13,57.76.23a6.75,6.75,0,0,0,7.09-5.74,23.2,23.2,0,0,0,.54-4.7C173.49,297.12,173.72,286,173.65,275Zm-15.59,28.43H112.33V257.45h45.73Z"
                    transform="translate(-5.23 -73.3)"
                  />
                  <path
                    d="M188.91,288.29V273.53H296.67v14.76Z"
                    transform="translate(-5.23 -73.3)"
                  />
                  <path
                    d="M296.21,303.86c.25,5.15.46,9.78.69,14.6H189v-14.6Z"
                    transform="translate(-5.23 -73.3)"
                  />
                  <path
                    d="M189.19,256.85c0-4.32-.08-8.47.08-12.61a2.57,2.57,0,0,1,1.76-1.73c14.33-.06,28.66,0,43,.05.15,0,.29.13.67.32.21,4.5.44,9.12.67,14Z"
                    transform="translate(-5.23 -73.3)"
                  />
                </svg>
              </Box>
              <Typography component="span">Farming</Typography>
            </NavLink>
          </ListItem>
        </List>
      </Box>
      {/* <Box textAlign="center">
        <Box width="60%" margin="auto" pt={2} pb={2} display="flex" justifyContent="space-between">
          <Link href="https://t.me/trava_finance" target="_blank" rel="noreferrer noopener">
            <TelegramIcon className={classes.btnIcon} />
          </Link>
          <Link href="https://discord.com/invite/sxWB9rCBew" target="_blank" rel="noreferrer noopener">
            <DiscordIcon className={classes.btnIcon} />
          </Link>
          <Link href="https://medium.com/@travafinance" target="_blank" rel="noreferrer noopener">
            <MediumIcon className={classes.btnIcon} />
          </Link>
          <Link href="https://twitter.com/trava_finance" target="_blank" rel="noreferrer noopener">
            <TwitterIcon className={classes.btnIcon} />
          </Link>
        </Box>
      </Box> */}
    </Box>
  );

  return (
    <Fragment>
      <Hidden mdDown implementation="css">
        <Drawer
          anchor="left"
          variant="permanent"
          open
          elevation={8}
          classes={{ paper: classes.drawerPaper }}
        >
          {nav}
        </Drawer>
      </Hidden>
      <Hidden lgUp implementation="css">
        <Box
          className={classes.menuIcon}
          display="flex"
          alignItems="center"
          left={16}
          top={0}
          position="absolute"
        >
          <MenuIcon className={classes.btnIcon} onClick={handleDrawerToggle} />
        </Box>
        <Drawer
          anchor="left"
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{ paper: classes.drawerPaper }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {nav}
        </Drawer>
      </Hidden>
    </Fragment>
  );
}

export default SideBar;
