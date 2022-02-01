'use strict'

const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', handleGetWeb);

function handleGetWeb(req, res) {
    res.sendFile(path.join(__dirname, "../..", "build", "index.html"));
  };

module.exports = router;
