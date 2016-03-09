const express = require('express');
const Challenge = require(__dirname + '/../models/challenge');
const handleDBError = require(__dirname + '/../lib/handle_db_error');
const checkAdmin = require(__dirname + '/../lib/check_admin');
const jwtAuth = require(__dirname + '/../lib/jwt_auth');

const adminRouter = module.exports = exports = express.Router();

// checkAdmin middleware determines if user has admin privileges
adminRouter.get('/admin', jwtAuth, checkAdmin, (req, res) => {
  // find challenges with isPublished = false;
  // returns data, which is an array of all database
  // challenges not yet published
  console.log('inside admin get route');
  Challenge.find({ published: false }, (err, data) => {
    if (err) return handleDBError(err, res);
    console.log(data);
    res.status(200).json(data);
  });
});

// Publish submitted challenge from the queue
adminRouter.put('/admin/:id', jwtAuth, checkAdmin, (req, res) => {
  Challenge.update({ _id: req.params.id }, { published: true }, (err) => {
    if (err) return handleDBError(err, res);
    res.status(200).json({ msg: 'Successfully Published Challenge' });
  });
});


// Delete submitted challenge from the queue (i.e. reject it)
adminRouter.delete('/admin/:id', jwtAuth, checkAdmin, (req, res) => {
  Challenge.remove({ _id: req.params.id }, (err) => {
    if (err) return handleDBError(err, res);
    res.status(200).json({ msg: 'Successfully Rejected Challenge' });
  });
});
