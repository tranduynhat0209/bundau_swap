import { Box, makeStyles, Tab, Tabs, Typography } from '@material-ui/core'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PaperContainer from 'src/components/PaperContainer'
import ImageLogo from 'src/assets/images/logo/nem.png'
import useHighchartsDefaultConfig from 'src/hooks/use-highchart-defalt-config'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { useAppContext } from 'src/context/app-context'
import { usePairContext } from 'src/context/pair-context'
import { useHistoryContext } from 'src/context/history-context'
import useNotifier from 'src/hooks/use-notifier'
import BigNumber from 'bignumber.js'
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
export default function Volume() {
  const classes = useStyles()
  const { themeMode } = useAppContext()
  const defaultConfig = useHighchartsDefaultConfig()
  const [rev, setRev] = useState(false)
  const { currentPairInfo } = usePairContext()
  const { notifyError } = useNotifier()
  const toggleRev = () => {
    setRev((pre) => !pre)
  }

  const [timestamps, setTimestamps] = useState([])
  const [volume0, setVolume0] = useState([])
  const [volume1, setVolume1] = useState([])
  const { queryTradingInfo } = useHistoryContext()
  const fetchVolumes = useCallback(async () => {
    const result = await queryTradingInfo(currentPairInfo?.pairAddress)
    if (typeof result === 'string') {
      notifyError(result)
      return
    }
    if (!result.length > 0) {
      setVolume0([])
      setVolume1([])
      setTimestamps([])
      notifyError('No trade occured')
      return
    }
    let volume0 = []
    let volume1 = []
    let timestamps = []

    let delta = 3600
    let curTime = Math.floor(result[0].timestamp / delta) * delta
    let i = 0
    while (i < result.length) {
      timestamps.push(curTime * 1000)
      let curVol0 = new BigNumber(0)
      let curVol1 = new BigNumber(0)
      const nextTime = curTime + delta

      while (result[i].timestamp < nextTime) {
        curVol0 = curVol0.plus(result[i].amount0)
        curVol1 = curVol1.plus(result[i].amount1)
        i = i + 1
        if (i >= result.length) break
      }
      volume0.push(
        parseFloat(
          new BigNumber(curVol0)
            .dividedBy(10 ** currentPairInfo?.token0Decimals)
            .toFixed(2),
        ),
      )
      volume1.push(
        parseFloat(
          new BigNumber(curVol1)
            .dividedBy(10 ** currentPairInfo?.token1Decimals)
            .toFixed(2),
        ),
      )
      curTime = nextTime
    }
    console.log(volume0)
    console.log(volume1)
    setVolume0(volume0)
    setVolume1(volume1)
    setTimestamps(timestamps)
  }, [queryTradingInfo, setTimestamps, setVolume0, setVolume1, currentPairInfo])
  useEffect(() => {
    fetchVolumes()
  }, [fetchVolumes])
  const options = useMemo(() => {
    const time = new Highcharts.Time(timestamps)
    return Highcharts.merge(defaultConfig, {
      exporting: {
        enabled: true,
      },
      chart: {
        type: 'column',
      },
      title: {
        text: undefined,
      },
      tooltip: {
        xDateFormat: '%Y-%m-%d %I:%M:%S %p',
        crosshairs: false,
        valuePrefix: '',
        valueSuffix: rev ? currentPairInfo?.token1Symbol : currentPairInfo?.token0Symbol,
        valueDecimals: 2,
        shared: true,
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
        categories: timestamps,
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
        column: {
          borderWidth: 0,
          color: 'green',
          negativeColor: 'red',
          states: {
            hover: {},
          },
          marker: {
            enabled: false,
          },
        },
      },
      series: [
        {
          name: 'Hourly Trading Volume',
          data: rev ? volume1 : volume0,
        },
      ],
      legend: {
        enabled: false,
      },
    })
  }, [rev, volume0, volume1, defaultConfig])
  return (
    <PaperContainer>
      <Box className={classes.head}>
        <Typography className={classes.title} variant="h4">
          Trading Volume
        </Typography>
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
        <img
          src={ImageLogo}
          style={{
            width: '100px',
            marginTop: '-50px',
            marginRight: '-50px',
          }}
        />
      </Box>
      <Box>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Box>
    </PaperContainer>
  )
}
