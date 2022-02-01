import React, { useContext } from 'react';
import { TableContext } from '../context/TableContext';
import { Pagination } from '@mui/material';

export default function TablePagin() {
    const [tableData, setTableData] = useContext(TableContext);
    const handleChangePage = (event, value) => setTableData( (tableProps) => {return {...tableProps, curPage: value}});
    return (
        <Pagination 
            sx={{
                    display: 'flex', 
                    gap: 1,
                    justifyContent: 'center', 
                    m: 2
                }} 
            spacing={2} 
            margin="dense" 
            count={Math.floor(tableData.rows.length/tableData.rowPerPage) + (tableData.rows.length%tableData.rowPerPage ? 1 : 0)}
            variant="outlined" 
            color="primary" 
            onChange={handleChangePage}
            page={tableData.curPage}
        />
    )
}