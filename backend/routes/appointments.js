const router = require("express").Router();
const appointmentImport = require("../models/appointment.model");
const { Appointment } = appointmentImport;

router.route("/add-meet-link").put((req, res) => {
  const meetLink = "https://meet.google.com/djv-wdop-vsh";
  const appointmentId = req.body.appointmentId;

  Appointment.findOne({ _id: appointmentId }).then((appointment) => {
    if (appointment) {
      appointment.googleMeetLink = meetLink;
      console.log(`Received meet link : ${meetLink}`);

      appointment
        .save()
        .then(() => {
          console.log(`Updated the meet link from backend!`);
          res.status(200).json({ message: "Meet link updated!" });
        })
        .catch((err) => {
          console.log(`Cannot add meet link to the appointment due to ${err}`);
          res.status(400).json({
            message: `Cannot add meet link to the appointment due to ${err}`,
          });
        });
    }
  });
});

router.route("/feedback").put((req, res) => {
  const appointmentId = req.body.appointmentId;
  const stars = req.body.stars;
  const title = req.body.title;
  const review = req.body.review;

  Appointment.findOne({ _id: appointmentId })
    .then((appointment) => {
      if (appointment) {
        appointment.feedback.stars = stars;
        appointment.feedback.title = title;
        appointment.feedback.review = review;
        appointment.feedback.given = true;

        appointment
          .save()
          .then(() => {
            res
              .status(200)
              .json({ message: `Feedback updated successfully!`, appointment });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json(err);
          });
      } else {
        console.log("appointment not found");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

module.exports = router;
