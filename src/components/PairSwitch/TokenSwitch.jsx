import React, { Fragment} from "react"
import {Box, makeStyles} from "@material-ui/core"

const useStyles = makeStyles((theme) =>({
    root:{
        display: "flex",
        alignItems: "center",
        backgroundColor: theme.palette.background.primary,
        borderRadius: "2rem",
        padding: "0.2rem"
    },
    logo:{
        width: "40px",
        margin: "0 0.5rem"
    },
    symbol:{
        margin: "0 0.5rem"
    }
}))
export default function TokenSwitch({right, token}){
    const classes = useStyles();
    return (
        <Box className={classes.root}>
            {
            right?(
                <Fragment>
                    <p className={classes.symbol}>{token.symbol}</p>
                    <img src={token.image} className={classes.logo}/>
                </Fragment>
            ):(
                <Fragment>
                    <img src={token.image} className={classes.logo}/>
                    <p className={classes.symbol}>{token.symbol}</p>
                </Fragment>
            )   
            
            }
            
        </Box>
    )
}