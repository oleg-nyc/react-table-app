import React, { useState, useEffect, useContext } from 'react';
import { Box, List, ListItemButton, ListItemText } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import AddIcon from '@mui/icons-material/Add';
import ListSubheader from '@mui/material/ListSubheader';
import useAxios from '../hooks/axios.js';
import uuid from 'react-uuid';
import Fab from '@mui/material/Fab';
import Row from './Row.js';
import { TableContext } from '../context/TableContext';
import RowsPerPage from './RowsPerPage.js';
import TablePagin from './TablePagin.js';
import models from '../models/models.js';
import Search from './Search.js';

const fabStyle = {
    position: "sticky",
    float: "right",
    bottom: 16,
    right: 16,
  };

export default function Table() {

  const [tableData, setTableData] = useContext(TableContext);
  const model = models(tableData.dbTable);
  const row_head = Object.keys(model);
  const [getItems] = useAxios(tableData.rows, tableData.dbTable)
  tableData._required = row_head.filter( name => model[name].required );

  const addNewRow = () => {
    const index = (tableData.curPage - 1) * tableData.rowPerPage;
    const newRow = row_head.reduce((acc, cur) => ({ ...acc, [cur]: "" }), {})
    newRow._mode = "edit";
    newRow._type = "new";
    newRow._id = uuid();
    newRow._edit = {};
    const rows = [...tableData.rows];
    rows.splice(index, 0, newRow);
    setTableData({...tableData, rows: rows});
  };

  const handleSorting = ({target}) => {
    let  {name: column} = target.dataset;
    let d = !!tableData._sorting && tableData._sorting.column === column ? -1 * tableData._sorting.direction : 1;
    setTableData( {...tableData, rows: [...tableData.rows.sort((a,b) => {
        var columnA = !!a[column] ? a[column].toUpperCase() : ""; 
        var columnB = !!b[column] ? b[column].toUpperCase() : "";
            if(columnA < columnB){
                return -1 * d;
            } else if(columnA > columnB){
                return d;
            } else {
                return 0;
            }
        })], _sorting: { column: column, direction: d }} 
    );
  };


  useEffect(() => {
    getItems((items) => setTableData( (tableProps) => {return {...tableProps, rows: items, _rows: false, _enum: {}, _sorting: {}}}))
  }, []);

  // Debug
//   useEffect(() => {
//       if (tableData){
//             console.log(tableData)
//       }
//   }, [tableData]);


  return (
    <div style={{ width: '100%' }}>
        <div style={{ width: '100%' }}>
        <Box
            sx={{
                
                width: '100%',
                '& .actions': {
                color: 'text.secondary',
                },
                '& .textPrimary': { 
                color: 'text.primary',
                },
                border: 0
            }}
            >
            <List dense 
                sx={{ 
                        width: 1, 
                        bgcolor: 'background.paper', 
                        justifyContent: 'center',
                    }}
                >   
                <Box
                    sx={{ 
                        display: 'flex',
                        justifyContent: 'end',
                    }}
                >
                    <Search />
                </Box>
                <ListSubheader
                    sx={{
                        display: 'grid',
                        gap: 1,
                        gridTemplateColumns: `repeat(${row_head.length + 2}, 1fr)`,
                    }}
                >
                    <RowsPerPage />
                    {row_head.map( name => {
                        return (<ListItemButton key={uuid()} style={{backgroundColor: 'transparent', margin: 'auto'}} data-name={name} onClick={handleSorting} >
                                    <h3 style={{textTransform: 'capitalize'}} data-name={name}>{name}</h3>
                                    {!!tableData._sorting && !!tableData._sorting.column && tableData._sorting.column === name 
                                        ? 
                                        (tableData._sorting.direction === -1 ? <ArrowDropDownIcon data-name={name} /> : <ArrowDropUpIcon data-name={name} />) 
                                        : ''}
                                </ListItemButton>)
                   })}  
                   <div style={{margin: 'auto'}}>
                        <Fab  sx={fabStyle} aria-label='Add' color='primary' onClick={addNewRow}>
                            <AddIcon />
                        </Fab>
                    </div>
                    
                </ListSubheader>
                {
                    tableData.rows.length 
                        ?
                    tableData.rows.slice((tableData.curPage - 1)*tableData.rowPerPage, tableData.curPage*tableData.rowPerPage).map((row) => {
                        return ( 
                                <Row key={uuid()} row={row} fullName={row.name}/>
                            )
                        })
                    : <ListItemText sx={{textAlign: 'center'}}  primary="No data in table" />
                }
            </List>
            {tableData.rows.length ? <TablePagin /> : ""}    
        </Box>
        </div>
    </div>
  );
} 


