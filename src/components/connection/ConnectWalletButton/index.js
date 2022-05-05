import { alpha, Box, Button, Dialog, Divider, makeStyles, Typography, Link } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import clsx from "clsx";
import React, { Fragment, useState } from "react";
import DialogContent from "src/components/CustomizedDialog/DialogContent";
import DialogTitle from "src/components/CustomizedDialog/DialogTitle";
import { useWeb3Connect } from "src/web3/web3-connect";

import metamaskImg from "./assets/images/metamask.png";
import walletConnectImg from "./assets/images/wallet-connect.png";
 
const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    backgroundColor: theme.palette.background.secondary,
    color: "#fff",
  },
  dialogContent: {
    backgroundColor: theme.mode === "dark" ? theme.palette.background.primary : "#fff",
  },
  walletBtn: {
    cursor: "pointer",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderRadius: 4,
    "&:hover": {
      backgroundColor: alpha("#000", 0.1),
    },
  },
  walletName: {
    fontWeight: 600,
    [theme.breakpoints.down("xs")]: {
      fontSize: "1rem",
    },
  },
  footerText: {
    fontSize: 12,
  },
}));

const WalletButton = withStyles((theme) => ({
  root: {
    cursor: "pointer",
    padding: theme.spacing(2, 0),
    borderRadius: 4,
    "&:hover": {
      backgroundColor: alpha("#000", 0.1),
    },
    "& .MuiButton-label": {
      height: "100%",
    },
  },
}))(Button);

export default function ConnectWalletButton(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const classes = useStyles();
  const { connectMetamask, connectWalletConnect } = useWeb3Connect();

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleMetamaskConnect = async () => {
    await connectMetamask();
    setOpenDialog(false);
  };

  const handleWalletConnectConnect = async () => {
    await connectWalletConnect();
    setOpenDialog(false);
  };

  return (
    <Fragment>
      <Button size="large" variant="contained" color="primary" disableElevation {...props} onClick={handleDialogOpen}>
        Connect wallet
      </Button>
      <Dialog maxWidth="xs" fullWidth open={openDialog} onClose={handleDialogClose}>
        <DialogTitle
          className={classes.dialogTitle}
          classes={{ closeButton: classes.closeIcon }}
          onClose={handleDialogClose}
        >
          Choose Wallet
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Box display="flex">
            <WalletButton
              fullWidth
              className={classes.walletBtn}
              flexGrow={1}
              flexBasis={"50%"}
              onClick={handleMetamaskConnect}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="center" mb={1}>
                  <img width={65} src={metamaskImg} alt="metamask" />
                </Box>
                <Typography variant="h6" color="textSecondary" className={classes.walletName}>
                  Metamask
                </Typography>
              </Box>
            </WalletButton>
            <WalletButton
              fullWidth
              className={classes.walletBtn}
              flexGrow={1}
              flexBasis={"50%"}
              onClick={handleWalletConnectConnect}
            >
              <Box height="100%" display="flex" flexDirection="column" alignItems="center">
                <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="center" mb={1}>
                  <img width={70} src={walletConnectImg} alt="wallet connect" />
                </Box>
                <Typography variant="h6" color="textSecondary" className={classes.walletName}>
                  WalletConnect
                </Typography>
              </Box>
            </WalletButton>
          </Box>
          
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
