import { Box, makeStyles, Tab, Tabs, Typography } from '@material-ui/core'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PaperContainer from 'src/components/PaperContainer'
import ImageLogo from 'src/assets/images/logo/bundau.png'
import useHighchartsDefaultConfig from 'src/hooks/use-highchart-defalt-config'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { useAppContext } from 'src/context/app-context'
import { useHistoryContext } from 'src/context/history-context'
import BigNumber from 'bignumber.js'
import { usePairContext } from 'src/context/pair-context'
import useNotifier from 'src/hooks/use-notifier'
const useStyles = makeStyles((theme) => ({
  head: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  title: {
    fontWeight: 700,
  },
}))
export default function Price() {
  const classes = useStyles()
  const { notifyError } = useNotifier()
  const { themeMode } = useAppContext()
  const defaultConfig = useHighchartsDefaultConfig()
  const { currentPairInfo } = usePairContext()
  const [timestamps, setTimestamps] = useState([])
  const [price0Series, setPrice0Series] = useState([])
  const [price1Series, setPrice1Series] = useState([])
  const [rev, setRev] = useState(false)
  const toggleRev = () => {
    setRev((pre) => !pre)
  }
  const { queryReserveInfo } = useHistoryContext()
  const fetchPrices = useCallback(async () => {
    const result = await queryReserveInfo(currentPairInfo?.pairAddress)
    if (typeof result === 'string') {
      notifyError(result)
      return
    }
    let price0Series = []
    let price1Series = []
    let timestamps = []
    result.forEach((info) => {
      timestamps.push(info.timestamp * 1000)
      const reserve0 = new BigNumber(info.reserve0).dividedBy(
        currentPairInfo?.token0Decimals,
      )
      const reserve1 = new BigNumber(info.reserve1).dividedBy(
        currentPairInfo?.token1Decimals,
      )
      price0Series.push([
        info.timestamp * 1000,
        parseFloat(reserve1.dividedBy(reserve0).toFixed(2)),
      ])
      price1Series.push([
        info.timestamp * 1000,
        parseFloat(reserve0.dividedBy(reserve1).toFixed(2)),
      ])
    })
    setTimestamps(timestamps)
    setPrice0Series(price0Series)
    setPrice1Series(price1Series)
  }, [queryReserveInfo, setTimestamps, setPrice0Series, setPrice1Series, currentPairInfo])
  useEffect(() => {
    fetchPrices()
  }, [fetchPrices])
  const options = useMemo(() => {
    const time = new Highcharts.Time(timestamps)
    return Highcharts.merge(defaultConfig, {
      exporting: {
        enabled: true,
      },
      chart: {
        type: 'area',
      },
      title: {
        text: undefined,
      },
      tooltip: {
        xDateFormat: '%Y-%m-%d %I:%M:%S %p',
        crosshairs: false,
        valuePrefix: '',
        valueSuffix: rev ? currentPairInfo?.token0Symbol : currentPairInfo?.token1Symbol,
        valueDecimals: 2,
      },
      xAxis: {
        gridLineWidth: 0,
        type: 'datetime',
        labels: {
          formatter: function () {
            return time.dateFormat('%d %b %y', this.value)
          },
          style: {
            color:
              themeMode === 'dark'
                ? 'rgba(255, 255, 255, 0.65)'
                : 'rgba(4, 57, 71, 0.65)',
          },
        },
      },
      yAxis: {
        gridLineWidth: 0,
        title: {
          enabled: false,
        },
        labels: {
          style: {
            color:
              themeMode === 'dark'
                ? 'rgba(255, 255, 255, 0.65)'
                : 'rgba(4, 57, 71, 0.65)',
          },
        },
      },
      plotOptions: {
        area: {
          color: 'green',
          lineWidth: 3,
          states: {
            hover: {
              lineWidth: 4,
            },
          },
          marker: {
            enabled: false,
          },
        },
      },
      series: [
        {
          name: 'Rate',
          data: rev ? price1Series : price0Series,
        },
      ],
      legend: {
        enabled: false,
      },
    })
  }, [timestamps, price0Series, price1Series, defaultConfig, rev])
  return (
    <PaperContainer>
      <Box className={classes.head}>
        <img
          src={ImageLogo}
          style={{
            width: '100px',
            marginTop: '-50px',
            marginLeft: '-50px',
          }}
        />
        <Tabs
          value={rev ? 1 : 0}
          onChange={toggleRev}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label={currentPairInfo?.token0Symbol} />
          <Tab label={currentPairInfo?.token1Symbol} />
        </Tabs>
        <Typography className={classes.title} variant="h4">
          Exchange Rate
        </Typography>
      </Box>
      <Box>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Box>
    </PaperContainer>
  )
}
