const angular = require('angular');
require('angular-ui-router');
require('angular-aria');
require('angular-highlightjs');
const wbdbApp = angular.module('wbdbApp', ['ui.router', 'ngAria', 'hljs']);

require('./controllers')(wbdbApp);
require('./services')(wbdbApp, __BASEURL__);


wbdbApp.config(['$stateProvider', '$urlRouterProvider',
  ($stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.when('', '/');
    $urlRouterProvider.otherwise('/fourohfour');
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/home_view.html',
        controller: 'HomeController',
        authenticate: false
      })
      .state('challenge', {
        url: '/challenge/:id',
        templateUrl: 'views/challenge_view.html',
        controller: 'ChallengeController',
        params: { challengeData: null, id: { value: null, squash: false } },
        authenticate: false
      })
      .state('auth', {
        url: '/auth',
        templateUrl: 'views/auth_view.html',
        controller: 'AuthController',
        authenticate: true
      })
      .state('user', {
        url: '/user',
        templateUrl: 'views/user_view.html',
        controller: 'UserController',
        authenticate: true
      })
      .state('admin', {
        url: '/admin',
        templateUrl: 'views/admin_view.html',
        controller: 'AdminController',
        authenticate: true

      })
      .state('fourohfour', {
        url: '/fourohfour',
        templateUrl: 'views/fourohfour.html'
      });
}]).run(($rootScope, $location, auth, $timeout) => {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', (event, toState) => {
      console.log(toState);
      console.log(auth.token);
      if (toState.authenticate && !auth.token) {
        // $location.path('/auth');
        $timeout(() => {
            $location.path('/auth');
        });
        console.log('authenticate');
      }
    });
});
