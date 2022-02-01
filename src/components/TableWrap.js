import React, { useState, useContext } from 'react';
import { TableContext } from '../context/TableContext';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import {Snackbar, Alert} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Table from './Table.js';

const pages = ['Doctors', 'Practices'];

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`action-tabpanel-${index}`}
        aria-labelledby={`action-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </Typography>
    );
  }
  
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  export default function TableWrap() {
    const theme = useTheme();
    const [tab, setTab] = useState(0);
    const [tableData, setTableData] = useContext(TableContext);
    const handleCloseSnackbar = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setTableData((tableProps) => {return {...tableProps, snackbar: null}});
    }
    const handleSwitchTable = (newTab) => (event) => {
      if (newTab !== tab) {
        setTab(newTab);
        switch (newTab) {
          case 0:
            setTableData({...tableData, dbTable: "users", rowPerPage: 5, rows: [], curPage: 1});
            break;
          case 1:
            setTableData({...tableData, dbTable: "practices", rowPerPage: 5, rows: [], curPage: 1});
            break;
          default: break;
        }
      }
    };
  return (
      <>
    <AppBar position="static" sx={{ borderRadius: "10px" }}>
      <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ mr: 2, display: 'flex' }}
            >
            Management APP
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end'}}>
                {pages.map((page, index) => (
                <Button
                    key={page}
                    selected
                    onClick={handleSwitchTable(index)}
                    sx={{ ...(index === tab && {borderBottom:  2}), my: 2, color: 'white', display: 'block', borderRadius: 0 }}
                >
                    {page}
                </Button>
                ))}
            </Box>
          </Toolbar>
      </Container>
    </AppBar>
    {!!tableData.snackbar && (
                <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={3000} anchorOrigin={{vertical:"top",horizontal:"right"}}>
                    <Alert {...tableData.snackbar} onClose={handleCloseSnackbar} />
                </Snackbar>
            )}
    <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={tab}
    >
        <TabPanel value={tab} index={0} dir={theme.direction}>
            <Table />
        </TabPanel>
        <TabPanel value={tab} index={1} dir={theme.direction}>
            <Table />
        </TabPanel>
    </SwipeableViews>
    </>
  );
};
