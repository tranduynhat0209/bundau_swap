import { Fragment, useState } from "react";
import PaperContainer from "src/components/PaperContainer";
import { makeStyles, Tabs, Tab, Box, Button, TextField } from "@material-ui/core";
import FarmedPairSwitch from "src/components/FarmedPairSwitch";
import { useFarmingContext } from "src/context/farm-context";
import { toDecimal } from "src/utils/format";
import BigNumber from "bignumber.js";
import DepositDialog from "./DepositDialog";
import WithdrawDialog from "./WithdrawDialog";

const useStyles = makeStyles((theme) => ({
    paper: {
        [theme.breakpoints.up("xs")]: {
            width: "95%",
        },
        [theme.breakpoints.up("sm")]: {
            width: "70%",
        },
        [theme.breakpoints.up("md")]: {
            width: "50%",
        },
    },
    button: {
        width: "60%",
        fontWeight: 700,
        fontSize: "20px",
    },
}));

export default function FarmingContent() {
    const classes = useStyles();
    const { userFarmInfo } = useFarmingContext();
    console.log("User Farm Info", userFarmInfo)
    const [add, setAdd] = useState(true);
    const [amount, setAmount] = useState("");
    const [helperText, setHelperText] = useState("Invalid LP amount");
    const [openDepositDialog, setOpenDepositDialog] = useState(false);
    const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);
    const toggleAdd = () => {
        setAdd((add) => !add);
    };
    const handleChangeAmount = (ev) => {
        const amount = ev.target.value;
        setAmount(amount);
        let amountBN = new BigNumber(amount);
        if (amountBN.isNaN() || amountBN.isLessThanOrEqualTo(0)) {
            setHelperText("Invalid LP amount");
            return;
        }
        let realAmount = amountBN.multipliedBy(10 ** userFarmInfo?.pairDecimals);
        if (!realAmount.isInteger()) {
            setHelperText("Invalid LP decimals");
            return;
        }
        if (add) {
            if (realAmount.isGreaterThan(new BigNumber(userFarmInfo?.pairBalance))) {
                setHelperText("Insufficient LP balance")
                return;
            }
        }
        else{
            if (realAmount.isGreaterThan(new BigNumber(userFarmInfo?.userDeposited))){
                setHelperText("Insufficient LP deposited")
                return;
            }
        }
        setHelperText(undefined)
    }

    return (
        <Fragment>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    margin: "2rem 0",
                }}
            >
                <FarmedPairSwitch />
            </Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                }}
            >
                <Box className={classes.paper}>
                    <PaperContainer>
                        <Box
                            sx={{
                                marginTop: "2rem",
                            }}
                        >
                            <Tabs
                                value={add ? 0 : 1}
                                onChange={toggleAdd}
                                indicatorColor="primary"
                                textColor="primary"
                                centered
                            >
                                <Tab label="Deposit" />
                                <Tab label="Withdraw" />
                            </Tabs>
                            <p style={{ marginTop: "1rem" }}>LP Amount: </p>
                            <TextField
                                id="quote"
                                size="medium"
                                variant="outlined"
                                placeholder="Input your amount"
                                value={amount}
                                onChange={handleChangeAmount}
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <p style={{ width: "150px" }}>
                                            Your Balance: <b>{toDecimal(userFarmInfo?.pairBalance, userFarmInfo?.pairDecimals)}</b>
                                        </p>
                                    ),
                                }}
                            />
                        </Box>

                        <p
                            style={{
                                color: "red",
                            }}
                        >
                            {helperText}
                        </p>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                marginTop: '2rem',
                            }}
                        >
                            <p>Your deposited LP</p>
                            <b>{toDecimal(userFarmInfo?.userDeposited, userFarmInfo?.pairDecimals)}</b>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                marginTop: '1rem',
                            }}
                        >
                            <p>Your pending reward</p>
                            <b>{toDecimal(userFarmInfo?.userPendingReward, userFarmInfo?.BNDDecimals) + ' BND'}</b>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                marginTop: '1rem',
                            }}
                        >
                            <p>Total pending reward</p>
                            <b>{toDecimal(userFarmInfo?.totalPendingReward, userFarmInfo?.BNDDecimals) + ' BND'}</b>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                marginTop: '1rem',
                            }}
                        >
                            <p>Your BND balance</p>
                            <b>{toDecimal(userFarmInfo?.BNDBalance, userFarmInfo?.BNDDecimals) + ' BND'}</b>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                                padding: "1rem",
                            }}
                        >
                            <Button
                                className={classes.button}
                                disabled={helperText !== undefined}
                                onClick = {
                                    () => {
                                        add? setOpenDepositDialog(true) : setOpenWithdrawDialog(true)
                                    }
                                }
                            >
                                {add ? "Deposit" : "Withdraw"}
                            </Button>
                            {
                                openDepositDialog && 
                                <DepositDialog
                                handleDialogClose={() => setOpenDepositDialog(false)}
                                lpAmount = {new BigNumber(amount).multipliedBy(10 ** userFarmInfo?.pairDecimals)}
                                />

                            }
                            {
                                openWithdrawDialog && 
                                <WithdrawDialog
                                handleDialogClose={() => setOpenWithdrawDialog(false)}
                                lpAmount = {new BigNumber(amount).multipliedBy(10 ** userFarmInfo?.pairDecimals)}
                                />
                                
                            }
                        </Box>

                    </PaperContainer>
                </Box>
            </Box>
        </Fragment>
    );
}
