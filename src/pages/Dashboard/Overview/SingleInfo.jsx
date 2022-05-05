import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
const useStyles = makeStyles((theme) =>({
    root:{
        
    },
    title:{
        textAlign: "center"
    },
    info: {
        textAlign: "center",
        fontWeight: 700
    }
}))
export default function SingleInfo({title, info}){
    const classes = useStyles()
    return(
        <Box className={classes.root}>
            <Typography className={classes.title} variant="h6">
                {title}
            </Typography>
            <Typography className={classes.info} variant="h4">
                {info}
            </Typography>
        </Box>
    )
}