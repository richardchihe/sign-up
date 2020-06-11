const { authJwt } = require("../middlewares");
const controller = require("../controllers/articles.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/articles", controller.articles);

  app.post(
    "/api/articles/new",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.new
  );

  app.get("/api/articles/:slug", controller.get);

  app.put(
    "/api/articles/update",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.update
  );

  app.delete(
    "/api/articles/delete",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delete
  );
};