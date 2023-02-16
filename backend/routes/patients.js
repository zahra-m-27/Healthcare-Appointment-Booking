const router = require("express").Router();
const appointmentImport = require("../models/appointment.model");
const jwt = require("jsonwebtoken");
const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51MCK6eANMreWJyGpqu0IiKlE2y17ignEfjeAuQRzpMDufPuJUp6AuOKMf1e0WjisbGAiEt1vXuaef7WzyJZYmruy005H92k16a"
);
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("../bcrypt/bcrypt");
const { Appointment } = appointmentImport;
const patients = require("../models/patient.model");
require("dotenv").config();
const { Patient } = patients;
let pId = 1000;

// To get all the patients
router.route("/").get((req, res) => {
  Patient.find()
    .then((patients) => {
      res.status(200).json(patients);
    })
    .catch((err) => {
      res.status(400).json(`Error : ${err}`);
    });
});

// To add a patient
router.route("/signup").post((req, res) => {
  pId = pId + 1;
  const username = req.body.username; // Required. can't be undefined
  const password = req.body.password;
  const email = req.body.email;
  const name = req.body.name;
  const phoneNumber = req.body.phoneNumber;
  const patientUniqueId = pId.toString();

  const newPatient = new Patient({
    username,
    password,
    patientUniqueId,
    email,
    name,
    phoneNumber,
  });

  newPatient
    .save()
    .then(() => {
      console.log(`${newPatient} added!`);
      const token = jwt.sign(JSON.stringify(newPatient), process.env.KEY, {
        algorithm: process.env.ALGORITHM,
      });
      res.status(200).json({
        token: token.toString(),
        patientUniqueId: newPatient.patientUniqueId,
      });
    })
    .catch((err) => {
      res.status(400).json(`Error : ${err}`);
    });
});

// To update a patient's phone number
router.route("/update-phone").put((req, res) => {
  const patientId = req.body.patientUniqueId;

  Patient.findOne({ patientUniqueId: patientId }).then((patient) => {
    if (patient) {
      patient.phoneNumber = req.body.phoneNumber;

      patient
        .save()
        .then(() => {
          res.status(200).json("Patient's phone number updated");
        })
        .catch((err) => {
          res.status(400).json({ message: `Error : ${err}` });
        });
    }
  });
});

router.route("/login").post(async (req, res) => {
  try {
    const username = req.body.username;

    // Password entered by the user
    const plainTextPassword = req.body.password;

    // Password Salt for hashing purpose
    const passwordSalt = process.env.PASSWORD_SALT;

    // Encrypted password after hashing operation
    const encryptedPassword = bcrypt.hash(plainTextPassword, passwordSalt);

    const patient = await Patient.findOne({
      username: username,
      password: encryptedPassword,
    });

    console.log(patient);

    if (patient == null) {
      return res.status(201).json({ message: "wrong username or password" });
    } else {
      // Patient found, return the token to the client side
      const token = jwt.sign(JSON.stringify(patient), process.env.KEY, {
        algorithm: process.env.ALGORITHM,
      });

      return res.status(200).json({
        token: token.toString(),
        patientUniqueId: patient.patientUniqueId,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

router.route("/getPatientDetails/:id").get(async (req, res) => {
  try {
    const patientUniqueId = req.params.id;
    const patient = await Patient.findOne({ patientUniqueId: patientUniqueId });

    if (patient) {
      return res.status(200).json(patient);
    } else {
      return res.status(201).json({ message: "Patient not found!" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
});

router.route("/previous-appointments").post(async (req, res) => {
  try {
    const patientId = req.body.patientId; //patient id
    const appointments = await Appointment.find({ patientId: patientId });

    // Get current dateTime
    const date = new Date();
    let currDateTime = date.getFullYear().toString();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    currDateTime +=
      month < 10 ? "-0" + month.toString() : "-" + month.toString();
    currDateTime += day < 10 ? "-0" + day.toString() : "-" + day.toString();
    currDateTime += hour < 10 ? "T0" + hour.toString() : "T" + hour.toString();
    currDateTime +=
      minutes < 10 ? ":0" + minutes.toString() : ":" + minutes.toString();
    currDateTime +=
      seconds < 10 ? ":0" + seconds.toString() : ":" + seconds.toString();

    const filteredAppointments = appointments.filter((appointment) => {
      return (
        Date.parse(currDateTime) >=
        Date.parse(appointment.date + "T" + appointment.slotTime)
      );
    });

    const sortedAppointments = filteredAppointments.sort((a, b) => {
      return (
        Date.parse(b.date + "T" + b.slotTime) -
        Date.parse(a.date + "T" + a.slotTime)
      );
    });

    res.status(200).json(sortedAppointments);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.route("/upcoming-appointments").post(async (req, res) => {
  try {
    const patientId = req.body.patientId; //patient id
    const appointments = await Appointment.find({ patientId: patientId });

    // Get current dateTime
    const date = new Date();
    let currDateTime = date.getFullYear().toString();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    currDateTime +=
      month < 10 ? "-0" + month.toString() : "-" + month.toString();
    currDateTime += day < 10 ? "-0" + day.toString() : "-" + day.toString();
    currDateTime += hour < 10 ? "T0" + hour.toString() : "T" + hour.toString();
    currDateTime +=
      minutes < 10 ? ":0" + minutes.toString() : ":" + minutes.toString();
    currDateTime +=
      seconds < 10 ? ":0" + seconds.toString() : ":" + seconds.toString();

    const filteredAppointments = appointments.filter((appointment) => {
      return (
        Date.parse(currDateTime) <=
        Date.parse(appointment.date + "T" + appointment.slotTime)
      );
    });

    const sortedAppointments = filteredAppointments.sort((a, b) => {
      return (
        Date.parse(a.date + "T" + a.slotTime) -
        Date.parse(b.date + "T" + b.slotTime)
      );
    });

    res.status(200).json(sortedAppointments);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.route("/payment").post(async (req, res) => {
  const { finalBalance: finalBalance, token } = req.body;
  const idempotencyKey = uuidv4();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges
        .create(
          {
            amount: finalBalance * 100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: `Booked Appointement Successfully`,
            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip,
              },
            },
          },
          {
            idempotencyKey,
          }
        )
        .then((result) => res.status(200).json(result))
        .catch((err) => {
          console.log(`Error : ${err}`);
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

module.exports = router;
