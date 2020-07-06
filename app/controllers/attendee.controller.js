const db = require("../models");
const Attendee = db.attendee;
const Cycle = db.cycle;
const Gathering = db.gathering;

exports.signUp = async (req, res) => {
  const name = req.body.name.toUpperCase();
  const gathering = await Gathering.findById(req.body.gatheringId);
  const attendeesCount = await Attendee.countDocuments({gatheringId: req.body.gatheringId});
  if (attendeesCount >= gathering.seatingCapacity) {
    res.status(400).send({
      message: "Sorry, the seating capacity is already full.",
      error: 'full'
    });
    return;
  }
  let attendee;
  if (req.body.cycleId) {
    attendee = await Attendee.findOne({name, cycleId: req.body.cycleId});
    if (attendee) {
      res.status(400).send({
        message: "You are already signed up for a gathering in the same cycle.",
        error: 'conflict',
        gatheringId: attendee.gatheringId
      });
      return;
    }
  } else {
    attendee = await Attendee.findOne({name, gatheringId: req.body.gatheringId});
    if (attendee) {
      res.status(400).send({
        message: "You are already signed up for this gathering",
        error: 'conflict',
        gatheringId: attendee.gatheringId
      });
      return;
    }
  }

  attendee = new Attendee();
  attendee.name = name;
  attendee.contact = req.body.contact;
  attendee.gatheringId = req.body.gatheringId;
  attendee.cycleId = req.body.cycleId;

  try {
    attendee = await attendee.save();
    res.status(200).send(attendee);
  } catch(e) {
    res.json(e);
  }
};

exports.get = async (req, res) => {
  const cycle = await Cycle.findById(req.body.id);
  //if null send error
  res.json(cycle);
};

exports.getAttendees = async (req, res) => {
  const attendees = await Attendee.find({gatheringId: req.params.gatheringId}).sort('name');

  res.json(attendees);
};

exports.toggleAttendedStatus = async (req, res) => {
  let attendee = await Attendee.findById(req.body.id);
  attendee.hasAttended = req.body.hasAttended;
  attendee.updatedAt = new Date();

  if (attendee.hasAttended) {
    attendee.checkedBy = req.body.checker;
  } else {
    attendee.removedBy = req.body.checker;
  }

  try {
    attendee = await attendee.save();
    res.json(attendee);
  } catch(e) {
    res.json(e);
  }
};