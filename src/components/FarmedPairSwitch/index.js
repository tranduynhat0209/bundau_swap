import { Box, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import TokenSwitch from "./TokenSwitch";
import Chop from "src/assets/images/logo/chop.png"
import FarmedTokenListDialog from "../FarmedTokenListDialog"
import { useFarmingContext } from "src/context/farm-context";
const useStyles = makeStyles((theme) =>({
    root:{
        width: "50%",
        
        [theme.breakpoints.down("md")]:{
            width: "80%"
        },
        [theme.breakpoints.down("sm")]:{
            width: "99%"
        }
    },
    box:{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        cursor: "pointer",
        
    },
    chop:{
        width: "50px"
    },
    
}))
export default function FarmedPairSwitch(){
    const classes = useStyles()
    const [open, setOpen] = useState(false);
    const {allPairs, loading, currentPairInfo} = useFarmingContext()
    return(
        loading === false && allPairs.length > 0 &&
        <Box className={classes.root}>
            <Box className={classes.box} onClick={() => setOpen(true)}>
            <TokenSwitch right={false} token={{
                image: currentPairInfo?.token0Img,
                symbol: currentPairInfo?.token0Symbol
            }}/> 
            <img src={Chop} className={classes.chop}/>
            <TokenSwitch right={true} token={{
                image: currentPairInfo?.token1Img,
                symbol: currentPairInfo?.token1Symbol
            }}/>
            </Box>
            <FarmedTokenListDialog openDialog={open} handleDialogClose={() => setOpen(false)} tokenList={allPairs}/>
        </Box>
    )
}