import React from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) =>({
    root: {
        backgroundColor: theme.mode === "dark" ? theme.palette.background.primary : "#fff",
        position: "sticky",
        bottom: 0,
        overflow: "hidden"
    }
}))
export default function CustomizedTablePagination(props) {
  const {count, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, rowsPerPageOptions ,...other} = props;
  const classes = useStyles();
  

  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      classes={{
          root: classes.root
      }}
      {...props}
    />
  );
}
