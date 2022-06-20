import { Box, Button, Dialog, DialogContent, makeStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import MuiSvgIcon from "@material-ui/core/SvgIcon";
import React, { Fragment, useState } from "react";
import DialogTitle from "src/components/CustomizedDialog/DialogTitle";
import { formatAddress } from "src/utils/format";
import { useWeb3Connect } from "src/web3/web3-connect";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    backgroundColor: theme.palette.background.secondary,
    color: "#fff",
  },
  dialogContent: {
    backgroundColor: theme.mode === "dark" ? theme.palette.background.primary : "#fff",
  },
  button: {
    marginTop: "1rem",
    width: "60%",
    fontWeight: 700,
    fontSize: "20px",
  },
}));
const ConnectedWalletButton = withStyles((theme) => ({
  root: {
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

}))(Button);

const WalletIcon = (props) => {
  return (
    <MuiSvgIcon {...props} viewBox="0 0 389.81 369.31">
      <path
        d="M422,253.6c2.35.5,4.5.78,6.54,1.42a23.82,23.82,0,0,1,16.8,22.91c0,19.11-.26,38.23.09,57.33.26,13.52-9.4,24.85-23.43,25.68,0,.82,0,1.68,0,2.53-.14,7.91.13,15.84-.52,23.71-1.21,14.82-8.2,26.78-19.65,36.1-10,8.17-21.7,11.86-34.63,11.86q-128.79,0-257.57,0a53.71,53.71,0,0,1-54-54.09V183c0-26.38,21.6-48.58,48-49,15.23-.24,30.46-.1,45.69,0,1.89,0,2.6-.62,3.21-2.38,11.84-34.73,35.6-56.45,71.56-63.93,37.21-7.75,76.23,9.62,96.27,42a91.91,91.91,0,0,1,10.05,22.14c.47,1.6,1.14,2.21,2.91,2.19,7.76-.11,15.52-.08,23.29,0,21.57.12,37.33,16,37.34,37.64,0,4.63.06,9.26,0,13.89a3,3,0,0,0,1.69,3c14.57,8.87,23.48,21.73,25.77,38.63,1,7.28.5,14.75.66,22.13C422,250.71,422,252.18,422,253.6ZM82.66,176.88l-.61-.14c-.46,4-1.3,7.95-1.31,11.93q-.12,96.42,0,192.84a26.48,26.48,0,0,0,3.69,13.82c5.65,9.49,14,14.63,25,14.64q129.57.11,259.14,0c14.09,0,26.61-11,27.9-25,.71-7.78.28-15.66.35-23.49,0-.18-.2-.37-.37-.67h-3.77c-10.67,0-21.35,0-32,0-29.44-.06-52.69-22.46-53.83-51.83-1.1-28.18,21.6-53.44,49.82-54.9,12-.62,24-.21,36.05-.27,1.32,0,2.64,0,4,0a7.17,7.17,0,0,0,.21-1.12c0-6.42.24-12.85-.06-19.26-.75-15.72-13.18-27.31-29-27.31H220.74c-31.13,0-62.27.19-93.4-.11-15.15-.15-27.68-6.64-37.33-18.34C87.25,184.37,85.1,180.51,82.66,176.88Zm183.54,3.93a5.8,5.8,0,0,0,.59.16c12.54,0,25.08.08,37.62,0a2.36,2.36,0,0,0,1.68-1.5c1.09-4.87,2.57-9.73,2.91-14.66,1.64-24.4-6.89-44.78-26.4-59.52-22.74-17.18-47.72-19.34-73-6.17-22.23,11.6-34,30.83-36.08,55.86a62.51,62.51,0,0,0,3.53,25.92h39.22c.54-5.3,2.38-7,7.63-7,1.79,0,3.59-.06,5.37,0,3.42.15,5.44,2.12,6,5.5.09.58.67,1.53,1.05,1.55,3.62.11,7.25.07,11.1.07a51,51,0,0,1,0-6.09c.48-3.94-1.5-6.14-4.8-7.65-5.28-2.41-10.67-4.64-15.77-7.4-5.9-3.2-9.59-8.21-10.18-15.11-.18-2.15-.17-4.32-.16-6.48,0-9,4-15.18,12.43-18.21,2.64-1,3.11-2.21,3-4.62a5.49,5.49,0,0,1,5.48-6,66.62,66.62,0,0,1,7.61,0,5.62,5.62,0,0,1,5.52,5.86c0,1.26,0,2.51,0,3.71,12.52,3.93,15.45,12.59,15.06,21-.13,2.66-1,4-3.67,4.11-3.72.21-7.46.26-11.18.18-2.49-.06-3.77-1.55-3.88-4,0-.67,0-1.35,0-2-.2-3.23-2.15-4.7-6.1-4.63s-5.54,1.56-5.6,4.88a17.12,17.12,0,0,0,.08,4.24,10.34,10.34,0,0,0,2,4.26,11.06,11.06,0,0,0,3.76,2.33c5.13,2.39,10.43,4.46,15.43,7.09,6.49,3.41,9.75,9,9.71,16.4C266.19,175.41,266.2,178.08,266.2,180.81Zm153.89,98.3a12,12,0,0,0-1.42-.17c-19.41,0-38.82-.13-58.23,0-18.48.15-31.79,16.66-28,34.37a28.55,28.55,0,0,0,27.75,22.37c19.33.09,38.67,0,58,0,.58,0,1.16-.07,1.86-.12ZM147.83,159.19H104c0,.5,0,.88.1,1.24a24.56,24.56,0,0,0,22.21,20.38c8.06.61,16.22.12,24.14.12C149.58,173.77,148.72,166.63,147.83,159.19Zm184.34,21.86h36.42c0-4.34.34-8.45-.08-12.49-.56-5.33-5.48-9.37-10.86-9.48-3.06-.06-6.12,0-9.18,0H334.91C334,166.57,333.08,173.78,332.17,181.05Z"
        transform="translate(-55.59 -65.83)"
      />
    </MuiSvgIcon>
  );
};

export default function ConnectedButton() {
  const classes = useStyles()
  const { address, disconnect } = useWeb3Connect();
  const [openDialog, setOpenDialog] = useState(false);
  const handleDialogClose = () => {
    setOpenDialog(false)
  }
  return (
    <Fragment>
      <ConnectedWalletButton color="primary" disableElevation startIcon={<WalletIcon />} onClick = {() => setOpenDialog(true)}>
        {formatAddress(address)}
      </ConnectedWalletButton>
      <Dialog maxWidth="xs" fullWidth open={openDialog} onClose={handleDialogClose}>
        <DialogTitle
          className={classes.dialogTitle}
          classes={{ closeButton: classes.closeIcon }}
          onClose={handleDialogClose}
        >
          You have connected
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <p><b>Your Address</b></p>
          {address}
          <Box display="flex" width="100%" justifyContent="center">

          <Button 
            className={classes.button}
            onClick={disconnect}
          >
            Disconnect
          </Button>

          </Box>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
