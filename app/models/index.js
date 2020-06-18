const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.role = require("./role.model");
db.user = require("./user.model");
db.organization = require("./organization.model");
db.cycle = require("./cycle.model");
db.gathering = require("./gathering.model");
db.attendee = require("./attendee.model");

db.ROLES = ["user", "checker", "moderator", "admin"];

module.exports = db;