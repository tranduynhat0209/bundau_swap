import {
  Box,
  Dialog,
  DialogContent,
  makeStyles,
  Typography,
} from '@material-ui/core'
import React from 'react'
import DialogTitle from '../CustomizedDialog/DialogTitle'
import { usePairDataSelector } from 'src/context/pair-context'
import CustomizedTablePagination from '../CustomPagination'
const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    backgroundColor: theme.palette.background.secondary,
    color: '#fff',
  },
  dialogContent: {
    backgroundColor:
      theme.mode === 'dark' ? theme.palette.background.primary : '#fff',
  },
  listItem: {
    borderBottom: '1px solid green',
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 2, 1, 2),
  },
  tokenImg: {
    width: '50px',
  },
}))
export default function TokenListDialog({
  openDialog,
  handleDialogClose,
  tokenList,
}) {
  const switchPair = usePairDataSelector((state) => state.switchPair)
  const classes = useStyles()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  let rowsPerPageOptions = [];
  for(let i = 5; i <= 20; i = i + 5){
    rowsPerPageOptions.push(i);
    if(i > tokenList.length) break;
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event) =>{
    setRowsPerPage(+event.target.value);
    setPage(0);
  }
  return (
    <Dialog
      maxWidth="md"
      scroll="body"
      fullWidth
      open={openDialog}
      onClose={handleDialogClose}
    >
      <DialogTitle
        className={classes.dialogTitle}
        onClose={handleDialogClose}
      >
        Choose Pair
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {tokenList?.slice(page * rowsPerPage, (page + 1) * rowsPerPage)?.map((token, idx) => {
          return (
            <Box
              key={idx}
              className={classes.listItem}
              onClick={() => {
                switchPair(idx + page * rowsPerPage)
                handleDialogClose()
              }}
            >
              <Box>
                <img src={token.token0Img} className={classes.tokenImg} />
                <img src={token.token1Img} className={classes.tokenImg} />
              </Box>
              <Typography variant="h6">
                {token.token0Symbol}/{token.token1Symbol}
              </Typography>
            </Box>
          )
        })}
        <CustomizedTablePagination 
        rowsPerPageOptions= {rowsPerPageOptions}
        labelRowsPerPage="Pairs per page" page = {page}
        rowsPerPage = {rowsPerPage}
        handleChangePage = {handleChangePage} 
        handleChangeRowsPerPage = {handleChangeRowsPerPage}
        count={tokenList.length}
        />
      </DialogContent>
    </Dialog>
  )
}
