import React, { Fragment, useState } from 'react'
import {
  Box,
  Button,
  makeStyles,
  Tab,
  Tabs,
  TextField,
} from '@material-ui/core'
import PairSwitch from 'src/components/PairSwitch'
import PaperContainer from 'src/components/PaperContainer'
import TokenSwitch from 'src/components/PairSwitch/TokenSwitch'
import SwapVertRoundedIcon from '@material-ui/icons/SwapVertRounded'
import BigNumber from 'bignumber.js'
import { usePairContext } from 'src/context/pair-context'
import { toDecimal } from 'src/utils/format'
import {
  Swap0To1,
  Swap1To0,
  Swap0To1WithMinAmountOut,
  Swap1To0WithMinAmountOut,
} from './calculator'
import SwapDialog from './SwapDialog'

const useStyles = makeStyles((theme) => ({
  paper: {
    [theme.breakpoints.up('xs')]: {
      width: '95%',
    },
    [theme.breakpoints.up('sm')]: {
      width: '70%',
    },
    [theme.breakpoints.up('md')]: {
      width: '50%',
    },
  },
  button: {
    width: '60%',
    fontWeight: 700,
    fontSize: '20px',
  },
}))

export default function Swap() {
  const classes = useStyles()
  const [rev, setRev] = useState(false)
  const [helperText, setHelperText] = useState(undefined)
  const [amount0, setAmount0] = useState(0)
  const [amount1, setAmount1] = useState(0)
  const [openSwapDialog, setOpenSwapDialog] = useState(false)
  const toggleRev = () => {
    setRev((prev) => !prev)
    setAmount0(0)
    setAmount1(0)
  }

  const { userPairInfo, currentPairReserveInfo } = usePairContext()
  const getTokenInfo = (token0) => {
    return token0
      ? { image: userPairInfo?.token0Img, symbol: userPairInfo?.token0Symbol }
      : { image: userPairInfo?.token1Img, symbol: userPairInfo?.token1Symbol }
  }
  const getBalance = (token0) => {
    return token0
      ? toDecimal(userPairInfo?.token0Balance, userPairInfo?.token0Decimals)
      : toDecimal(userPairInfo?.token1Balance, userPairInfo?.token1Decimals)
  }

  const getAmount = (token0) => {
    return token0 ? amount0 : amount1
  }

  const handleChange = (token0, ev) => {
    if (token0) {
      setAmount0(ev.target.value)
    } else {
      setAmount1(ev.target.value)
    }
    validateValue(ev.target.value, token0)
  }
  const validateValue = (val, token0) => {
    val = new BigNumber(val).multipliedBy(
      10 **
        (token0 ? userPairInfo?.token0Decimals : userPairInfo?.token1Decimals),
    )
    if (val.isNaN() || val.isLessThanOrEqualTo(0)) {
      setHelperText('Invalid input value')
      return false
    }
    if (!val.isInteger()) {
      setHelperText('Invalid decimals of input value')
      return false
    }
    let output
    const { token0Reserve, token1Reserve } = currentPairReserveInfo
    const { token0Balance, token1Balance } = userPairInfo
    if (token0 !== rev) {
      if (
        (token0 && val.isGreaterThan(token0Balance)) ||
        (!token0 && val.isGreaterThan(token1Balance))
      ) {
        setHelperText('Not enough balance')
        return false
      }
    }
    if (rev) {
      if (token0) {
        output = Swap1To0WithMinAmountOut(token0Reserve, token1Reserve, val)
      } else {
        output = Swap1To0(token0Reserve, token1Reserve, val)
      }
    } else {
      if (token0) {
        output = Swap0To1(token0Reserve, token1Reserve, val)
      } else {
        output = Swap0To1WithMinAmountOut(token0Reserve, token1Reserve, val)
      }
    }
    if (typeof output === 'string') {
      setHelperText(output)
      return false
    }
    if (token0)
      setAmount1(
        new BigNumber(output[1])
          .dividedBy(10 ** userPairInfo?.token1Decimals)
          .toString(),
      )
    else
      setAmount0(
        new BigNumber(output[0])
          .dividedBy(10 ** userPairInfo?.token0Decimals)
          .toString(),
      )
    setHelperText(undefined)
    return true
  }
  return (
    <Fragment>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          margin: '2rem 0',
        }}
      >
        <PairSwitch />
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Box className={classes.paper}>
          <PaperContainer>
            <Box
              sx={{
                marginTop: '2rem',
              }}
            >
              <p>You deposit: </p>
              <TokenSwitch right={false} token={getTokenInfo(!rev)} />
              <TextField
                id="quote"
                size="medium"
                variant="outlined"
                placeholder="Input your amount"
                value={getAmount(!rev)}
                onChange={(ev) => handleChange(!rev, ev)}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <p style={{ width: '150px' }}>
                      Your Balance: <b>{getBalance(!rev)}</b>
                    </p>
                  ),
                }}
              />
            </Box>
            <Box
              onClick={toggleRev}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                margin: '1rem',
                transition: 'transform 1s ease',
                transform: rev ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <SwapVertRoundedIcon />
            </Box>
            <Box>
              <p>{'You receive (estimate):'} </p>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <TokenSwitch right={false} token={getTokenInfo(rev)} />
              </Box>
              <TextField
                id="quote"
                size="medium"
                variant="outlined"
                placeholder="Input your amount"
                value={getAmount(rev)}
                onChange={(ev) => handleChange(rev, ev)}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <p style={{ width: '150px' }}>
                      Your Balance: <b>{getBalance(rev)}</b>
                    </p>
                  ),
                }}
              />
            </Box>
            <p
              style={{
                color: 'red',
              }}
            >
              {helperText}
            </p>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                padding: '1rem',
              }}
            >
              <Button
                className={classes.button}
                onClick={() => setOpenSwapDialog(true)}
                disabled={
                  !new BigNumber(amount0).isGreaterThan(0) ||
                  !new BigNumber(amount1).isGreaterThan(0) ||
                  helperText
                }
              >
                Swap
              </Button>
            </Box>
            {openSwapDialog && (
              <SwapDialog
                swap0To1={!rev}
                amount0={new BigNumber(amount0).multipliedBy(
                  10 ** userPairInfo?.token0Decimals,
                )}
                amount1={new BigNumber(amount1).multipliedBy(
                  10 ** userPairInfo?.token1Decimals,
                )}
                handleDialogClose={() => setOpenSwapDialog(false)}
              />
            )}
          </PaperContainer>
        </Box>
      </Box>
    </Fragment>
  )
}
