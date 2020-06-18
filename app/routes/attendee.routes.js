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

  app.post(
    "/api/cycle/new",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.new
  );

  app.get("/api/cycle/cAndG", 
    [authJwt.verifyToken, authJwt.isModerator],
    controller.getAll
  );

  app.post("/api/attendee/signUp", controller.signUp);
};