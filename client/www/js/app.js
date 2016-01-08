angular.module('which', ['ionic', 'which.controllers', 'which.factory'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  //Main app state, contains the logic/views for the menu and login
  //Will be present on EVERY state
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  //State for viewing a single Which. ***THIS IS THE DEFAULT STATE***
  .state('app.which', {
    url: '/which',
    views: {
      'menuContent': {
        templateUrl: 'templates/which.html',
        controller: 'WhichCtrl'
      }
    }
  })

  //State for creating a Which.
  .state('app.create', {
    url: '/create',
    views: {
      'menuContent': {
        templateUrl: 'templates/create.html',
        controller: 'CreateCtrl'
      }
    }
  })

  //State for after a Which has been created. Provides confirmation to the user that the Which has been created.
  .state('app.afterCreate', {
    url: '/afterCreate',
    views: {
      'menuContent': {
        templateUrl: 'templates/afterCreate.html',
        controller: 'AfterCreateCtrl'
      }
    }
  })

  //State for viewing the results of a Which
  .state('app.result', {
    url: '/result',
    params: {
      a: null,
      b: null
    },
    views: {
      'menuContent': {
        templateUrl: 'templates/result.html',
        controller: 'ResultCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/which');
});
