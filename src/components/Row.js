import React, {useContext} from 'react';
import { TableContext } from '../context/TableContext';
import uuid from 'react-uuid'
import { ListItemButton, ListItem } from '@mui/material/';
import Cell from './Cell.js';
import RowAction from './RowAction.js';
import models from '../models/models.js';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: name ? name.charAt(0)+name.charAt(1) : "",
  };
}

export default function Row({ row, fullName }) {

    const [tableData] = useContext(TableContext);
    const cells = models(tableData.dbTable);
    const row_names = Object.keys(cells);

    return (
            <ListItem disablePadding >
                    <ListItemButton                 
                        sx={{
                            display: 'grid',
                            gap: 1,
                            gridTemplateColumns: `repeat(${row_names.length + 2}, 1fr)`,
                        }}>
                        <Stack direction="row" spacing={2} sx={{justifyContent: 'center'}} >
                            <Avatar {...stringAvatar(fullName || "")} />
                        </Stack>
                        {row_names.map(name => {
                                let cell_type = row._mode === "edit" ? cells[name].type : "text";
                                return (
                                        <Cell 
                                            key={uuid()} 
                                            name={name} 
                                            val={row._mode === "edit" ? (typeof row._edit[name] !== 'undefined' ? row._edit[name] : (row[name] || "")) : (row[name] || "N/A")} 
                                            type={cell_type} 
                                            opt={cells[name]}
                                            rowId={row._id}
                                        />
                                        )
                        })}  
                        <RowAction rowId={row._id} />              
                    </ListItemButton>
            </ListItem>
    )
}