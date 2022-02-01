import React, { useContext } from 'react';
import { TextField } from '@mui/material/';
import { TableContext } from '../context/TableContext';


export default function Search() {
    const [tableData, setTableData] = useContext(TableContext);
    const handleSearch = ({target}) => {
        setTableData( (data) => { 
            if (!data._rows) {
                data._rows = data.rows;
            }
            data.rows = data._rows.filter(row => Object.values(row).join("|").toLowerCase().includes(target.value.toLowerCase()));
            if ( data.rows.length !==  data._rows.length ) {
                data.curPage = 1;
            }
            if (!target.value) {
                data._rows = false;
            }
            return { ...data }; 
        });
    }
    return (
        <TextField 
             sx={{ minWidth: 350 }}
            label="Search" 
            type="search"
            onChange={handleSearch} 
        />
    )
}