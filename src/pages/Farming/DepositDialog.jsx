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
import { useWeb3Connect } from "src/web3/web3-connect";
import PairABI from "src/web3/web3-contract/abis/BundauSwapPair.json";
import FarmABI from "src/web3/web3-contract/abis/BundauSwapFarming.json";
import { farming as farmingAddress } from "src/web3/web3-contract/addresses/bsc-testnet";

import {
    useContractReader,
    useContractSender,
} from "src/web3/web3-contract/hooks/use-contract";
import BigNumber from "bignumber.js";
import useNotifier from "src/hooks/use-notifier";
import { useFarmingContext } from "src/context/farm-context";

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

export default function DepositDialog({
    handleDialogClose,
    lpAmount,
}) {
    const classes = useStyles();
    const { notifyError, notifySuccess } = useNotifier();
    const { currentPairInfo, currentPid, userFarmInfo } = useFarmingContext();
    const { address, getTransactionExplorerLink } = useWeb3Connect();

    const pairSender = useContractSender(PairABI, currentPairInfo?.pairAddress);
    const pairReader = useContractReader(PairABI, currentPairInfo?.pairAddress);
    const farmSender = useContractSender(FarmABI, farmingAddress);

    const [sending, setSending] = useState(false);
    const [bill, setBill] = useState(undefined);
    const [enough, setEnough] = useState(false);

    const fetchAllownace = useCallback(async () => {
        try {
            const allowance = await pairReader.methods
                .allowance(address, farmingAddress)
                .call();
            setEnough(new BigNumber(allowance).isGreaterThanOrEqualTo(lpAmount));
        } catch (error) { }
    }, [address, lpAmount, pairReader])

    useEffect(() => {
        fetchAllownace()
    }, [fetchAllownace])

    const approve = useCallback(async () => {
        setSending(true);
        try {
            if (!enough) {
                await pairSender.methods
                    .approve(farmingAddress, lpAmount)
                    .send({ from: address });
                setEnough(true);
            }
            notifySuccess("Approve successfully!");
        } catch (error) {
            notifyError(error.message);
        }
        setSending(false);
    }, [address, pairSender, enough]);


    const deposit = useCallback(async () => {
        setSending(true);
        try {
            const response = await farmSender.methods
                .deposit(currentPid, lpAmount)
                .send({ from: address });
            const depositEvent = response.events.Deposit;
            setBill({ ...depositEvent.returnValues, txHash: response.transactionHash });
            notifySuccess("Deposit liquidity successfully!");
        } catch (error) {
            notifyError(error.message);
        }
        setSending(false);
    }, [farmSender, address, lpAmount, currentPid]);

    return (
        <Dialog
            maxWidth="md"
            scroll="body"
            open
            fullWidth
            onClose={handleDialogClose}
        >
            <DialogTitle className={classes.dialogTitle} onClose={handleDialogClose}>
                Deposit Liquidity
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                {!bill ? (
                    <Fragment>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <p>Your pending BND reward:</p>
                            <p>
                                <b>
                                    {new BigNumber(userFarmInfo?.userPendingReward)
                                        .dividedBy(10 ** userFarmInfo?.BNDDecimals)
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
                            <p>You will deposit:</p>
                            <p>
                                <b>
                                    {new BigNumber(lpAmount)
                                        .dividedBy(10 ** userFarmInfo?.pairDecimals)
                                        .toFixed(2)}
                                </b>
                            </p>
                        </Box>
                        {
                            enough ?
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
                                :
                                <Fragment>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        padding={2}
                                    >
                                        <p>
                                            You must approve farming contract to spend your lp balances
                                        </p>
                                        <Button
                                            className={classes.button}
                                            onClick={approve}
                                            disabled={sending}
                                        >
                                            {sending ? <CircularProgress /> : "Approve"}
                                        </Button>
                                    </Box>
                                </Fragment>
                        }
                    </Fragment>
                ) : (
                    <Fragment>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                                marginTop: "15px",
                            }}
                        >
                            <p>You have deposited:</p>
                            <p>
                                <b>
                                    {new BigNumber(lpAmount)
                                        .dividedBy(10 ** userFarmInfo?.pairDecimals)
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
