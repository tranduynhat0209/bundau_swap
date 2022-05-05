import { Box, Tab, Tabs } from "@material-ui/core";
import React, { useState } from "react";

export default function SwitchBaseQuote() {
  const [tk1, setTk1] = useState(true);
  const toggleTk = () =>{
      setTk1(tk1 => !tk1);
  }
  return (
    <Box>
      <Tabs
        value={tk1 ? 0: 1}
        onChange={toggleTk}
        indicatorColor="primary"
        textColor="primary"
        centered
        >
        <Tab label="BUN" />
        <Tab label="DAU" />
        </Tabs>
    </Box>
  );
}
