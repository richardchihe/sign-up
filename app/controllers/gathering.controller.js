const db = require("../models");
const Gathering = db.gathering;
const Attendee = db.attendee;

exports.new = async (req, res) => {
  let gathering = new Gathering();
  gathering.userId = req.userId;
  gathering.organizationId = req.body.organizationId;
  gathering.cycleId = req.body.cycleId;
  gathering.title = req.body.title;
  gathering.date = req.body.date;
  gathering.from = req.body.from;
  gathering.to = req.body.to;
  gathering.seatingCapacity = req.body.seatingCapacity;
  gathering.description = req.body.description;
  gathering.requireContact = req.body.requireContact;

  try {
    gathering = await gathering.save();
    res.status(200).send(gathering);
  } catch(e) {
    res.json(e);
  }
};


exports.update = async (req, res) => {
  let gathering = await Gathering.findById(req.body.id);
  console.log(req.body);
  gathering.title = req.body.title;
  gathering.date = req.body.date;
  gathering.from = req.body.from;
  gathering.to = req.body.to;
  gathering.seatingCapacity = req.body.seatingCapacity;
  gathering.description = req.body.description;
  gathering.requireContact = req.body.requireContact;
  gathering.updatedAt = new Date();

  try {
    gathering = await gathering.save();
    res.json(gathering);
  } catch(e) {
    res.json(e);
  }
};

exports.get = async (req, res) => {
  const gathering = await Gathering.findById(req.params.id);
  const attendeesCount = await Attendee.countDocuments({gatheringId: req.params.id});
  const result = {...gathering._doc, attendeesCount: attendeesCount};
  //if null send error
  res.json(result);
};

exports.getAttendeesCount = async (req, res) => {
  const attendeesCount = await Attendee.countDocuments({gatheringId: req.params.id});
  const result = {attendeesCount: attendeesCount};
  //if null send error
  res.json(result);
};

exports.toggleOpenStatus = async (req, res) => {
  let gathering = await Gathering.findById(req.body.id);
  gathering.isOpen = !gathering.isOpen;

  try {
    gathering = await gathering.save();
    res.json(gathering);
  } catch(e) {
    res.json(e);
  }
};

exports.toggleArchiveStatus = async (req, res) => {
  let gathering = await Gathering.findById(req.body.id);
  gathering.isArchived = !gathering.isArchived;

  if (gathering.isArchived) {
    gathering.isOpen = false;
  }

  try {
    gathering = await gathering.save();
    res.json(gathering);
  } catch(e) {
    res.json(e);
  }
};