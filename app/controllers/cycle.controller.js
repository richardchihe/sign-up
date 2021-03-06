const config = require("../config/auth.config");
const db = require("../models");
const Cycle = db.cycle;
const Gathering = db.gathering;
const Attendee = db.attendee;
const async = require("async");

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

exports.get = async (req, res) => {
  const cycle = await Cycle.findById(req.body.id);
  //if null send error
  res.json(cycle);
};

exports.getActiveGatherings = async (req, res) => {
  const cycle = await Cycle.findOne({_id: req.params.id, isArchived: false});
  if (!cycle) {
    res.status(401).send({ message: "Unauthorized!" });
    return;
  }

  const gatherings = await Gathering.find({cycleId: req.params.id, isOpen: true});
  let gatheringsWithCount = [];
  
  async.mapLimit(gatherings, 10, async gathering => {
    const attendeesCount = await Attendee.countDocuments({gatheringId: gathering._id});
    gatheringsWithCount.push({...gathering._doc, attendeesCount});
    return attendeesCount;
  }, (err, contents) => {
    if (err) throw err;
    const result = {...cycle._doc, gatherings: gatheringsWithCount};
    res.json(result);
  });
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
    let gatherings = await Gathering.find({cycleId: cycle._id});
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

exports.update = async (req, res) => {
  let cycle = await Cycle.findById(req.body.id);
  cycle.title = req.body.title;

  try {
    cycle = await cycle.save();
    res.json(cycle);
  } catch(e) {
    res.json(e);
  }
};