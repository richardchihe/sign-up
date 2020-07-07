const config = require("../config/auth.config");
const db = require("../models");
const Organization = db.organization;
const User = db.user;

var jwt = require("jsonwebtoken");

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

    await User.findById(req.userId)
      .populate("roles", "-__v")
      .exec((err, user) => {
        var token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 86400 // 24 hours
        });

        var authorities = [];

        for (let i = 0; i < user.roles.length; i++) {
          authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }

        var result = {
          organization: organization,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities,
            organizationId: user.organizationId,
            accessToken: token
          }
        };

        res.status(200).send(result);
      });
  } catch(e) {
    res.json(e);
  }
};

exports.get = async (req, res) => {
  const organization = await Organization.findOne({ slug: req.params.slug });
  //if null send error
  res.json(organization);
};

exports.getById = async (req, res) => {
  const organization = await Organization.findById(req.params.id);
  //if null send error
  res.json(organization);
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