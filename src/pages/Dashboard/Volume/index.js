import { Box, makeStyles, Typography } from "@material-ui/core";
import React, { useMemo } from "react";
import PaperContainer from "src/components/PaperContainer";
import ImageLogo from "src/assets/images/logo/nem.png";
import useHighchartsDefaultConfig from "src/hooks/use-highchart-defalt-config";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useAppContext } from "src/context/app-context";
import SwitchBaseQuote from "src/components/SwitchBaseQuote";
const useStyles = makeStyles((theme) =>({
    head:{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "2rem"
    },
    title:{
        fontWeight: 700
    }
}))
export default function Volume(){
    const classes = useStyles();
    const {themeMode} = useAppContext();
    const defaultConfig = useHighchartsDefaultConfig();
    let curTime = Date.now();
    let curValue = 0;
    let values = []
    let timestamps = []
    for (let i = 0;i < 50; i++){
        timestamps.push(curTime)
        values.push(curValue)
        curTime += Math.random() * 1000 * 3600 + 100000
        curValue = (2 * Math.random() - 1) * 5; 
    }
    const options = useMemo(() => {
        const time = new Highcharts.Time(timestamps);
        return Highcharts.merge(defaultConfig, {
          exporting: {
            enabled: true,
          },
          chart: {
            type: "column",
            crosshairs: false
          },
          title: {
            text: undefined,
          },
          tooltip: {
            xDateFormat: "%Y-%m-%d %I:%M:%S %p",
            crosshairs: true,
            valuePrefix: "$",
            valueSuffix: "",
            valueDecimals: 2,
            shared: true
          },
          xAxis: {
            gridLineWidth: 0,
            type: "datetime",
            labels: {
              formatter: function () {
                return time.dateFormat("%d %b %y", this.value);
              },
              style: {
                color: themeMode === "dark" ? "rgba(255, 255, 255, 0.65)" : "rgba(4, 57, 71, 0.65)",
              },
            },
            categories: timestamps,
            tickInterval: 10
          },
          yAxis: {
            gridLineWidth: 0,
            title: {
              enabled: false,
            },
            labels: {
              style: {
                color: themeMode === "dark" ? "rgba(255, 255, 255, 0.65)" : "rgba(4, 57, 71, 0.65)",
              },
            },
          },
          plotOptions: {
            column:{
                borderWidth: 0,
                color: "green",
                negativeColor: "red",
              states: {
                hover: {
                },
              },
              marker: {
                enabled: false,
              },
            }
          },
          series: [
            {
              name: "Daily Trading Volume",
              data: values,
            },
          ],
          legend: {
            enabled: false,
          },
        });
      }, [values, defaultConfig]);
    return(
    <PaperContainer>
        <Box className={classes.head}>
        <Typography className={classes.title} variant="h4">
                Trading Volume
            </Typography>
            <SwitchBaseQuote/>
            <img src={ImageLogo} style={{
                width: "100px",
                marginTop: "-50px",
                marginRight: "-50px",
            }}/>
            
        </Box>
            <Box>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </Box>
        
    </PaperContainer>
    )
}