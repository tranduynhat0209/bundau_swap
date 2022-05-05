import React, { Fragment } from "react";
import {Box, makeStyles} from "@material-ui/core";

import PairSwitch from "src/components/PairSwitch";
import DashboardLayout from "./DashboardLayout";

export default function Dashboard(){
    return(
        <Fragment>
        <Box sx={{
            display: "flex",
            justifyContent:"center",
            width: "100%",
            margin: "2rem 0"
        }}>
            <PairSwitch/>
        </Box>
            
        <DashboardLayout/>

        </Fragment>
    )
}