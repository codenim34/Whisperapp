//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds).then(function (hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });
    newUser
      .save()
      .then(function () {
        res.render("secrets");
      })
      .catch(function (err) {
        console.log(err);
      });
  });
});

app.post("/login", function (req, res) {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({ email: username })
    .then(function (foundUser) {
      bcrypt.compare(password, foundUser.password).then(function(result) {
         if(result===true) {
           res.render("secrets");
         }else{
          console.log("Wrong  pass");
         }
    });
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.listen(3000, function () {
  console.log("Server started on 3000 portal");
});
