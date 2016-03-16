const express = require('express');
const jwtAuth = require(__dirname + '/../lib/jwt_auth');
const jsonParser = require('body-parser').json();
const Challenge = require(__dirname + '/../models/challenge');
const Favorite = require(__dirname + '/../models/favorite');
const User = require(__dirname + '/../models/user');
const handleDBError = require(__dirname + '/../lib/handle_db_error');
const favoriteRouter = module.exports = exports = express.Router();

favoriteRouter.post('/favorites', jwtAuth, jsonParser, (req, res) => {
  User.findOne({ _id: req.body.userId }).exec()
    .then((data) => {
      if (!data) throw new Error('invalid user');
      return Challenge.findOne({ _id: req.body.challengeId }).exec();
    })
    .then((data) => {
      if (!data) throw new Error('invalid challenge');
      return Favorite.findOne(req.body).exec();
    })
    .then((data) => {
      if (data) throw new Error('already favorited');
      return Favorite.create(req.body);
    })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      // Check if this was an error we threw instead of a
      // mongoose promise rejection
      if (err instanceof Error) {
        return res.status(400).json({ msg: err.message });
      }
      handleDBError(err, res);
    });
});

favoriteRouter.get('/favorites', jwtAuth, jsonParser, (req, res) => {
  Favorite.find({ userId: req.user._id }).exec()
    .then((favorites) => {
      const favIds = favorites.map((fav) => fav.challengeId);
      return Challenge.find({ _id: { $in: favIds } }).exec();
    })
    .then((favChallenges) => res.status(200).json(favChallenges))
    .catch((err) => handleDBError(err, res));
});

favoriteRouter.get('/favorites/:id', jsonParser, (req, res) => {
  Favorite.find({ challengeId: req.params.id }).exec()
    .then((favorites) => {
      return favorites.length;
    })
    .then((favCount) => res.status(200).json(favCount))
    .catch((err) => handleDBError(err, res));
});

favoriteRouter.delete('/favorites/:id', jwtAuth, jsonParser, (req, res) => {
  Favorite.remove({ challengeId: req.params.id, userId: req.user._id }, (err) => {
    if (err) return handleDBError(err, res);
    res.status(200).json({ msg: 'Successfully Deleted Challenge' });
  });
});
