const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var bcrypt = require("bcrypt");
const mongoose = require("mongoose");

exports.new = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
    organizationId: req.body.organizationId
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.getCheckers = async (req, res) => {
  const role = await Role.findOne({name: 'checker'});
  const checkers = await User.find({
    organizationId: req.query.organizationId,
    roles: mongoose.Types.ObjectId(role._id)
  });

  res.json(checkers);
};

exports.toggleDeletedStatus = async (req, res) => {
  let user = await User.findById(req.body.id);
  user.softDeleted = !user.softDeleted;

  if (user.softDeleted) {
    user.deletedAt = new Date();
  }

  user.updatedAt = new Date();

  try {
    user = await user.save();
    res.json(user);
  } catch(e) {
    res.json(e);
  }
};

exports.setPassword = async (req, res) => {
  let user = await User.findById(req.body.id);
  user.password = bcrypt.hashSync(req.body.password, 8)

  user.updatedAt = new Date();

  try {
    user = await user.save();
    res.json(user);
  } catch(e) {
    res.json(e);
  }
};