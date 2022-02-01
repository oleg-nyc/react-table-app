import React, { useContext } from 'react';
import { TableContext } from '../context/TableContext';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

export default function RowsPerPage() {
    const [tableActions, setTableActions] = useContext(TableContext);
    const handleChangeRows = ({target}) => setTableActions( (tableProps) => {return {...tableProps, rowPerPage: target.value, curPage: 1}});
    return (
        <FormControl variant="standard" sx={{ m: 1, minWidth: 50, textAlign: 'center' }}>
        <InputLabel id="row-label">Rows per pag</InputLabel>
        <Select
            name="rows"
            labelId="row-label"
            label="Rows per page"
            value={tableActions.rowPerPage}
            required
            onChange={handleChangeRows}
        >
            <MenuItem value={5}>5 rows</MenuItem>
            <MenuItem value={10}>10 rows</MenuItem>
            <MenuItem value={20}>20 rows</MenuItem>
            <MenuItem value={50}>50 rows</MenuItem>
        </Select>
        </FormControl>
    )
}