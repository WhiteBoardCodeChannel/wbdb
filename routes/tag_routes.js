const express = require('express');
const jwtAuth = require(__dirname + '/../lib/jwt_auth');
const jsonParser = require('body-parser').json();
const Tag = require(__dirname + '/../models/tag');
const Challenge = require(__dirname + '/../models/challenge');
// const Hint = require(__dirname + '/../models/hint');
const Solution = require(__dirname + '/../models/solution');
const handleDBError = require(__dirname + '/../lib/handle_db_error');
const tagRouter = module.exports = exports = express.Router();

tagRouter.get('/tags', (req, res) => {
  Tag.find({}, (err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json(data);
  });
});

// find all tags where tag is :id
tagRouter.get('/tags/:id', (req, res) => {
  Tag.find({ tag: req.params.id }).exec()
    .then((tags) => {
      const tagPromises = tags.map((tag) => {
        const challengeId = tag.challengeId;
        const solutionProm = Solution.find({ challengeId: challengeId }).exec();
        // const hintProm = Hint.find({ challengeId }).exec();
        const tagProm = Tag.find({ challengeId }).exec();
        const challengeProm = Challenge.findOne({ _id: challengeId }).exec();

        return Promise.all([solutionProm, tagProm, challengeProm])
          .then((resolutions) => {
            const solutions = resolutions[0]
              .map((solution) => solution.solution);
            // const hints = resolutions[1]
            //   .map((hint) => hint.hint);
            const tags = resolutions[1]
              .map((tag) => tag.tag);
            const challenge = resolutions[2];
            return Object.assign(challenge.toObject(),
              { solutions, tags });
          });
      });
      return Promise.all(tagPromises);
    })
    .then((tagsComposed) => {
      res.status(200).json(tagsComposed);
    })
    .catch((err) => handleDBError(err, res));
});

tagRouter.post('/tags', jwtAuth, jsonParser, (req, res) => {
  var newTag = new Tag(req.body);
  newTag.save((err, data) => {
    if (err) return handleDBError(err, res);
    res.status(200).json(data);
  });
});

tagRouter.put('/tags/:id', jwtAuth, jsonParser, (req, res) => {
  var newData = req.body;
  delete newData._id;
  Tag.update({ _id: req.params.id }, newData, (err) => {
    if (err) return handleDBError(err, res);
    res.status(200).json({ msg: 'Successfully Updated Tag' });
  });
});

tagRouter.delete('/tags/:id', jwtAuth, jsonParser, (req, res) => {
  Tag.remove({ _id: req.params.id }, (err) => {
    if (err) return handleDBError(err, res);
    res.status(200).json({ msg: 'Successfully Deleted Tag' });
  });
});
