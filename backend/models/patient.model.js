const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const patientSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  name: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = { Patient };
