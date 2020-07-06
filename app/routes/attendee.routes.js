const { authJwt } = require("../middlewares");
const controller = require("../controllers/attendee.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/attendee/signUp", controller.signUp);

  app.get("/api/attendee/attendees/:gatheringId", controller.getAttendees);

  app.put(
    "/api/attendee/toggleAttendedStatus",
    [authJwt.verifyToken],
    controller.toggleAttendedStatus
  );
};