import React from 'react'
import { Box, Grid, makeStyles } from '@material-ui/core'
import SingleInfo from './SingleInfo'
import PaperContainer from 'src/components/PaperContainer'
import ImageLogo from 'src/assets/images/logo/pho.png'
import { usePairContext} from 'src/context/pair-context'
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

  const {loading, currentPairInfo, currentPairReserveInfo} = usePairContext();
  console.log(currentPairReserveInfo)

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
              info={new BigNumber(currentPairReserveInfo?.totalLiquidity)
                .dividedBy(10 ** currentPairInfo?.pairDecimals)
                .toFixed(2)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SingleInfo
              title={currentPairInfo.token0Symbol + ' Reserve'}
              info={new BigNumber(currentPairReserveInfo?.token0Reserve)
                .dividedBy(10 ** currentPairInfo?.token0Decimals)
                .toFixed(2)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <SingleInfo
              title={currentPairInfo.token1Symbol + ' Reserve'}
              info={new BigNumber(currentPairReserveInfo?.token1Reserve)
                .dividedBy(10 ** currentPairInfo?.token1Decimals)
                .toFixed(2)}
            />
          </Grid>
        </Grid>
      )}
    </PaperContainer>
  )
}
