const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const corsOptions = {
  origin: ["http://localhost:8080"],
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");

db.sequelize.sync();

// never enable the code below in production
// force: true will drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and Resync Database with { force: true }");
//   // initial();
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

const expressWs = require("express-ws");
const path = require("path");
const ws = expressWs(app);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

const {
  refactoreMe1,
  refactoreMe2,
  callmeWebSocket,
  getDatatoDb,
  getData,
  login,
} = require("./app/controllers/exampleController");
// const exampleMiddleware = require("./app/middleware/exampleMiddleware");

const auth = require("./app/middleware/index").exampleMiddleware;
app.get("/data", refactoreMe1);
app.post("/data", refactoreMe2);
app.get("/web", (req, res) => {
  res.render("index");
});

app.post("/login", login);

app.post("/attack", auth.exampleMiddlewareFunction, getDatatoDb);
app.get("/attack", auth.exampleMiddlewareFunction, auth.isAdmin, getData);
app.ws("/ws", callmeWebSocket);

// routes
// require("./app/routes/exaole.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 7878;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;
