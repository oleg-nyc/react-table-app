'use strict'

const mongoose = require('mongoose');

const practicesSchema = mongoose.Schema({
  name: { type: String, required:true },
  address: { type: String },
  email: { type: String, required:true },
  phone: { type: String },
  type: { type: String }
});

const practicesModel = mongoose.model('practices', practicesSchema);

module.exports = practicesModel;