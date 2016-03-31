const express = require('express');
const jwtAuth = require(__dirname + '/../lib/jwt_auth');
const jsonParser = require('body-parser').json();
const Challenge = require(__dirname + '/../models/challenge');
const Solution = require(__dirname + '/../models/solution');
const Hint = require(__dirname + '/../models/hint');
const Tag = require(__dirname + '/../models/tag');
const handleDBError = require(__dirname + '/../lib/handle_db_error');
const challengeRouter = module.exports = exports = express.Router();

challengeRouter.get('/challenges', (req, res) => {
  Challenge.find({}).exec()
    .then((challenges) => {
      const challengePromises = challenges.map((challenge) => {
        const challengeId = challenge._id;
        const solutionProm = Solution.find({ challengeId }).exec();
        const hintProm = Hint.find({ challengeId }).exec();
        const tagProm = Tag.find({ challengeId }).exec();

        return Promise.all([solutionProm, hintProm, tagProm])
          .then((resolutions) => {
            const solutions = resolutions[0]
              .map((solution) => solution.solution);
            const hints = resolutions[1]
              .map((hint) => hint.hint);
            const tags = resolutions[2]
              .map((tag) => tag.tag);

            return Object.assign(challenge.toObject(),
              { solutions, hints, tags });
          });
      });

      return Promise.all(challengePromises);
    })
    .then((challengesComposed) => {
      res.status(200).json(challengesComposed);
    })
    .catch((err) => handleDBError(err, res));
});

challengeRouter.get('/published', (req, res) => {
  Challenge.find({ published: true }, (err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json(data);
  });
});

challengeRouter.get('/userchallenges/:id', (req, res) => {
  Challenge.find({ author: req.params.id, published: true }, (err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json(data);
  });
});

challengeRouter.get('/challenges/:id', (req, res) => {
  console.log('retrieving individual challenge');
  Challenge.findOne({ _id: req.params.id }).exec()
    .then((challenge) => {
      const challengeId = challenge._id;
      const solutionProm = Solution.find({ challengeId }).exec();
      const hintProm = Hint.find({ challengeId }).exec();
      const tagProm = Tag.find({ challengeId }).exec();

      return Promise.all([solutionProm, hintProm, tagProm])
        .then((resolutions) => {
          console.log(resolutions);
          const solutions = resolutions[0];
          const hints = resolutions[1];
          const tags = resolutions[2];
          res.status(200).json(Object.assign(challenge.toObject(),
            { solutions, hints, tags }));
        });
    })
    .catch((err) => handleDBError(err, res));
});

challengeRouter.post('/challenges', jwtAuth, jsonParser, (req, res) => {
  Challenge.create(req.body)
    .then((newChallenge) => {
      const challengeId = newChallenge._id;
      const userId = req.body.userId;
      var solutionPromises = [];
      var hintPromises = [];
      var tagPromises = [];
      if (Array.isArray(req.body.solutions)) {
        solutionPromises = req.body.solutions.map((solution) => {
          return Solution.create({ solution, challengeId, userId });
        });
      }
      if (Array.isArray(req.body.hints)) {
        hintPromises = req.body.hints.map((hint) => {
          return Hint.create({ hint, challengeId, userId });
        });
      }
      if (Array.isArray(req.body.tags)) {
        tagPromises = req.body.tags.map((tag) => {
          return Tag.create({ tag, challengeId, userId });
        });
      }
      const bigThree = [solutionPromises, hintPromises, tagPromises]
        .map((proms) => Promise.all(proms));

      return Promise.all(bigThree)
        .then((resolutions) => {
          const solutions = resolutions[0].map((solution) => solution.solution);
          const hints = resolutions[1].map((hint) => hint.hint);
          const tags = resolutions[2].map((tag) => tag.tag);

          res.status(200).json(Object.assign(newChallenge.toObject(),
            { solutions, hints, tags }));
        });
    })
    .catch((err) => handleDBError(err, res));
});

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
