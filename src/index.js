import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.js';
import './styles/style.scss';

function Main() {
    return (
        <App />
    )
}

const root = document.getElementById("root");

ReactDOM.render(<Main />, root);

