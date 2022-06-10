import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  makeStyles,
} from "@material-ui/core";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import DialogTitle from "src/components/CustomizedDialog/DialogTitle";
import { usePairContext } from "src/context/pair-context";
import { useWeb3Connect } from "src/web3/web3-connect";
import PairABI from "src/web3/web3-contract/abis/BundauSwapPair.json";

import {
  useContractSender,
} from "src/web3/web3-contract/hooks/use-contract";
import BigNumber from "bignumber.js";
import TokenSwitch from "src/components/PairSwitch/TokenSwitch";
import useNotifier from "src/hooks/use-notifier";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    backgroundColor: theme.palette.background.secondary,
    color: "#fff",
  },
  dialogContent: {
    backgroundColor:
      theme.mode === "dark" ? theme.palette.background.primary : "#fff",
  },
  listItem: {
    borderBottom: "1px solid green",
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(1, 2, 1, 2),
  },
  tokenImg: {
    width: "50px",
  },
  button: {
    width: "60%",
    fontWeight: 700,
    fontSize: "20px",
    marginTop: "5px",
  },
  link: {
    color: theme.palette.text.primary,
  },
}));

export default function RemoveLiquidityDialog({
  handleDialogClose,
  amount0,
  amount1,
  liquidity,
  withLiquidity,
}) {
  const classes = useStyles();
  const { currentPairInfo } = usePairContext();
  const { notifyError, notifySuccess } = useNotifier();
  const { address, getTransactionExplorerLink } = useWeb3Connect();

  const pairSender = useContractSender(PairABI, currentPairInfo?.pairAddress);

  const [sending, setSending] = useState(false);
  const [bill, setBill] = useState(undefined);

  const withdraw = useCallback(async () => {
    setSending(true);
    try {
      const response = await pairSender.methods
        .burnLiquidity(amount0, amount1, withLiquidity ? liquidity : 0, address)
        .send({ from: address });
      const burnEvent = response.events.BurnLiquidity;
      setBill({ ...burnEvent.returnValues, txHash: response.transactionHash });
      notifySuccess("Remove liquidity successfully!");
    } catch (error) {
      notifyError(error.message);
    }
    setSending(false);
  }, [pairSender, address, amount0, amount1, withLiquidity, liquidity]);

  return (
    <Dialog
      maxWidth="md"
      scroll="body"
      open
      fullWidth
      onClose={handleDialogClose}
    >
      <DialogTitle className={classes.dialogTitle} onClose={handleDialogClose}>
        Remove Liquidity
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {!bill ? (
          <Fragment>
            <p>You receive:</p>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <TokenSwitch
                right={false}
                token={{
                  image: currentPairInfo?.token0Img,
                  symbol: currentPairInfo?.token0Symbol,
                }}
              />
              <p>
                <b>
                  {new BigNumber(amount0)
                    .dividedBy(10 ** currentPairInfo?.token0Decimals)
                    .toFixed(2)}
                </b>
              </p>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <TokenSwitch
                right={false}
                token={{
                  image: currentPairInfo?.token1Img,
                  symbol: currentPairInfo?.token1Symbol,
                }}
              />
              <p>
                <b>
                  {new BigNumber(amount1)
                    .dividedBy(10 ** currentPairInfo?.token1Decimals)
                    .toFixed(2)}
                </b>
              </p>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "15px",
              }}
            >
              <p>Liquidity burned:</p>
              <p>
                <b>
                  {new BigNumber(liquidity)
                    .dividedBy(10 ** currentPairInfo?.pairDecimals)
                    .toFixed(2)}
                </b>
              </p>
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              padding={2}
            >
              <Button
                className={classes.button}
                onClick={withdraw}
                disabled={sending}
              >
                {sending ? <CircularProgress /> : "Withdraw"}
              </Button>
            </Box>
          </Fragment>
        ) : (
          <Fragment>
            <p>You received:</p>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <TokenSwitch
                right={false}
                token={{
                  image: currentPairInfo?.token0Img,
                  symbol: currentPairInfo?.token0Symbol,
                }}
              />
              <p>
                <b>
                  {new BigNumber(bill.amount0)
                    .dividedBy(10 ** currentPairInfo?.token0Decimals)
                    .toFixed(2)}
                </b>
              </p>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <TokenSwitch
                right={false}
                token={{
                  image: currentPairInfo?.token1Img,
                  symbol: currentPairInfo?.token1Symbol,
                }}
              />
              <p>
                <b>
                  {new BigNumber(bill.amount1)
                    .dividedBy(10 ** currentPairInfo?.token1Decimals)
                    .toFixed(2)}
                </b>
              </p>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "15px",
              }}
            >
              <p>Liquidity burned:</p>
              <p>
                <b>
                  {new BigNumber(liquidity)
                    .dividedBy(10 ** currentPairInfo?.pairDecimals)
                    .toFixed(2)}
                </b>
              </p>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                marginTop: "15px",
                marginBottom: "15px",
              }}
            >
              <a
                className={classes.link}
                href={getTransactionExplorerLink(bill.txHash)}
                target="_blank"
              >
                View Transaction
              </a>
            </Box>
          </Fragment>
        )}
      </DialogContent>
    </Dialog>
  );
}
