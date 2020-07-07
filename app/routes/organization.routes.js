const { authJwt } = require("../middlewares");
const controller = require("../controllers/organization.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/organization/new",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.new
  );

  app.get("/api/organization/id/:id", controller.getById);

  app.get("/api/organization/:slug", controller.get);

  app.put(
    "/api/organization/update",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.update
  );
};