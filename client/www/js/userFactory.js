/**
 * Created by VaibhavNamburi on 10/01/2016.
 */
angular.module('user.factory', [])

.factory('User', function($http, $state, $ionicHistory) {

  var loggedIn = false;

  var apiUrl = 'http://localhost:5007'

  /*
   * Sends login credentials from submit form to server
   * Based on response, function enables login session and sets token in localStorage
   * Setting historyRoot to true, creates a clean history path for current view
   */

  var login = function(credentials) {
    $http.post(apiUrl + '/api/user/login', credentials).then(function(response) {
      if (response.data.id !== undefined) {
        loggedIn = true;
        window.localStorage.setItem('which.userToken', response.data.id);
        $ionicHistory.nextViewOptions({
          historyRoot: true
        })
        $state.go('app.tagView');
      }
    })
  };

  /*
   * Sends signUp credentials from submit form to server
   */

  var signUp = function(credentials) {
    $http.post(apiUrl + '/api/user/signup', credentials).then(function(response) {
      if (response.data.id !== undefined) {
        loggedIn = true;
        window.localStorage['which.userToken'] = response.data.id;
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $state.go('app.tagView');
      }
    })
  };

  /*
   * Returns login status
   */

  var isloggedIn = function() {
    return loggedIn;
  }

  /*
   * Deletes current session on device
   */

  var signOut = function() {
    loggedIn = false;
    window.localStorage.removeItem('which.userToken');
    $state.go('app.login');
  };

  return {
    isloggedIn: isloggedIn,
    signUp: signUp,
    login: login,
    signOut: signOut
  }

});
