module.exports = function(app) {
  require('./auth_controller')(app);
  require('./challenge_controller')(app);
  require('./home_controller')(app);
  require('./searchtag_controller')(app);
  require('./searchuser_controller')(app);
  require('./user_controller')(app);
  require('./admin_controller')(app);
  require('./nav_controller')(app);
};
