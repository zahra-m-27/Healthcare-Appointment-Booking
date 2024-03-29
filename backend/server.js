const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const patientsRouter = require("./routes/patients");
const doctorsRouter = require("./routes/doctors");
const appointmentRouter = require("./routes/appointments");
const path = require("path");
require("dotenv").config();

app.use(express.json());
app.use(
  cors({
    origin: "https://healthcare-appointment-booking-6obk.onrender.com",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
  })
);

app.use("/patients", patientsRouter);
app.use("/doctors", doctorsRouter);
app.use("/appointments", appointmentRouter);
app.use(express.static(path.join(__dirname, "../frontend/build")));

const port = process.env.PORT || 5000;
let uri = "";
process.env.NODE_ENV === "test"
  ? (uri = process.env.ATLAS_URI_TEST)
  : (uri = process.env.ATLAS_URI);

mongoose.connect(
  uri,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (!err) {
      console.log("Connection to database successful!");
    }
  }
);

function getCurrentTime() {
  const date = new Date();
  console.log(date);
}

function getEndDateTime(dateTime) {
  // 2021-03-22T09:00:00
  const hrs = (parseInt(dateTime.split("T")[1].split(":")[0]) + 1)
    .toString()
    .padStart(2, "0");
  const time = hrs + ":00:00";
  const date = dateTime.split("T")[0];
  return date + "T" + time;
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  console.log(`NODE_ENV = ${process.env.NODE_ENV}`);
  getCurrentTime();
  getEndDateTime("2021-03-22T09:00:00");
});

app.get("/", (req, res) => {
  res.status(200).json("Hello");
});
app.get("/*", function (req, res) {
  res.sendFile(
    path.join(__dirname, "../frontend/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

module.exports = app;
