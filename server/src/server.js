'use strict'

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const error500 = require('./error-handlers/500.js');
const error404 = require('./error-handlers/404.js');

const apiRoutes = require('./routes/r1.js');
const webRoutes = require('./routes/web.js');

const app = express();


app.use(express.static(path.join(__dirname, "../..", "build")));
app.use(express.static("public"));

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Routes
app.use('/api/v1', apiRoutes);
app.use('/', webRoutes);

app.use(error500);
app.use(error404);



module.exports = {
    server: app,
    start: (port) => {
        app.listen(port, () => {
            console.log(`SERVER IS UP ON ${port}`)
        })
    }
}


