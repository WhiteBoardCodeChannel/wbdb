module.exports = function(app) {
  app.controller('NavController', ['$scope', 'auth', 'user', '$rootScope',
    function($scope, auth, user, $rootScope) {
      $scope.auth = auth;
      // console.log(auth.parseJWT(auth.token));
      console.log('loading nav controller');
      // console.log(user.getUser());
      // console.log(user.getUser().authentication);

      $rootScope.isAdmin = false;
      user.getUser((err, res) => {
        if (err) return console.log(err);
        console.log(res);
        if (res.authentication.isAdmin) $rootScope.isAdmin = true;
      });
      // $rootScope.isAdmin = true;
      // else $rootScope.isAdmin = false;

      $rootScope.loggedIn = !!auth.token;
      $scope.logout = auth.logout.bind(auth, () => $rootScope.loggedIn = false);
  }]);
};
