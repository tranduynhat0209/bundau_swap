import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  makeStyles,
} from "@material-ui/core";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useState,
} from "react";
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
  link:{
      color: theme.palette.text.primary
  }
}));

export default function AddLiquidityDialog({
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
  const token0Reader = useContractReader(ERC20ABI, currentPairInfo?.token0Addr);
  const token1Reader = useContractReader(ERC20ABI, currentPairInfo?.token1Addr);
  const token0Sender = useContractSender(ERC20ABI, currentPairInfo?.token0Addr);
  const token1Sender = useContractSender(ERC20ABI, currentPairInfo?.token1Addr);
  const pairSender = useContractSender(PairABI, currentPairInfo?.pairAddress);

  const [enough0, setEnough0] = useState(0);
  const [enough1, setEnough1] = useState(0);
  const [sending, setSending] = useState(false);
  const [bill, setBill] = useState(undefined);

  const fetchAllownace = useCallback(async () => {
    try {
      const allowance0 = await token0Reader.methods
        .allowance(address, currentPairInfo?.pairAddress)
        .call();
      const allowance1 = await token1Reader.methods
        .allowance(address, currentPairInfo?.pairAddress)
        .call();
      setEnough0(new BigNumber(allowance0).isGreaterThanOrEqualTo(amount0));
      setEnough1(new BigNumber(allowance1).isGreaterThanOrEqualTo(amount1));
    } catch (error) {}
  }, [token0Reader, token1Reader, address, currentPairInfo, amount0, amount1]);

  const approve = useCallback(async () => {
    setSending(true);
    try {
      if (!enough0) {
        await token0Sender.methods
          .approve(currentPairInfo?.pairAddress, amount0)
          .send({ from: address });
        setEnough0(true);
      }
      if (!enough1) {
        await token1Sender.methods
          .approve(currentPairInfo?.pairAddress, amount1)
          .send({ from: address });
        setEnough1(true);
      }
      notifySuccess("Approve successfully!");
    } catch (error) {
      notifyError(error.message);
    }
    setSending(false);
  }, [token0Sender, token1Reader, address, amount0, amount1, currentPairInfo]);

  const deposit = useCallback(async () => {
    setSending(true);
    try {
      const response = await pairSender.methods
        .mintLiquidity(amount0, amount1, withLiquidity ? liquidity : 0, address)
        .send({ from: address });
      const mintEvent = response.events.MintLiquidity;
      setBill({ ...mintEvent.returnValues, txHash: response.transactionHash });
      notifySuccess("Add liquidity successfully!");
    } catch (error) {
      notifyError(error.message);
    }
    setSending(false);
  }, [pairSender, address, amount0, amount1, withLiquidity, liquidity]);
  console.log(getTransactionExplorerLink(bill?.txHash))
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
        Add Liquidity
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
              <p>Liquidity minted:</p>
              <p>
                <b>
                  {new BigNumber(liquidity)
                    .dividedBy(10 ** currentPairInfo?.pairDecimals)
                    .toFixed(2)}
                </b>
              </p>
            </Box>
            {!enough0 || !enough1 ? (
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
                  onClick={deposit}
                  disabled={sending}
                >
                  {sending ? <CircularProgress /> : "Deposit"}
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
              <p>Liquidity minted:</p>
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
                marginBottom: "15px"
              }}
            >
            <a className={classes.link}
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
