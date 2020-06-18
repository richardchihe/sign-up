const db = require("../models");
const Attendee = db.attendee;
const Cycle = db.cycle;
const Gathering = db.gathering;

exports.new = async (req, res) => {
  let cycle = new Cycle();
  cycle.userId = req.userId;
  cycle.organizationId = req.body.organizationId;
  cycle.title = req.body.title;

  try {
    cycle = await cycle.save();
    res.status(200).send(cycle);
  } catch(e) {
    res.json(e);
  }
};

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

exports.getAll = async (req, res) => {
  let isArchived = null;
  if (req.query.filter === 'active') {
    isArchived = false;
  } else if (req.query.filter === 'archived') {
    isArchived = true;
  }

  let cycles = [];
  if (isArchived === null) {
    cycles = await Cycle.find({userId: req.userId}).sort({createdAt: 'desc'});
  } else {
    cycles = await Cycle.find({userId: req.userId, isArchived}).sort({createdAt: 'desc'});
  }
  
  let cyclesWithGatherings = [];
  cycles.forEach( async (cycle, index) => {
    let gatherings = [];
    // if (isArchived === null) {
      gatherings = await Gathering.find({cycleId: cycle._id});
    // } else {
    //   gatherings = await Gathering.find({cycleId: cycle._id, isArchived});
    // } 
    cyclesWithGatherings.push({...cycle._doc, gatherings: gatherings});
  });

  let gatherings = [];
  if (isArchived === null) {
    gatherings = await Gathering.find({userId: req.userId, cycleId: null});
  } else {
    gatherings = await Gathering.find({userId: req.userId, cycleId: null, isArchived});
  } 
  
  const result = {
    cycles: cyclesWithGatherings,
    gatherings: gatherings
  }

  res.json(result);
};

exports.toggleArchiveStatus = async (req, res) => {
  let cycle = await Cycle.findById(req.body.id);
  cycle.isArchived = !cycle.isArchived;

  if (cycle.isArchived) {
    Gathering.updateMany({
        cycleId: req.body.id
      },
      { $set: {isArchived: true} },
      (err, writeResult) => {
        console.log(err);
      }
    );
  }

  try {
    cycle = await cycle.save();
    res.json(cycle);
  } catch(e) {
    res.json(e);
  }
};