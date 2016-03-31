module.exports = function(app) {
  app.controller('ChallengeController', ['$rootScope', '$scope', '$location',
  '$http', 'Resource', '$stateParams', 'auth', 'user', ($rootScope, $scope,
    $location, $http, Resource, $stateParams, auth, user) => {

      $scope.solutions = [];
      // $scope.hints = [];
      // $scope.tags = [];
      $scope.tags = [{ tag: 'Arrays' }, { tag: 'Strings' }, { tag: 'Trees' },
        { tag: 'Queues' }, { tag: 'Hash Tables' }, { tag: 'Recursion' },
        { tag: 'Stacks' }, { tag: 'Binary Trees' }, { tag: 'Linked Lists' },
        { tag: 'Graphs' }, { tag: 'Heaps' }, { tag: 'Sort' }, { tag: 'Search' }];
      $scope.newSolution = {};

      $scope.showSolutions = false;
      $scope.showSubmitForm = false;
      $scope.noSolutions = false;
      $scope.showTagForm = false;

      $scope.challengeService = new Resource('/challenges');
      $scope.solutionService = new Resource('/solutions');
      $scope.favoriteService = new Resource('/favorites');
      // $scope.hintService = new Resource('/hints');
      $scope.tagService = new Resource('/tags');

      $scope.currId = auth.getUserId();

      $scope.searchUser = function(user) {
        $location.path('/search/user/' + user);
      };

      $scope.searchTag = function(tag) {
        $location.path('/search/tag/' + tag);
      };

      $scope.getChallenge = function() {
        $scope.challenge = $stateParams.challengeData;
        if (!$scope.challenge) {
          $scope.challengeService.getOne($stateParams.id, (err, data) => {
            if (err) return console.log(err);
            $scope.challenge = data;
            $scope.checkFavoritedOrNot();
            $scope.getFavoriteCount();
            $scope.getAllSolutions();
          });
        }
      };

      $scope.checkFavoritedOrNot = function() {
        if (!$scope.currId) return;
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
      };

      $scope.getFavoriteCount = function() {
        var temp;
        if (!$scope.challenge) temp = $stateParams.id;
        else temp = $scope.challenge._id;
        $scope.favoriteService.getOne(temp, (err, res) => {
          if (err) return console.log(err);
          $scope.favCount = res;
        });
      };

      $scope.addFavorite = function() {
        $scope.showAdd = !$scope.showAdd;
        $scope.favoriteService
          .create({
            challengeId: $scope.challenge._id,
            userId: $scope.currId
          }, (err) => {
             if (err) console.log(err);
             $scope.getFavoriteCount();
          });
      };

      $scope.removeFavorite = function() {
        $scope.showAdd = !$scope.showAdd;
        $scope.favoriteService
          .delete($scope.challenge, (err) => {
          if (err) return console.log(err);
          $scope.getFavoriteCount();
        });
      };

      $scope.showButton = function() {
        $scope.showSolutions = true;
      };

      $scope.hideButton = function() {
        $scope.showSolutions = false;
      };

      $scope.showForm = function() {
        $scope.showSubmitForm = true;
      };

      $scope.hideForm = function() {
        $scope.showSubmitForm = false;
      };

      $scope.showTags = function() {
        $scope.showTagForm = true;
      };

      $scope.hideTags = function() {
        $scope.showTagForm = false;
      };

      $scope.getAllSolutions = function() {
        $scope.solutionService.getAllWithId($scope.challenge._id,
          (err, res) => {
            if (err) return console.log(err);
            $scope.solutions = res;
            var count = 1;
            $scope.solutions.forEach((solution) => {
              solution.count = count;
              count++;
            });
            if ($scope.solutions.length === 0) {
              $scope.noSolutions = true;
            } else {
              $scope.noSolutions = false;
            }
          });
      };

      $scope.getAllHints = function() {
        $scope.hintService.getAllWithId($scope.challenge._id,
          (err, res) => {
            if (err) return console.log(err);
            $scope.hints = res;
          });
      };

      $scope.getAllTags = function() {
        $scope.tagService.getAllWithId($scope.challenge._id,
          (err, res) => {
            if (err) return console.log(err);
            $scope.tags = res;
          });
      };

      $scope.publish = function() {
        $scope.challengeService.update({
          _id: $scope.challenge._id,
          published: true
        }, (err) => {
          if (err) return console.log(err);
          $location.path('/admin');
        });
      };

      $scope.submitSolution = function() {
        var currentDate = new Date();
        var options = {
          weekday: 'long', year: 'numeric', month: 'short',
          day: 'numeric', hour: '2-digit', minute: '2-digit'
        };

        user.getUser((err, res) => {
          if (err) return console.log(err);
          $scope.solutionService.create({
            solution: $scope.newSolution.solution,
            challengeId: $scope.challenge._id,
            createdOn: currentDate.toLocaleTimeString('en-us', options),
            userId: $scope.currId,
            author: res.username
            }, (err) => {
              if (err) return console.log(err);
              $scope.newSolution = null;
              $scope.showSubmitForm = false;
          });
        });
      };

  }]);
};
