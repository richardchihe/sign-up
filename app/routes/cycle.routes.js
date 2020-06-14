const { authJwt } = require("../middlewares");
const controller = require("../controllers/cycle.controller");

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

  app.put(
    "/api/cycle/toggleArchiveStatus",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.toggleArchiveStatus
  );

  app.get("/api/cycle/:slug", controller.get);

  app.put(
    "/api/cycle/update",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.update
  );
};