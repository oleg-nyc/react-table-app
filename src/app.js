import React from 'react';
import TableWrap from './components/TableWrap';
import { TableProvider } from './context/TableContext';

function App () {
    return (
        <TableProvider>
            <TableWrap />
        </TableProvider>
    )
}

export default App;