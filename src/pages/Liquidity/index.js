import React, { Fragment, useCallback, useMemo, useState } from 'react'
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
import { usePairContext } from 'src/context/pair-context'
import { toDecimal } from 'src/utils/format'
import BigNumber from 'bignumber.js'
import {
  addWithLiquidity,
  addWithTokenAmount,
  removeWithLiquidity,
  removeWithTokenAmount,
} from './calculator'
import AddLiquidityDialog from './AddLiquidityDialog'
import RemoveLiquidityDialog from './RemoveLiquidityDialog'
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

export default function Liquidity() {
  const classes = useStyles()
  const [add, setAdd] = useState(true)
  const [withLiquidity, setWithLiquidity] = useState(false)
  const [helperText, setHelperText] = useState(undefined)
  const [helperTextLiquidity, setHelperTextLiquidity] = useState(undefined)

  const [amount0, setAmount0] = useState(0)
  const [amount1, setAmount1] = useState(0)
  const [liquidity, setLiquidity] = useState(0)

  const [eAmount0, setEAmount0] = useState(0)
  const [eAmount1, setEAmount1] = useState(0)
  const [eLiquidity, setELiquidity] = useState(0)

  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false)
  const { loading, userPairInfo, currentPairReserveInfo } = usePairContext()
  const rate = useMemo(() => {
    if (!currentPairReserveInfo) return 0
    const { token0Reserve, token1Reserve } = currentPairReserveInfo
    if (token0Reserve > 0) {
      return new BigNumber(token1Reserve).dividedBy(token0Reserve)
    }
    return 0
  }, [currentPairReserveInfo])
  const shareOfPool = useMemo(() => {
    if (!currentPairReserveInfo) return 0
    const { totalLiquidity } = currentPairReserveInfo

    if (totalLiquidity > 0) {
      if (!userPairInfo) return 0
      return new BigNumber(userPairInfo?.liquidity)
        .dividedBy(totalLiquidity)
        .multipliedBy(100)
    }
    return 0
  }, [currentPairReserveInfo, userPairInfo])

  const validateValue = (val, token0, decimals = -1) => {
    val = new BigNumber(val)
    if (val.isNaN() || val.isLessThanOrEqualTo(0)) {
      setHelperText('Invalid input value')
      setELiquidity(0)
      return false
    }
    if (decimals >= 0 && !val.multipliedBy(10 ** decimals).isInteger()) {
      setHelperText('Invalid decimals of input value')
      setELiquidity(0)
      return false
    }

    const amount0BN = new BigNumber(token0 ? val : amount0).multipliedBy(
      10 ** userPairInfo?.token0Decimals,
    )
    const amount1BN = new BigNumber(token0 ? amount1 : val).multipliedBy(
      10 ** userPairInfo?.token1Decimals,
    )
    const {
      token0Reserve,
      token1Reserve,
      totalLiquidity,
    } = currentPairReserveInfo

    const {
      token0Balance,
      token1Balance,
      liquidity: userLiquidity,
    } = userPairInfo

    if (add) {
      if (
        amount0BN.isGreaterThan(token0Balance) ||
        amount1BN.isGreaterThan(token1Balance)
      ) {
        setHelperText('Not enough balance')
        setELiquidity(0)
        return false
      }
      const output = addWithTokenAmount(
        token0Reserve,
        token1Reserve,
        totalLiquidity,
        amount0BN,
        amount1BN,
      )

      if (typeof output === 'string') {
        setHelperText(output)
        setELiquidity(0)
        return false
      }

      setELiquidity(output[2])
      setEAmount0(output[0])
      setEAmount1(output[1])
    } else {
      const output = removeWithTokenAmount(
        token0Reserve,
        token1Reserve,
        totalLiquidity,
        amount0BN,
        amount1BN,
      )

      if (typeof output === 'string') {
        setHelperText(output)
        setELiquidity(0)
        return false
      }

      if (output[2].isGreaterThan(userLiquidity)) {
        setHelperText('Not enough liquidity balance')
        setELiquidity(0)
        return false
      }
      setELiquidity(output[2])
      setEAmount0(output[0])
      setEAmount1(output[1])
    }
    setHelperText(undefined)

    return true
  }

  const validateValueLiquidity = (val, decimals = -1) => {
    val = new BigNumber(val)
    if (val.isNaN() || val.isLessThanOrEqualTo(0)) {
      setHelperTextLiquidity('Invalid input value')
      setEAmount0(0)
      setEAmount1(0)
      return false
    }
    if (decimals >= 0 && !val.multipliedBy(10 ** decimals).isInteger()) {
      setHelperTextLiquidity('Invalid decimals of input value')
      setEAmount0(0)
      setEAmount1(0)
      return false
    }
    const {
      token0Reserve,
      token1Reserve,
      totalLiquidity,
    } = currentPairReserveInfo
    if (add) {
      const output = addWithLiquidity(
        token0Reserve,
        token1Reserve,
        totalLiquidity,
        new BigNumber(val).multipliedBy(10 ** decimals),
      )
      if (typeof output === 'string') {
        setHelperTextLiquidity(output)
        setEAmount0(0)
        setEAmount1(0)
        return false
      }

      setEAmount0(output[0])
      setEAmount1(output[1])
      setELiquidity(output[2])
    } else {
      const output = removeWithLiquidity(
        token0Reserve,
        token1Reserve,
        totalLiquidity,
        new BigNumber(val).multipliedBy(10 ** decimals),
      )
      if (typeof output === 'string') {
        setHelperTextLiquidity(output)
        setEAmount0(0)
        setEAmount1(0)
        return false
      }

      setEAmount0(output[0])
      setEAmount1(output[1])
      setELiquidity(output[2])
    }
    setHelperTextLiquidity(undefined)
    return true
  }

  const handleChangeAmount0 = (ev) => {
    setAmount0(ev.target.value)
    validateValue(ev.target.value, true, userPairInfo?.token0Decimals)
  }

  const handleChangeAmount1 = (ev) => {
    setAmount1(ev.target.value)
    validateValue(ev.target.value, false, userPairInfo?.token1Decimals)
  }

  const handleChangeLiquidity = (ev) => {
    setLiquidity(ev.target.value)
    validateValueLiquidity(ev.target.value, userPairInfo?.pairDecimals)
  }

  const resetValue = () => {
    setAmount0(0)
    setAmount1(0)
    setLiquidity(0)
    setEAmount0(0)
    setEAmount1(0)
    setELiquidity(0)
  }

  const toggleAdd = () => {
    setAdd((add) => !add)
    resetValue()
  }

  const toggleLiquidity = () => {
    setWithLiquidity((withLiquidity) => !withLiquidity)
    resetValue()
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
          marginBottom: '5rem',
        }}
      >
        <Box className={classes.paper}>
          <PaperContainer>
            <Tabs
              value={add ? 0 : 1}
              onChange={toggleAdd}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Add" />
              <Tab label="Remove" />
            </Tabs>
            {!withLiquidity && (
              <Fragment>
                <Box
                  sx={{
                    marginTop: '2rem',
                  }}
                >
                  <TokenSwitch
                    right={false}
                    token={{
                      image: userPairInfo?.token0Img,
                      symbol: userPairInfo?.token0Symbol,
                    }}
                  />
                  <TextField
                    id="quote"
                    size="medium"
                    variant="outlined"
                    placeholder="Input your amount"
                    fullWidth
                    value={amount0}
                    onChange={handleChangeAmount0}
                    InputProps={{
                      endAdornment: (
                        <p style={{ width: '150px' }}>
                          Your Balance:{' '}
                          <b>
                            {toDecimal(
                              userPairInfo?.token0Balance,
                              userPairInfo?.token0Decimals,
                            )}
                          </b>
                        </p>
                      ),
                    }}
                  />
                </Box>
                <Box>
                  <TokenSwitch
                    right={false}
                    token={{
                      image: userPairInfo?.token1Img,
                      symbol: userPairInfo?.token1Symbol,
                    }}
                  />
                  <TextField
                    id="quote"
                    size="medium"
                    variant="outlined"
                    placeholder="Input your amount"
                    fullWidth
                    value={amount1}
                    onChange={handleChangeAmount1}
                    InputProps={{
                      endAdornment: (
                        <p style={{ width: '150px' }}>
                          Your Balance:{' '}
                          <b>
                            {toDecimal(
                              userPairInfo?.token1Balance,
                              userPairInfo?.token1Decimals,
                            )}
                          </b>
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
              </Fragment>
            )}
            {withLiquidity && (
              <Fragment>
                <Box sx={{ marginTop: '1rem' }}>
                  <p style={{ margin: '1rem' }}>Liquidity</p>
                  <TextField
                    id="quote"
                    size="medium"
                    variant="outlined"
                    placeholder="Input your amount"
                    fullWidth
                    value={liquidity}
                    onChange={handleChangeLiquidity}
                    InputProps={{
                      endAdornment: (
                        <p style={{ width: '150px' }}>
                          Your Balance:{' '}
                          <b>
                            {toDecimal(
                              userPairInfo?.liquidity,
                              userPairInfo?.pairDecimals,
                            )}
                          </b>
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
                  {helperTextLiquidity}
                </p>
              </Fragment>
            )}
            <p
              style={{
                marginTop: '10px',
              }}
            >
              {add ? 'You must deposit:' : 'You will receive:'}
            </p>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <TokenSwitch
                right={false}
                token={{
                  image: userPairInfo?.token0Img,
                  symbol: userPairInfo?.token0Symbol,
                }}
              />
              <p>
                <b>
                  {new BigNumber(eAmount0)
                    .dividedBy(10 ** userPairInfo?.token0Decimals)
                    .toFixed(2)}
                </b>
              </p>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <TokenSwitch
                right={false}
                token={{
                  image: userPairInfo?.token1Img,
                  symbol: userPairInfo?.token1Symbol,
                }}
              />
              <p>
                <b>
                  {new BigNumber(eAmount1)
                    .dividedBy(10 ** userPairInfo?.token1Decimals)
                    .toFixed(2)}
                </b>
              </p>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: '15px',
              }}
            >
              <p>{add ? 'Liquidity minted:' : 'Liquidity burned: '}</p>
              <p>
                <b>
                  {new BigNumber(eLiquidity)
                    .dividedBy(10 ** userPairInfo?.pairDecimals)
                    .toFixed(2)}
                </b>
              </p>
            </Box>
            <p style={{ marginTop: '20px' }}>Add/Remove with:</p>
            <Tabs
              value={withLiquidity ? 1 : 0}
              onChange={toggleLiquidity}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Token Amount" />
              <Tab label="Liquidity" />
            </Tabs>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: '2rem',
              }}
            >
              <p>Rate</p>
              {rate > 0 ? (
                <p>
                  <b>
                    1 {userPairInfo?.token0Symbol} ={' '}
                    {new BigNumber(rate).toFixed(8)}{' '}
                    {userPairInfo?.token1Symbol}
                  </b>
                </p>
              ) : (
                <b>Any rate</b>
              )}
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <p>Share of pool</p>
              <p>
                <b>{new BigNumber(shareOfPool).toFixed(8)}%</b>
              </p>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <Button
                className={classes.button}
                onClick={
                  add
                    ? () => setOpenAddDialog(true)
                    : () => setOpenRemoveDialog(true)
                }
                disabled={
                  (helperText !== undefined && !withLiquidity) ||
                  (helperTextLiquidity !== undefined && withLiquidity) ||
                  !new BigNumber(eAmount0).isGreaterThan(0) ||
                  !new BigNumber(eAmount1).isGreaterThan(0) ||
                  !new BigNumber(eLiquidity).isGreaterThan(0)
                }
              >
                {add ? 'Add Liquidity' : 'Remove Liquidity'}
              </Button>
              {openAddDialog && (
                <AddLiquidityDialog
                  handleDialogClose={() => setOpenAddDialog(false)}
                  amount0={eAmount0}
                  amount1={eAmount1}
                  liquidity={eLiquidity}
                  withLiquidity={withLiquidity}
                />
              )}
              {openRemoveDialog  && (
                <RemoveLiquidityDialog
                  handleDialogClose={() => setOpenRemoveDialog(false)}
                  amount0={eAmount0}
                  amount1={eAmount1}
                  liquidity={eLiquidity}
                  withLiquidity={withLiquidity}
                />
              )}
            </Box>
          </PaperContainer>
        </Box>
      </Box>
    </Fragment>
  )
}
