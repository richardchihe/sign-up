if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const favicon = require('serve-favicon');

//for dev
const corsOptions = {
  origin: "http://localhost:3000"
};
const port = process.env.SERVER_PORT;

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;
const dbConfig = require("./app/config/db.config");

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

app.use(favicon(__dirname + '/build/Favicon.ico'));

app.use(express.static(__dirname + '/build'));

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/organization.routes')(app);
require('./app/routes/cycle.routes')(app);
require('./app/routes/gathering.routes')(app);
require('./app/routes/attendee.routes')(app);
require('./app/routes/checker.routes')(app);

app.get('*', (req, res, next) => {
  res.sendFile(__dirname + '/build/index.html')
});

const server = app.listen(port, () => console.log(`Example app listening on port ${port}`));

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "checker"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}