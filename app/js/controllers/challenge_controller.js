
// we need to add code to handle if a user visits the view
// directly through an external link

module.exports = function(app) {
  app.controller('ChallengeController', ['$scope', '$http', 'Resource',
    '$stateParams', 'auth', ($scope, $http, Resource, $stateParams, auth) => {
      $scope.favoriteService = new Resource('/favorites');
      $scope.challengeService = new Resource('/challenges');
      $scope.currId = auth.getUserId();
      $scope.hints = [];

      $scope.challenge = $stateParams.challengeData;
      if (!$scope.challenge) {
        $scope.challengeService.getOne($stateParams.id, (err, data) => {
          if (err) return console.log(err);
          $scope.challenge = data;
        });
      }

      // check which button to show (either add/remove favorite)
      $scope.checkFavoritedOrNot = (function() {
        $scope.showAdd = true;
        $scope.favoriteService.getAll((err, res) => {
          if (err) return console.log(err);
          for (var i = 0; i < res.length; i++) {
            // check if user already favorited this challenge
            if ($scope.challenge._id === res[i]._id) {
              $scope.showAdd = false;
              break;
            }
          }
        });
      })();

      $scope.addFavorite = function() {
        $scope.showAdd = !$scope.showAdd;

        console.log($scope.currId);
        $scope.favoriteService
          .create({
            challengeId: $scope.challenge._id,
            userId: $scope.currId
          }, (err) => {
             if (err) console.log(err);
          });
      };

      $scope.removeFavorite = function() {
        $scope.showAdd = !$scope.showAdd;
        $scope.favoriteService
          .delete($scope.challenge, (err) => {
          if (err) return console.log(err);
        });
      };

      $scope.getNewHint = function() {
        // $scope.hints.push(challenge.hints[i]);
      };

  }]);
};
