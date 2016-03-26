module.exports = function(app) {
  app.controller('HomeController', ['$rootScope', '$scope', '$http',
    '$location', ($rootScope, $scope, $http, $location) => {
      $scope.search = '';
      $scope.published = [];
      $rootScope.loginPage = false;

      $scope.redirect = function(id) {
        $location.path('/challenge/' + id);
      };

      $scope.searchAuthor = function(username) {
        $location.path('/search/' + username);
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
