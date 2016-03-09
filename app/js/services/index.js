module.exports = function(app, API) {
  require('./auth_service')(app);
  require('./interceptor_service')(app, API);
  require('./resource_service')(app);
  require('./user_service')(app);
  require('./admin_service')(app);
};
