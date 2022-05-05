import { Box, makeStyles, Typography } from "@material-ui/core";
import React, { useMemo } from "react";
import PaperContainer from "src/components/PaperContainer";
import ImageLogo from "src/assets/images/logo/bundau.png";
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
export default function Price(){
    const classes = useStyles();
    const {themeMode} = useAppContext();
    const defaultConfig = useHighchartsDefaultConfig();
    let curTime = Date.now();
    let curValue = 1;
    let balanceSeries = []
    let timestamps = []
    for (let i = 0;i < 50; i++){
        timestamps.push(curTime)
        balanceSeries.push([curTime, curValue])
        curTime += Math.random() * 1000 * 3600 + 100000
        curValue +=  Math.random() 
    }
    const options = useMemo(() => {
        const time = new Highcharts.Time(timestamps);
        return Highcharts.merge(defaultConfig, {
          exporting: {
            enabled: true,
          },
          chart: {
            type: "area",
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
            area:{
                color: "green",
                lineWidth: 3,
              states: {
                hover: {
                  lineWidth: 4,
                },
              },
              marker: {
                enabled: false,
              },
            }
          },
          series: [
            {
              name: "Price",
              data: balanceSeries,
            },
          ],
          legend: {
            enabled: false,
          },
        });
      }, [balanceSeries, defaultConfig]);
    return(
    <PaperContainer>
        
        <Box className={classes.head}>
            
            <img src={ImageLogo} style={{
                width: "100px",
                marginTop: "-50px",
                marginLeft: "-50px"
            }}/>
            <SwitchBaseQuote/>
            <Typography className={classes.title} variant="h4">
                Price
            </Typography>
        </Box>
            <Box>
                <HighchartsReact highcharts={Highcharts} options={options} />
            </Box>
        
    </PaperContainer>
    )
}