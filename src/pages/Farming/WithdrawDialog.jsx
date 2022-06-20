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

export default function WithdrawDialog({
    handleDialogClose,
    lpAmount,
}) {
    const classes = useStyles();
    const { notifyError, notifySuccess } = useNotifier();
    const { currentPid, userFarmInfo } = useFarmingContext();
    const { address, getTransactionExplorerLink } = useWeb3Connect();

    const farmSender = useContractSender(FarmABI, farmingAddress);

    const [sending, setSending] = useState(false);
    const [bill, setBill] = useState(undefined);

    const withdraw = useCallback(async () => {
        setSending(true);
        try {
            const response = await farmSender.methods
                .withdraw(currentPid, lpAmount)
                .send({ from: address });
            const withdrawEvent = response.events.Withdraw;
            setBill({ ...withdrawEvent.returnValues, txHash: response.transactionHash });
            notifySuccess("Withdraw liquidity successfully!");
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
                Withdraw Liquidity
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
                            <p>You will withdraw:</p>
                            <p>
                                <b>
                                    {new BigNumber(lpAmount)
                                        .dividedBy(10 ** userFarmInfo?.pairDecimals)
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
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                                marginTop: "15px",
                            }}
                        >
                            <p>You have withdrawn:</p>
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
