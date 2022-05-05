import { Box, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import PaperContainer from "../PaperContainer";
import TokenSwitch from "./TokenSwitch";
import ImageToken from "src/assets/images/logo/bundau.png"
import Chop from "src/assets/images/logo/chop.png"
import TokenListDialog from "../TokenListDialog"
import { usePairDataSelector } from "src/context/pair-context";
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
export default function PairSwitch(){
    const classes = useStyles()
    const [open, setOpen] = useState(false);
    const [tokenList, loading, current] = usePairDataSelector(state => [state.allPairs, state.loading, state.currentPair])
    
    return(
        loading === false && tokenList.length > 0 &&
        <Box className={classes.root}>
            <Box className={classes.box} onClick={() => setOpen(true)}>
            <TokenSwitch right={false} token={{
                image: tokenList[current]?.token0Img,
                symbol: tokenList[current]?.token0Symbol
            }}/> 
            <img src={Chop} className={classes.chop}/>
            <TokenSwitch right={true} token={{
                image: tokenList[current]?.token1Img,
                symbol: tokenList[current]?.token1Symbol
            }}/>
            </Box>
            <TokenListDialog openDialog={open} handleDialogClose={() => setOpen(false)} tokenList={tokenList}/>
        </Box>
    )
}