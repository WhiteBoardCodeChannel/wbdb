const User = require(__dirname + '/../models/user');
const handleDBError = require(__dirname + '/handle_db_error');

module.exports = exports = function(req, res) {
  const newUser = new User();
  newUser.username = req.body.username;
  newUser.authentication.email = req.body.email;
  newUser.authentication.password = newUser.hashPassword(req.body.password);
  newUser.authentication.isAdmin = req.body.isAdmin;
  newUser.save((err) => {
    if (err) return handleDBError(err);
    return res.status(200)
      .json({ msg: 'Success in signup!', token: newUser.generateToken(), isAdmin: newUser.authentication.isAddmin });
  });
};
