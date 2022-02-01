import React, { useState, useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import uuid from 'react-uuid'
import { TableContext } from '../context/TableContext';
import useAxios from '../hooks/axios.js';

const options = [
  {action: 'Edit', icon: <EditIcon />, mode: "view"},
  {action: 'Save',icon: <SaveIcon />, mode: "edit"},
  {action: 'Cancel',icon: <CancelIcon />, mode: "edit"},
  {action: 'Delete',icon: <DeleteIcon />, mode: "view"}
];

const ITEM_HEIGHT = 48;

export default function RowAction({rowId}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [tableData, setTableData] = useContext(TableContext);
  const [getItems, addNewItem, updateItem, deleteItem, getItemById] = useAxios(tableData.rows, tableData.dbTable)
  const rowMode = tableData.rows.filter(i => i._id === rowId)[0]._mode;
  const open = Boolean(anchorEl);
  const handleClick = ({currentTarget}) => setAnchorEl(currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleAction = ({currentTarget}) => {
      let  {value: action} = currentTarget.dataset;
      let rows = {};
      switch (action.trim()) {
        case 'Edit':
            rows = tableData.rows.map(item => item._id === rowId ? { ...item, _mode: "edit", _edit: {} } : item)
            setTableData({...tableData, rows: rows})
            break;
        case 'Save':
            let row = tableData.rows.filter(item => item._id === rowId)[0];
            if (JSON.stringify(row._edit) === '{}') {
                rows = tableData.rows.map(item => item._id === rowId 
                    ? 
                    (item._type === "new" ? {} : { ...item, _mode: "view", _edit: {} }) 
                    : 
                    item)
                    .filter(value => JSON.stringify(value) !== '{}');
                setTableData({...tableData, rows: rows, snackbar: { children: 'No edits', severity: 'warning' }})
            } else { //Insert
                let req_err = false;
                if (row._type === "new") {
                    tableData._required.map( item => {
                        if (!row._edit[item] || !row._edit[item].trim().length) {
                            setTableData({...tableData, snackbar: { children: `Required feild "${item}" is empty`, severity: 'error' }})
                            req_err = true;
                        }
                    })
                    if (!req_err) {
                        _addItem(rowId, row._edit);
                    } 
                } else { //Update
                    Object.keys(row._edit).map( item => {
                        if (tableData._required.includes(item) && !row._edit[item].trim().length) {
                            row._edit[item] = null;
                            rows = tableData.rows.map(item => item._id === rowId 
                                ? 
                                { ...item, _edit: Object.fromEntries(Object.entries(item._edit).filter(([name, value]) => value !== null ))}
                                : 
                                item);
                            setTableData({...tableData, rows: rows, snackbar: { children: `Required feild "${item}" is empty`, severity: 'error' }})
                            req_err = true;
                        }
                    })
                    if (!req_err) {
                        _putItem(rowId)
                    } 
                }
            }
            break;
        case 'Cancel':
            rows = tableData.rows.map(item => item._id === rowId 
                                            ? 
                                            (item._type === "new" ? {} : { ...item, _mode: "view", _edit: {} }) 
                                            : 
                                            item)
                    .filter(value => JSON.stringify(value) !== '{}');
            setTableData({...tableData, rows: rows, snackbar: { children: 'Canceled', severity: 'success' }})
            break;
        case 'Delete':
            _deleteItem(rowId)
            break;
        default: break;
      }
      setAnchorEl(null);
  }

  const _addItem = async (id, item) => {
    addNewItem(id, item, (items, error) => {
        setTableData( {...tableData, rows: items} );
        if (error) {
            setTableData( (tableProps) => {return {...tableProps, snackbar: { children: 'Saved', severity: 'error' }}});
        } else {
            setTableData( (tableProps) => {return {...tableProps, snackbar: { children: 'Saved', severity: 'success' }}});
        }
    })
  }

  const _putItem = async (id) => {
    updateItem(id, (update, error) => {
        setTableData( (tableProps) => {return {...tableProps, rows: update}});
        if (error) {
            setTableData((tableProps) => {return {...tableProps, snackbar: { children: 'Updated', severity: 'error' }}});
        } else {
            setTableData((tableProps) => {return {...tableProps, snackbar: { children: 'Updated', severity: 'success' }}});
        }
    });
  };

  const _deleteItem = async (id) => {
    deleteItem(id, (del, error) => {
        setTableData( (tableProps) => {return {...tableProps, rows: del}});
        if (error) {
            setTableData((tableProps) => {return {...tableProps, snackbar: { children: 'Deleted', severity: 'error' }}});
        } else {
            setTableData((tableProps) => {return {...tableProps, snackbar: { children: 'Deleted', severity: 'success' }}});
        }
    });
  };

  return (
    <div style={{justifyContent: 'center', display: 'flex'}}>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem 
            key={uuid()} 
            selected={option === 'Pyxis'} 
            data-value={option.action} 
            onClick={rowMode === option.mode ? handleAction : ()=>{}} 
            disabled={rowMode !== option.mode || (option.action === 'Save' && !!tableData._invalid && !!tableData._invalid[rowId] && !!Object.values(tableData._invalid[rowId]).filter(v => v).length)}>
            {option.icon} {option.action} 
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}