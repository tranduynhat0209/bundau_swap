import React from 'react'
import { Box, Grid, makeStyles } from '@material-ui/core'
import SingleInfo from './SingleInfo'
import PaperContainer from 'src/components/PaperContainer'
import ImageLogo from 'src/assets/images/logo/pho.png'
import { usePairDataSelector } from 'src/context/pair-context'
import BigNumber from 'bignumber.js'
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3),
    },
  },
}))

export default function Overview() {
  const classes = useStyles()
  const pairReserveInfo = usePairDataSelector(
    (state) => state?.currentPairReserveInfo,
  )
  const currentPair = usePairDataSelector((state) => state?.currentPair)
  const allPairs = usePairDataSelector((state) => state?.allPairs)
  const loading = usePairDataSelector((state) => state?.loading)
  return (
    <PaperContainer className={classes.root}>
      <img
        src={ImageLogo}
        style={{
          width: '100px',
          position: 'absolute',

          top: '-3rem',
          right: '-1rem',
        }}
      />
      {loading === false && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <SingleInfo
              title="Liquidity Supply"
              info={new BigNumber(pairReserveInfo?.totalLiquidity)
                .dividedBy(10 ** allPairs[currentPair].pairDecimals)
                .toFixed(2)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SingleInfo
              title={allPairs[currentPair].token0Symbol + ' Reserve'}
              info={new BigNumber(pairReserveInfo?.token0Reserve)
                .dividedBy(10 ** allPairs[currentPair].token0Decimals)
                .toFixed(2)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SingleInfo
              title={allPairs[currentPair].token1Symbol + ' Reserve'}
              info={new BigNumber(pairReserveInfo?.token1Reserve)
                .dividedBy(10 ** allPairs[currentPair].token1Decimals)
                .toFixed(2)}
            />
          </Grid>
        </Grid>
      )}
    </PaperContainer>
  )
}
