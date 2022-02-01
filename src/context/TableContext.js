import React, { useState, createContext } from 'react';

const TableContext = createContext();

const defaults_props = {
	rowPerPage: 5,
	rows: [],
	curPage: 1,
	dbTable: "users",
	_required: {}
}

const TableProvider = (props) => {
	
	const [tableActions, setTableActions] = useState(defaults_props);
	
	return(
		<TableContext.Provider value={[tableActions, setTableActions]}>
			{props.children}
		</TableContext.Provider>
	);
}

export { TableContext, TableProvider };