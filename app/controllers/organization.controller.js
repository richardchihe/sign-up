// const config = require("../config/auth.config");
const db = require("../models");
const Organization = db.organization;
const User = db.user;

exports.new = async (req, res) => {
  let organization = new Organization();
  organization.userId = req.userId;
  organization.name = req.body.name;
  organization.seatingCapacity = req.body.seatingCapacity;
  organization.address = req.body.address;
  organization.contact = req.body.contact;

  try {
    organization = await organization.save();
    let user = await User.findById(req.userId);
    user.organizationId = organization._id;
    user = await user.save();
    res.json(organization);
  } catch(e) {
    res.json(e);
  }

  
};

exports.get = async (req, res) => {
  const organization = await Organization.findOne({ slug: req.params.slug });
  //if null send error
  res.json(article);
};

exports.update = async (req, res) => {
  let organization = await Organization.findById(req.body.id);
  article.title = req.body.title;
  article.description = req.body.description;
  article.markdown = req.body.markdown;

  try {
    article = await article.save();
    res.json(article);
  } catch(e) {
    res.json(e);
  }
};