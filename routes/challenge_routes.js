const express = require('express');
const jwtAuth = require(__dirname + '/../lib/jwt_auth');
const jsonParser = require('body-parser').json();
const Challenge = require(__dirname + '/../models/challenge');
const handleDBError = require(__dirname + '/../lib/handle_db_error');
const challengeRouter = module.exports = exports = express.Router();

// future goal: threshold get request
challengeRouter.get('/challenges', (req, res) => {
  Challenge.find({}, (err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json(data);
  });
});

<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> 7c36de8b3a18fa65a1a433ee6c0b1dcd61056afc
=======
>>>>>>> 679a6c188eaf799a80b8a104c4b042dda52f92a1
challengeRouter.post('/challenges', jwtAuth, jsonParser, (req, res) => {
  var newChallenge = new Challenge(req.body);
  newChallenge.save((err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json(data);
  });
});

// Add Middleware to check admin privileges
<<<<<<< HEAD

=======
>>>>>>> 7c36de8b3a18fa65a1a433ee6c0b1dcd61056afc
challengeRouter.put('/challenges/:id', jwtAuth, jsonParser, (req, res) => {
  var newData = req.body;
  delete newData._id;
  Challenge.update({ _id: req.params.id }, newData, (err) => {
    if (err) return handleDBError(err, res);
    res.status(200).json({ msg: 'Successfully Updated Challenge' });
  });
});

challengeRouter.delete('/challenges/:id', jwtAuth, jsonParser, (req, res) => {
  Challenge.remove({ _id: req.params.id }, (err) => {
    if (err) return handleDBError(err, res);
    res.status(200).json({ msg: 'Successfully Deleted Challenge' });
  });
});
