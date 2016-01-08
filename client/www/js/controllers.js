angular.module('which.controllers', ['which.factory'])

.controller('AppCtrl', function($scope, $state, $ionicModal, $timeout) {

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.create = function() {
    $state.go('app.create');
  }

})

.controller('WhichCtrl', function($scope, $state, WhichFactory, $ionicHistory) {
  $scope.username = 'Me';

  //Defaults the slider to the second "Image" Where are currently hosting the question
  $scope.activeSlide = 1;

  //Probably only initially need id, question, thingA, thingB,
  //Demo object used during development
  $scope.which = {
    id: '1',
    question: " should I eat?",
    createdBy: 'Vornado',
    tags: ['chocolate', 'food'],
    type: 'image',
    thingA: 'http://cdn2.rosannadavisonnutrition.com/wp-content/uploads/2015/10/chocolate-chocolate-30471811-1024-768.jpg',
    thingB: 'http://weknowyourdreams.com/images/chocolate/chocolate-01.jpg',
    results: {
      aCount: 31,
      bCount: 25
    }
  }

  //Slider takes in an array, thus using the sandwich structure to display text between two images
  $scope.things = [$scope.which.thingA, $scope.which.question, $scope.which.thingB];

  //This gets called when the user swipes, making a decision with the choice from the user
  $scope.decide = function(choice) {
    var results = WhichFactory.choose(choice, $scope.which.id, $scope.username);


    //Prevent displaying back button on the landing view
    $ionicHistory.nextViewOptions({
      disableBack: true
    });

    //Allows for state change, showing new view, second argument is the params being sent in to display results
    $state.go('app.result', {
      a: results.a,
      b: results.b
    });
  }
})

.controller('ResultCtrl', function($scope, $state, $stateParams, WhichFactory, $ionicHistory) {

  $scope.a = $stateParams.a;
  $scope.b = $stateParams.b;

  //Function displays new which, calling the getNew factory function, and navigating to which page along with the newest which.
  $scope.getNewWhich = function() {
    var which = WhichFactory.getNew();

    $ionicHistory.nextViewOptions({
      disableBack: true
    });

    $state.go('app.which', {
      id: which.id,
      question: which.question,
      thingA: which.thingA,
      thingB: which.thingB
    });
  }
})

.controller('CreateCtrl', function($scope, $state, WhichFactory, $ionicHistory) {
  //sets the options for the "Media Type" drop-down
  $scope.items = [{
    id: 1,
    label: 'Image'
  }, {
    id: 2,
    label: 'Text'
  }];

  //Assign the first option from select tag
  $scope.mediaType = $scope.items[0];


  //Submission of Which with input details
  $scope.submit = function(type, question, a, b) {

    var which = {
      question: question,
      createdBy: 'anon', //TODO: change createdBy
      tags: [], //TODO: implement tags
      type: type.label.toLowerCase(),
      thingA: a,
      thingB: b
    }
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    WhichFactory.submit(which);

    //Landing page after submission
    $state.go('app.afterCreate');
  }

})

.controller('AfterCreateCtrl', function($scope, $state, WhichFactory, $ionicHistory) {

  //Load newest function after submission of previous which
  $scope.getNewWhich = function() {
    var which = WhichFactory.getNew();

    $ionicHistory.nextViewOptions({
      disableBack: true
    });

    $state.go('app.which', {
      id: which.id,
      question: which.question,
      thingA: which.thingA,
      thingB: which.thingB
    });
  };

  //Navigate to creation page via state change
  $scope.create = function() {
    $state.go('app.create');
  }

});
