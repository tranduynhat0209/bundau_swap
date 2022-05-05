import { alpha, Box, makeStyles, Typography, useTheme } from "@material-ui/core";
import React from "react";
import ConnectedButton from "src/components/connection/ConnectedButton";
import ConnectWalletButton from "src/components/connection/ConnectWalletButton";
// import CopyButton from "src/components/buttons/CopyButton";
import ThemeSlideButton from "src/components/ThemeSlideButton";
// import { formatAddress } from "src/utils/format";
import { useWeb3Connect } from "src/web3/web3-connect";
import SideBar from "./SideBar";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    minHeight: "100vh",
    backgroundImage: theme.palette.background.primaryGradient,
    backgroundPosition: "center center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    [theme.breakpoints.up("lg")]: {
      display: "flex",
      height: "100vh",
    },
  },
  sidebarContainer: {
    flexShrink: 0,
  },
  mainContainer: {
    flexGrow: 1,
    transition: "all 0.3s linear",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    [theme.breakpoints.up("lg")]: {
      marginLeft: 240,
      width: "calc(100% - 240px)",
    },
  },
  contentContainer: {
    [theme.breakpoints.up("lg")]: {
      flexGrow: 1,
      overflowY: "scroll",
      "&::-webkit-scrollbar": {
        width: 0,
        background: "transparent",
      },
    },
  },
  connectWalletBtn: {
    backgroundColor: theme.palette.background.primary,
    fontWeight: 400,
    fontSize: "1rem",
    boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.12)",
    color: theme.mode === "dark" ? "#EEECF2" : "#000000A6",
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    transitionProperty: "background-color, box-shadow, border, color",
    "&:hover": {
      backgroundColor: "#CEDDE2",
      color: "#000000A6",
    },
  },
}));

export default function MainLayout(props) {
  const classes = useStyles();
  const { address } = useWeb3Connect();
  const theme = useTheme();

  return (
    <Box className={classes.root}>
      <Box component="nav" className={classes.sidebarContainer}>
        <SideBar />
      </Box>
      <Box component="main" px={2} className={classes.mainContainer}>
        <Box
          display="flex"
          justifyContent="center"
          py={1}
          mx={-2}
          style={{ backgroundColor: alpha(theme.palette.primary.main, 0.28) }}
        >
          <Typography align="center" className="second-font" variant="body2">
          🥗 Tran Duy Nhat - 20194135 - Project II
          </Typography>
        </Box>
        <Box height={70} minHeight={70} display="flex" alignItems="center" justifyContent="flex-end">
          {address ? <ConnectedButton /> : <ConnectWalletButton size="medium" className={classes.connectWalletBtn} />}
          <Box px={1.5}></Box>
          <ThemeSlideButton />
          
        </Box>
        <Box className={classes.contentContainer}>{props.children}</Box>
      </Box>
    </Box>
  );
}
