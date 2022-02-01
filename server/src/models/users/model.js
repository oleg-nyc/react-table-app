'use strict'

const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
  name: { type: String, required:true },
  gender: { type: String, enum: ['Male', 'Female'] },
  email: { type: String, required:true },
  phone: { type: String },
  specialties: { type: String },
  practice: { type: String }
});

const usersModel = mongoose.model('users', usersSchema);

module.exports = usersModel;