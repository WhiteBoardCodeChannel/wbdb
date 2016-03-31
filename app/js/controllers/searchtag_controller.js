module.exports = function(app) {
  app.controller('SearchTagController', ['$scope', '$location', '$http',
    '$stateParams', ($scope, $location, $http, $stateParams) => {

      $scope.solutions = [];
      $scope.challenges = [];

      $scope.tag = $stateParams.id;

      $scope.redirect = function(id) {
        $location.path('/challenge/' + id);
      };

      $scope.searchUser = function(user) {
        $location.path('/search/user/' + user);
      };

      $scope.searchTag = function(tag) {
        $location.path('/search/tag/' + tag);
      };

      $scope.getTagChallenges = function() {

        if (!$scope.tag) $scope.tag = $stateParams.id;

        else {
          $http.get(__BASEURL__ + '/api/tags/' + $scope.tag)
            .then((res) => {
              $scope.challenges = res.data;
              console.log($scope.challenges);
            }, (err) => {
              if (err) return console.log(err);
            });
        }

      };

  }]);
};
