const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
const app = express();

// Port
const port = process.env.PORT || 5000;

// Routes
const plagiarism = require("./routes/api/plagiarism");
const users = require("./routes/api/users");
const colleges = require("./routes/api/colleges");
const researches = require("./routes/api/researches");
const activities = require("./routes/api/activities");
const journals = require("./routes/api/journals");
const grammar = require("./routes/api/grammar");
const userlogs = require("./routes/api/userlogs");

//DB Config
const db = require("./config/keys").mongoURI;

//connect to mongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "25mb" }));

//Passport Middleware
app.use(passport.initialize());

// app.use(function (req, res, next) {
//   console.log("NEW REQUEST " + req.url);
//   req.connection.setTimeout(5000000)
//   next()
// })

// Passport Config
require("./config/passport.js")(passport);

app.all("/", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

//Use Routes
app.use("/api/plagiarism", plagiarism);
app.use("/api/users", users);
app.use("/api/colleges", colleges);
app.use("/api/researches", researches);
app.use("/api/activities", activities);
app.use("/api/journals", journals);
app.use("/api/grammar", grammar);
app.use("/api/userlogs", userlogs);

// Server static assests if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(
        __dirname,
        "client",
        "build",
        "index.html"
      )
    );
  });
}

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

//"proxy": "http://54.83.141.99:80",
