module.exports = function(app) {
  app.controller('AuthController', ['$rootScope', '$scope', 'auth', 'user', '$location', ($rootScope, $scope, auth, userService, $location) => {
    $scope.auth = auth;
    $rootScope.loggedIn = !!auth.token;
    $scope.signup = false;
    $scope.signin = false;
    $scope.form = {};
    $scope.toggleSignup = () => {
      $scope.signup = true;
      $scope.signin = false;
    };
    $scope.toggleSignin = () => {
      $scope.signin = true;
      $scope.signup = false;
    };
    $scope.login = (user) => {
      userService.login(user, (err, res) => {
        if (err) return console.log(err.data.msg);
        console.log(res);
        $rootScope.loggedIn = true;

        if (res.isAdmin) {
          $rootScope.isAdmin = true;
          $location.path('/admin');
        }
        else {
          $rootScope.isAdmin = false;
          $location.path('/user');
        }
      });
    };
    $scope.register = (user) => {
      userService.createUser(user, (err) => {
        if (err) return console.log(err.data.msg);
        $rootScope.loggedIn = true;
        $location.path('/user');
      });
    };
  }]);
};
