module.exports = function(app) {
  app.controller('HomeController', ['$rootScope', '$scope', '$http',
    '$location', ($rootScope, $scope, $http, $location) => {
      $scope.search = '';
      $scope.published = [];
      $rootScope.loginPage = false;

      $scope.redirect = function(id) {
        $location.path('/challenge/' + id);
      };

      $scope.searchUser = function(user) {
        $location.path('/search/user/' + user);
      };

      $scope.searchTag = function(tag) {
        $location.path('/search/tag/' + tag);
      };

      $scope.getPublished = function() {
        $http.get(__BASEURL__ + '/api/published')
          .then((res) => {
            $scope.published = res.data;
          }, (err) => {
            console.log(err);
          });
      };
  }]);
};
