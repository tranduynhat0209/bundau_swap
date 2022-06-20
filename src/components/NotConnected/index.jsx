import { Box } from "@material-ui/core";

export default function NotConnected(){
    return (
        <Box
        width = "100%"
        height="100%"
        display="flex"
        justifyContent="center"
        marginTop="10%"
        >
            <b style={{
                fontSize: "3rem"                
            }}>Please connect your wallet first</b>
        </Box>
    )
}