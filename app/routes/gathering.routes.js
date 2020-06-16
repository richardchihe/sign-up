const { authJwt } = require("../middlewares");
const controller = require("../controllers/gathering.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // app.get("/api/gatherings", controller.gatherings);

  app.post(
    "/api/gathering/new",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.new
  );

  app.put(
    "/api/gathering/toggleOpenStatus",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.toggleOpenStatus
  );

  app.put(
    "/api/gathering/toggleArchiveStatus",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.toggleArchiveStatus
  );

  app.put(
    "/api/gathering/update",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.update
  );

  app.get("/api/gathering/:slug", controller.get);

  // app.delete(
  //   "/api/gathering/delete",
  //   [authJwt.verifyToken, authJwt.isAdmin],
  //   controller.delete
  // );
};