import { Box, Drawer, Hidden, Link, List, ListItem, Typography } from "@material-ui/core";
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
            <NavLink to="/dashboard" className={classes.navLink} activeClassName={classes.activeLink}>
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
            <NavLink to="/swap" className={classes.navLink} activeClassName={classes.activeLink}>
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
            <NavLink to="/liquidity" className={classes.navLink} activeClassName={classes.activeLink}>
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
        <Drawer anchor="left" variant="permanent" open elevation={8} classes={{ paper: classes.drawerPaper }}>
          {nav}
        </Drawer>
      </Hidden>
      <Hidden lgUp implementation="css">
        <Box className={classes.menuIcon} display="flex" alignItems="center" left={16} top={0} position="absolute">
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
