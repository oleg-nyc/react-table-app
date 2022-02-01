'use strict'

const logg = (req, res, next) => {
    console.log('REQ:', req.method, req.path);
    next()
};

module.exports = logg;