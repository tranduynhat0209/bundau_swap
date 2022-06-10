import React from "react";
import MuiDialogTitle from "@material-ui/core/DialogTitle"
import {Typography, makeStyles} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
const useStyles = makeStyles((theme) =>({
    root:{
        padding: theme.spacing(2)
    },
    closeButton:{
        position: "absolute",
        right: theme.spacing(2),
        top: theme.spacing(2),
        color: theme.palette.grey[500],
        cursor: "pointer",
        transition: "transform 0.3s ease",
        "&:hover": {
            transform: "scale(1.2)",
        },
    }
}));

export default function DialogTitle({
    children, onClose, disableTypography ,...other
}){
    const classes = useStyles();
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            {
                !disableTypography &&(
                    <Typography align="center" variant="h6">
                        {children}
                    </Typography>
                )
            }
            {disableTypography && children}
            {onClose && <CloseIcon className={classes.closeButton} onClick={onClose}/>}
        </MuiDialogTitle>
    )
}

