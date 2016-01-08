/**
 * Created by VaibhavNamburi on 8/01/2016.
 */
angular.module('which.factory', [])

.factory('WhichFactory', function($http) {

  var serverURI = 'http://localhost:5007';

  /*
   * choose function is called after a decision has been made.
   * Sends an HTTP POST request to /api/which/{{id}}/judge.
   * TODO : Send a response back with the results object.
  **/
  var choose = function(choice, id, username) {
    //choice === a || b
    var uri = '/api/which/' + id + '/judge';
    return {
      a: 1,
      b: 1
    }
    // return $http.post(uri, {username: username, choice: choice})
    // .then(function (res) {
    //   return res.data;
    // }, function(err) {
    //   return err;
    // });
  }

  /*
   * getNew function is called to retrieve the next available which.
   * Sends an HTTP GET request to /api/which
  **/
  var getNew = function() {
    return {
      id: Math.floor(Math.random() * 100),
      question: " whatever",
      thingA: 'http://weknowyourdreams.com/images/chocolate/chocolate-01.jpg',
      thingB: 'http://cdn2.rosannadavisonnutrition.com/wp-content/uploads/2015/10/chocolate-chocolate-30471811-1024-768.jpg'
    }
    // return $http.get('/api/which')
    //  .then(function(res) {
    //    return res.data;
    //  }, function(err) {
    //    return err;
    //  });
  }

  /*
   * submit function is called to submit a new Which
   * Sends an HTTP POST request to /api/which
  **/
  var submit = function(which) {
    console.log(which);
     return $http.post(serverURI + '/api/which', which)
      .then(function(res) {
        return res.data;
      }, function(err) {
        return err;
      });
  }
  return {
    choose: choose,
    getNew: getNew,
    submit: submit
  }
});
