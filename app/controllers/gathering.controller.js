const db = require("../models");
const Gathering = db.gathering;

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

exports.get = async (req, res) => {
  const gathering = await Gathering.findById(req.body.id);
  //if null send error
  res.json(gathering);
};

exports.toggleArchiveStatus = async (req, res) => {
  let gathering = await Gathering.findById(req.body.id);
  gathering.isArchived = !gathering.isArchived;

  try {
    gathering = await gathering.save();
    res.json(gathering);
  } catch(e) {
    res.json(e);
  }
};

exports.update = async (req, res) => {
  let organization = await Organization.findById(req.body.id);
  organization.userId = req.userId;
  organization.name = req.body.name;
  organization.seatingCapacity = req.body.seatingCapacity;
  organization.address = req.body.address;
  organization.contact = req.body.contact;

  try {
    organization = await organization.save();
    res.json(organization);
  } catch(e) {
    res.json(e);
  }
};