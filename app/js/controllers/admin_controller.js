module.exports = function(app) {
  app.controller('AdminController', ['$scope', '$http', 'Resource', ($scope, $http, Resource) => {
    console.log('AdminController loaded');
    $scope.adminService = new Resource('/admin');
    $scope.queue = [];

    $scope.getQueue = function() {
      console.log('Getting pending challenges');
      $scope.adminService.getAll((err, res) => {
        if (err) return console.log(err);
        $scope.queue = res;
      });
    };


  }]);
};
