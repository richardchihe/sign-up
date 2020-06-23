const { authJwt } = require("../middlewares");
const controller = require("../controllers/checker.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/checker/new",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.new
  );
};