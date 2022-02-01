'use strict'

const server = require('./src/server.js');
const mongoose = require('mongoose'); 

require('dotenv').config();
const PORT = process.env.PORT || 3003;

const options = {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
};

mongoose.connect(process.env.MONGODB_URI, options);

// Start the web server
server.start(PORT)