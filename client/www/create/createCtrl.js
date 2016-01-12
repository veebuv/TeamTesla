angular.module('which.controllers.create', ['which.factory', 'ionic.contrib.ui.tinderCards'])

.controller('CreateCtrl', function($scope, $state, WhichFactory) {
  //sets the options for the "Media Type" drop-down
  $scope.items = [{
    id: 1,
    label: 'Image'
  }, {
    id: 2,
    label: 'Text'
  }];

  $scope.data = {
    mediaType: $scope.items[0],
    question: '',
    thingA: '',
    thingB: '',
    tags: ''
  }

  //Submission of Which with input details
  $scope.submit = function() {

    var which = {
      question: $scope.data.question,
      createdBy: window.localStorage.getItem('which.userToken'),
      tags: $scope.data.tags.split(' '),
      type: $scope.data.mediaType.label.toLowerCase(),
      thingA: $scope.data.thingA,
      thingB: $scope.data.thingB
    }

    WhichFactory.submit(which);

    //Landing page after submission
    $state.go('app.afterCreate');
  }

  $scope.originalData = angular.copy($scope.data);

  $scope.$on('clear', function(event, state) {
    if (state === 'app.create')
      $scope.data = $scope.originalData;
  });

})
