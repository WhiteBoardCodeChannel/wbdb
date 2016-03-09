const express = require('express');
const jwtAuth = require(__dirname + '/../lib/jwt_auth');
const jsonParser = require('body-parser').json();
const User = require(__dirname + '/../models/user');
const Challenge = require(__dirname + '/../models/challenge');
const Favorite = require(__dirname + '/../models/favorite');
const handleDBError = require(__dirname + '/../lib/handle_db_error');
const userRouter = module.exports = exports = express.Router();

userRouter.get('/currentuser', jwtAuth, jsonParser, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, data) => {
    if (err) return handleDBError(err, res);
    res.json(data);
  });
});

userRouter.get('/mychallenges', jwtAuth, jsonParser, (req, res) => {
  Challenge.find({ userId: req.user._id }, (err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json(data);
  });
});
