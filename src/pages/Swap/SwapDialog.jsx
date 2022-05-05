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
import ERC20ABI from "src/web3/web3-contract/abis/ERC20.json";
import {
  useContractReader,
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

export default function SwapDialog({
  handleDialogClose,
  swap0To1,
  amount0,
  amount1,
}) {
  const classes = useStyles();
  const { userPairInfo } = usePairContext();
  const { notifyError, notifySuccess } = useNotifier();
  const { address, getTransactionExplorerLink } = useWeb3Connect();
  const token0Reader = useContractReader(ERC20ABI, userPairInfo?.token0Addr);
  const token1Reader = useContractReader(ERC20ABI, userPairInfo?.token1Addr);
  const token0Sender = useContractSender(ERC20ABI, userPairInfo?.token0Addr);
  const token1Sender = useContractSender(ERC20ABI, userPairInfo?.token1Addr);
  const pairSender = useContractSender(PairABI, userPairInfo?.pairAddress);

  const [enough0, setEnough0] = useState(0);
  const [enough1, setEnough1] = useState(0);
  const [sending, setSending] = useState(false);
  const [bill, setBill] = useState(undefined);

  const getTokenInfo = (token0) => {
    return token0
      ? { image: userPairInfo?.token0Img, symbol: userPairInfo?.token0Symbol }
      : { image: userPairInfo?.token1Img, symbol: userPairInfo?.token1Symbol };
  };
  const getAmount = (token0) => {
    return token0 ? amount0 : amount1;
  };
  const getDecimals = (token0) => {
    return token0 ? userPairInfo?.token0Decimals : userPairInfo?.token1Decimals;
  };
  const fetchAllownace = useCallback(async () => {
    try {
      const allowance0 = await token0Reader.methods
        .allowance(address, userPairInfo?.pairAddress)
        .call();
      const allowance1 = await token1Reader.methods
        .allowance(address, userPairInfo?.pairAddress)
        .call();
      setEnough0(new BigNumber(allowance0).isGreaterThanOrEqualTo(amount0));
      setEnough1(new BigNumber(allowance1).isGreaterThanOrEqualTo(amount1));
    } catch (error) {}
  }, [token0Reader, token1Reader, address, userPairInfo, amount0, amount1]);

  const approve = useCallback(async () => {
    setSending(true);
    try {
      if (!enough0 && swap0To1) {
        await token0Sender.methods
          .approve(userPairInfo?.pairAddress, amount0)
          .send({ from: address });
        setEnough0(true);
      }
      if (!enough1 && !swap0To1) {
        await token1Sender.methods
          .approve(userPairInfo?.pairAddress, amount1)
          .send({ from: address });
        setEnough1(true);
      }
      notifySuccess("Approve successfully!");
    } catch (error) {
      notifyError(error.message);
    }
    setSending(false);
  }, [
    token0Sender,
    token1Reader,
    address,
    amount0,
    amount1,
    userPairInfo,
    swap0To1,
  ]);

  const swap = useCallback(async () => {
    setSending(true);
    try {
      let response;
      if (swap0To1)
        response = await pairSender.methods
          .swap0To1(amount0, amount1, address)
          .send({ from: address });
      else
        response = await pairSender.methods
          .swap1To0(amount1, amount0, address)
          .send({ from: address });
      const swapEvent = response.events.Swap;
      setBill({ ...swapEvent.returnValues, txHash: response.transactionHash });
      notifySuccess("Swap successfully!");
    } catch (error) {
      notifyError(error.message);
    }
    setSending(false);
  }, [pairSender, address, amount0, amount1, swap0To1]);

  useEffect(() => {
    fetchAllownace();
  }, [fetchAllownace]);
  return (
    <Dialog
      maxWidth="md"
      scroll="body"
      open
      fullWidth
      onClose={handleDialogClose}
    >
      <DialogTitle className={classes.dialogTitle} onClose={handleDialogClose}>
        Swap
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {!bill ? (
          <Fragment>
            <p>You deposit:</p>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <TokenSwitch right={false} token={getTokenInfo(swap0To1)} />
              <p>
                <b>
                  {new BigNumber(getAmount(swap0To1))
                    .dividedBy(10 ** getDecimals(swap0To1))
                    .toFixed(2)}
                </b>
              </p>
            </Box>
            <p style={{ marginTop: "10px" }}>{"You receive (estimate):"}</p>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <TokenSwitch right={false} token={getTokenInfo(!swap0To1)} />
              <p>
                <b>
                  {new BigNumber(getAmount(!swap0To1))
                    .dividedBy(10 ** getDecimals(!swap0To1))
                    .toFixed(2)}
                </b>
              </p>
            </Box>

            {(swap0To1 && !enough0) || (!swap0To1 && !enough1) ? (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                padding={2}
              >
                <p>
                  You must approve pair contract to spend your token balances
                </p>
                <Button
                  className={classes.button}
                  onClick={approve}
                  disabled={sending}
                >
                  {sending ? <CircularProgress /> : "Approve"}
                </Button>
              </Box>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                padding={2}
              >
                <Button
                  className={classes.button}
                  onClick={swap}
                  disabled={sending}
                >
                  {sending ? <CircularProgress /> : "Swap"}
                </Button>
              </Box>
            )}
          </Fragment>
        ) : (
          <Fragment>
            <p>You deposited:</p>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <TokenSwitch right={false} token={getTokenInfo(swap0To1)} />
              <p>
                <b>
                  {new BigNumber(swap0To1 ? bill.amount0In : bill.amount1In)
                    .dividedBy(10 ** getDecimals(swap0To1))
                    .toFixed(2)}
                </b>
              </p>
            </Box>
            <p style={{ marginTop: "10px" }}>You received:</p>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <TokenSwitch right={false} token={getTokenInfo(!swap0To1)} />
              <p>
                <b>
                  {new BigNumber(swap0To1 ? bill.amount1Out : bill.amount0Out)
                    .dividedBy(10 ** getDecimals(!swap0To1))
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
