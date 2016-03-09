const handleSuccess = (cb) => {
  return (res) => {
    cb(null, res.data);
  };
};

const handleFailure = (cb) => {
  return (res) => {
    cb(res);
  };
};

module.exports = (app) => {
  app.factory('user', ['$http', 'auth', ($http, auth) => {
    class User {
      constructor() {}

      createUser(user, cb) {
        console.log(user);
        $http.post('http://localhost:3000/api/signup', user)
          .then(handleSuccess(cb), handleFailure(cb));
      }

      login(user, cb) {
        $http({
          method: 'GET',
          url: 'http://localhost:3000/api/signin',
          headers: {
            'Authorization': `Basic ${btoa(user.email + ':' + user.password)}`
          }
        })
          .then(handleSuccess(cb), handleFailure(cb));
      }

      getUser(cb) {
        cb = cb || function(){};
        // $http.get('http://localhost:3000/api/currentuser')
        $http({
          method: 'GET',
          url: 'http://localhost:3000/api/currentuser',
          headers: {
            token: auth.getToken()
          },
          user: {
            _id: auth.getUserId()
          }
        })
          .then(handleSuccess(cb), handleFailure(cb));
      }
    }

    return new User();
  }]);
};
