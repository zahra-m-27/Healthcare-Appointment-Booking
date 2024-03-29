const router = require("express").Router();
const doctors = require("../models/doctor.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const appointmentImport = require("../models/appointment.model");
const { Doctor, Slot, DateSchedule } = doctors;
const { Appointment, Feedback } = appointmentImport;
const bcrypt = require("../bcrypt/bcrypt");

function createDate(date) {
  return new DateSchedule({
    date: date,
    slots: [
      new Slot({
        time: "09:00:00",
        isBooked: false,
      }),
      new Slot({
        time: "12:00:00",
        isBooked: false,
      }),
      new Slot({
        time: "15:00:00",
        isBooked: false,
      }),
    ],
  });
}

router.route("/").get((req, res) => {
  Doctor.find()
    .then((doctors) => {
      res.json(doctors); //Sends data in JSON format and ends the request
    })
    .catch((err) => {
      res.status(400).json(`Error : ${err}`);
    });
});

router.route("/add").post((req, res) => {
  const username = req.body.username; // Required. can't be undefined
  const password = req.body.password;
  const email = req.body.email;

  const newDoctor = new Doctor({
    username,
    password,
    email,
  });

  newDoctor
    .save()
    .then((savedDoctor) => {
      console.log(`${savedDoctor} added!`);
      const token = jwt.sign(JSON.stringify(savedDoctor), process.env.KEY, {
        algorithm: process.env.ALGORITHM,
      });
      res.status(200).json({
        doctorId: savedDoctor._id,
        token: token.toString(),
      });
    })
    .catch((err) => {
      res.status(400).json(`Error : ${err}`);
    });
});

router.route("/update").put((req, res) => {
  const doctorUniqueId = req.body._id; // Required. can't be undefined

  Doctor.findOne({ _id: doctorUniqueId }).then((doctor) => {
    if (doctor) {
      doctor.name = req.body.name;
      doctor.phoneNumber = req.body.phoneNumber;
      doctor.specialization = req.body.specialization;
      doctor.feesPerSession = req.body.feesPerSession;

      doctor
        .save()
        .then(() => {
          const token = jwt.sign(JSON.stringify(doctor), process.env.KEY, {
            algorithm: process.env.ALGORITHM,
          });
          res.status(200).json({
            message: "Doctor updated",
            token: token.toString(),
          });
        })
        .catch((err) => {
          res.status(400).json(`Error : ${err}`);
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

    const doctor = await Doctor.findOne({
      username: username,
      password: encryptedPassword,
    });

    console.log(doctor);

    if (doctor == null) {
      return res.status(201).json({ message: "wrong username or password" });
    } else {
      // Doctor found, return the token to the client side
      const token = jwt.sign(JSON.stringify(doctor), process.env.KEY, {
        algorithm: process.env.ALGORITHM,
      });
      return res.status(200).json({
        token: token.toString(),
        doctorId: doctor._id,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

router.route("/get-slots").post(async (req, res) => {
  try {
    const id = req.body._id; // Doctor's id
    const date = req.body.date; // Date to book
    console.log(id);
    const doctor = await Doctor.findOne({ _id: id });

    // Doctor not found
    if (doctor == null) {
      console.log("Doctor not found in the database!");
      return res.status(201).json({
        message: "Doctor not found in the database!",
      });
    } else {
      // Doctor found
      // Find the date
      let count = 0;
      for (const i of doctor.dates) {
        if (i.date === date) {
          return res.status(200).json(i);
        }
        count++;
      }

      const oldLength = count;

      // Add new slots if date not found in the db
      const dateSchedule = createDate(date);
      const updatedDoctor = await Doctor.findOneAndUpdate(
        { _id: id },
        { $push: { dates: dateSchedule } },
        { new: true }
      );

      if (updatedDoctor) {
        return res.status(200).json(updatedDoctor.dates[oldLength]);
      } else {
        const err = { err: "an error occurred!" };
        throw err;
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: err,
    });
  }
});

router.route("/book-slot").post((req, res) => {
  const patientId = req.body.patientId; // Patient's Id
  const patientName = req.body.patientName; // Patient's name
  const doctorId = req.body.doctorId; // Doctor's id 606460d2e0dd28cc76d9b0f3
  const slotId = req.body.slotId; // Id of that particular slot
  const dateId = req.body.dateId; // Id of that particular date
  const meetLink = "";

  Doctor.findOne({ _id: doctorId }).then((doctor) => {
    const date = doctor.dates.id(dateId);
    const slot = date.slots.id(slotId);
    slot.isBooked = true;
    doctor
      .save()
      .then(() => {
        // Create an entry in the appointment database
        const newAppointment = new Appointment({
          doctorId,
          dateId,
          slotId,
          patientId: patientId,
          date: date.date,
          slotTime: slot.time,
          doctorName: doctor.name,
          doctorEmail: doctor.email,
          patientName: patientName,
          googleMeetLink: meetLink,
          feedback: new Feedback(),
        });

        console.log(newAppointment);

        newAppointment
          .save()
          .then((appointment) => {
            return res.status(200).json(appointment);
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          message: `An error occurred : ${err}`,
        });
      });
  });
});

router.route("/appointments").post(async (req, res) => {
  try {
    const doctorId = req.body.doctorId;
    const appointments = await Appointment.find({
      doctorId: doctorId,
    });
    const sortedAppointments = appointments.sort((a, b) => {
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

router.route("/appointment/:id").get(async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findOne({
      _id: appointmentId,
    });

    res.status(200).json(appointment);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.route("/todays-appointments").post(async (req, res) => {
  try {
    const date = new Date();
    let currDate = date.getFullYear().toString();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    currDate += month < 10 ? "-0" + month.toString() : "-" + month.toString();
    currDate += day < 10 ? "-0" + day.toString() : "-" + day.toString();

    const doctorId = req.body.doctorId;
    console.log(doctorId);
    console.log(currDate);
    const appointments = await Appointment.find({
      doctorId: doctorId,
      date: currDate,
    });

    const sortedAppointments = appointments.sort((a, b) => {
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

router.route("/previous-appointments").post(async (req, res) => {
  try {
    const doctorId = req.body.doctorId;

    const appointments = await Appointment.find({ doctorId: doctorId });

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

router.route("/getDoctorDetails/:id").get(async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId);

    if (doctor) {
      return res.status(200).json(doctor);
    } else {
      return res.status(201).json({ message: "Doctor not found!" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
});

module.exports = router;
