const User = require(__dirname + '/../models/user');
const jwt = require('jsonwebtoken');

module.exports = exports = function(req, res, next) {
  var decoded;
  try {
    decoded = jwt.verify(req.headers.authorization.split(' ')[1],
      process.env.APP_SECRET || 'changethis');
  } catch (e) {
    return res.status(401).json({ msg: 'authenticat seyzz one' });
  }

  User.findOne({ _id: decoded.id }, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ msg: 'authenticat seyzz two' });
    }

    if (!user) return res.status(401).json({ msg: 'authenticat seyzz three' });

    req.user = user;
    next();
  });
};
