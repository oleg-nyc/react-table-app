import React, { useState, useContext, useEffect } from 'react';
import { ListItemText, Select, MenuItem, Box, Chip, useTheme, Input } from '@mui/material/';
import { IMaskInput } from 'react-imask';
import { TableContext } from '../context/TableContext';
import PropTypes from 'prop-types';
import useAxios from '../hooks/axios.js';
import useValidator from '../hooks/validators.js';
import uuid from 'react-uuid';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        },
    },
};

function getStyles(name, value, theme) {
    return {
        fontWeight: 
        value.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
    };
}

const PhoneMask = React.forwardRef(function Mask(props, ref) {
    const { onChange, ...other } = props;
    const [email] = useValidator();
    return (
      <IMaskInput
        {...other}
        mask="(#00) 000-0000"
        definitions={{
          '#': /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
  });
  
  PhoneMask.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

const text = ({value}) => ( <ListItemText sx={{textAlign: 'center'}}  primary={value} /> );

const input = ({ name, value, handler, handlerBlur, required, mask, invalid}) => ( <Input
                                            sx={{textAlign: 'center'}} 
                                            variant="standard" 
                                            name={name} 
                                            required={required}
                                            value={value}
                                            error={invalid || false}
                                            onChange={handler}
                                            onBlur={handlerBlur}
                                            inputComponent={mask}
                                            helpertext="Incorrect entry."
                                        /> );
const select = ({ name, value, handler, handlerBlur, enumm, required, invalid }) => (
                                            <Select
                                                name={name}
                                                error={invalid || false}
                                                sx={{ minWidth: 120 }}
                                                variant="standard"
                                                value={value || ""}
                                                required={required}
                                                onBlur={handlerBlur}
                                                onChange={handler}
                                            >
                                                <MenuItem disabled value="">
                                                    <em>{name}</em>
                                                </MenuItem>
                                                {enumm.map((name) => (
                                                    <MenuItem key={name} value={name}>{name}</MenuItem>
                                                ))}
                                            </Select>
                                        );
const multiSelect = ({ name, value, handler, handlerBlur, enumm, required, theme, invalid }) => {
    const selected = typeof value === 'string' ? (value ? value.split(", ") : []) : value;
    enumm = [...new Set(enumm.concat(selected))];
    return (
        <Select
            multiple
            sx={{ minWidth: 200 }}
            variant="filled"
            name={name}
            error={invalid || false}
            value={selected}
            required={required}
            onBlur={handlerBlur}
            onChange={handler}
            renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.length === 0 ? <em>{name}</em> : selected.map((val) => (
                                                                                            <Chip key={val} label={val} />
                                                                                        ))}
                </Box>
            )}
            MenuProps={MenuProps}
        >
            <MenuItem disabled value="">
                <em>{name}</em>
            </MenuItem>
            {enumm.length && enumm.map((name) => (
                <MenuItem
                    key={uuid()}
                    value={name}
                    style={getStyles(name, selected, theme)}
                >
                {name}
                </MenuItem>
            ))}
        </Select>
    )
};

export default function Cell({rowId, val, name, opt, type}) {
    const [value, setValue] = useState(val);
    const [tableData, setTableData] = useContext(TableContext);
    const [invalid, setInvalid] = useState(!!tableData._invalid && !!tableData._invalid[rowId] && !!tableData._invalid[rowId][name]);
    const [getItems] = useAxios([], opt.db && (opt.db.table || ""));
    const theme = useTheme();
    const [email] = useValidator();
    const validators = {};
    validators.email = email;

    const handler = ({target}) => {
        let required = !!opt.required && !target.value.length;
        if (opt.validator) {
            let validFun = validators[opt.validator];
            if (typeof validFun === 'function') {
                setInvalid(required || !validFun(target.value));
            } 
        } else {
            setInvalid(required);
        }
        setValue(target.value);
    }

    const handlerBlur = (event) => {
            let val = typeof event.target.value === "string" ? event.target.value : event.target.value.join(", ");
            let  rows = tableData.rows.map(item => item._id === rowId ? { ...item, _edit: {...item._edit,[name]: val }} : item);

            if (typeof tableData._invalid === 'undefined') {
                tableData._invalid = {};
            }

            if (typeof tableData._invalid[rowId] === 'undefined') {
                tableData._invalid[rowId] = {};
            }

            tableData.rows = rows;
            tableData._invalid[rowId][name] = !!invalid;
            setTableData(tableData);
    }

    let enumm = [];
    if (type !== "text") {
        if (typeof opt.enum === "string") {
            switch (opt.enum) {
                case "fromDB":
                    if (!tableData._enum || !tableData._enum[opt.db.table]) {
                        getItems( (items) => setTableData( (data) => {enumm = items.map(obj => obj[opt.db.key]); return {...data, _enum: {[opt.db.table]: enumm}}}))  
                    } else {
                        enumm = tableData._enum[opt.db.table] 
                    }
                    break;
                default: break;
            }
        } else {
            enumm = opt.enum || [];
        }
    }

    const mask = !!opt.mask ? eval(opt.mask) : '';
    const required = opt.required;
    const Options = { text, input, select, multiSelect };
    const Component = Options[type];

    return  (
                <Component {...{ name, value, handler, handlerBlur, enumm, required, theme, mask, invalid }} />
            )
}

