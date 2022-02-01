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

const { exec } = require("child_process");

exec("node -v", (error, stdout, stderr) => {
    const mongoDB_URI = stdout < "v17" ? process.env.MONGODB_URI : 'mongodb://0.0.0.0:27017/practices';
    mongoose.connect(mongoDB_URI, options);
    server.start(PORT)
});


