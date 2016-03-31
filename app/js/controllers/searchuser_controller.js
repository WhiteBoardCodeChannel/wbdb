module.exports = function(app) {
  app.controller('SearchUserController', ['$scope', '$location', '$http',
    '$stateParams', ($scope, $location, $http, $stateParams) => {

      $scope.solutions = [];
      $scope.challenges = [];

      $scope.username = $stateParams.id;

      $scope.redirect = function(id) {
        $location.path('/challenge/' + id);
      };

      $scope.searchUser = function(user) {
        $location.path('/search/user/' + user);
      };

      $scope.searchTag = function(tag) {
        $location.path('/search/tag/' + tag);
      };

      $scope.getUserChallenges = function() {

        if (!$scope.username) $scope.username = $stateParams.id;

        else {
          $http.get(__BASEURL__ + '/api/userchallenges/' + $scope.username)
            .then((res) => {
              $scope.challenges = res.data;
            }, (err) => {
              if (err) return console.log(err);
            });
        }

      };

      $scope.getUserSolutions = function() {

        if (!$scope.username) $scope.username = $stateParams.id;

        else {
          $http.get(__BASEURL__ + '/api/usersolutions/' + $scope.username)
            .then((res) => {
              $scope.solutions = res.data;
            }, (err) => {
              if (err) return console.log(err);
            });
        }

      };


  }]);
};
