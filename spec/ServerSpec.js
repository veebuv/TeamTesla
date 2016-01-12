process.env.NODE_ENV = 'test'; // disable morgan

var request  = require('supertest'),
    expect   = require('chai').expect,

    server   = require('../server/server.js'),
    Which    = require('../server/which/whichModel.js'),
    User     = require('../server/user/userModel.js');



/* * * * * * * * * * * * * POST ROUTES * * * * * * * * * * * * * */

describe('POST routes', function() {

  before('Ensure test user does not exist', function(done) {
    User.find({username: 'Vornado'})
    .remove(function(err, dbResults){
      done();
    });
  });

  after('Remove test user', function(done) {
    User.find({username: 'Vornado'})
    .remove(function(err, dbResults){
      done();
    });
  });

  describe('/api/user', function(){
    var results;
    var username = 'Vornado';
    var password = 'webstorm4eva';
    var newUser  = {username: username, password: password};
    var badUser  = {username: username, password: password+'b'};

    describe('POST /api/user/signup', function() {
      it('Should respond with 201 when creating a new user', function(done){
        request(server.app)
          .post('/api/user/signup')
          .send(newUser)
          .expect(201)
          .end(done)
      });
      it('Should respond with 409 when posted username already exists', function(done){
        request(server.app)
          .post('/api/user/signup')
          .send(newUser)
          .expect(409)
          .end(done);
      });
    });

    describe('POST /api/user/login', function() {
      it('Should respond with 200 posting valid credentials', function(done){
        request(server.app)
          .post('/api/user/login')
          .send(newUser)
          .expect(200)
          .end(done);
      });
      it('Should respond with 401 when posting invalid credentials', function(done){
        request(server.app)
          .post('/api/user/login')
          .send(badUser)
          .expect(401)
          .end(done);
      });
    });
  });

  describe('POST /api/which', function(){

    var newWhich = {
      'question': 'Which to use?',
      'createdBy': 'J4XmZ8uV',
      'type': 'string',
      'tags': ['programming'],
      'thingA': 'WebStorm',
      'thingB': 'Sublime Text'
    }

    after('Remove test which', function(done) {
      Which.find({createdBy: 'J4XmZ8uV'})
      .remove(function(err, dbResults){
        done();
      });
    });

    it('Should respond with 201 creating a new Which', function(done){
      request(server.app)
        .post('/api/which')
        .send(newWhich)
        .expect(201)
        .end(done);
    });
  });
});




/* * * * * * * * * * * * * GET ROUTES * * * * * * * * * * * * * */

describe('GET routes', function() {
  describe('GET /api/which', function() {

    var results; // use same results for several tests

    before('Create test whiches', function(done) {
      // artificially insert old Dates to test retrieval order (oldest first)
      // artificially insert votesFrom to test retrieving only un-judged Whiches
      var which1 = {question: 'Which first?',  createdBy: 'J4XmZ8uV',
                   votesFrom: ['Brendan'], createdAt: new Date(100)};
      var which2 = {question: 'Which second?', createdBy: 'J4XmZ8uV',
                   votesFrom: [],          createdAt: new Date(200)};
      var which3 = {question: 'Which third?',  createdBy: 'zzJ4XmZ8uV',
                   votesFrom: ['Brendan'], createdAt: new Date(300)};

      Which(which1)
        .save()
        .then(function(){
          return Which(which2).save();
        })
        .then(function(){
          return Which(which3).save();
        })
        .then(function(){
          request(server.app)
            .get('/api/which')
            .end(function(err, serverResponse){
              if (err) throw err;
              results = serverResponse.body;
              done();
            });
        })
        .catch(function(err){
          throw err;
        });
    });

    after('Cleanup test whiches', function(done){
      Which.find({createdBy: 'zzJ4XmZ8uV'}).remove(function(err, dbResults){
        Which.find({createdBy: 'J4XmZ8uV'}).remove(function(err, dbResults){
          done();
        });
      });
    })

    it('Should return an array', function(done){
      expect(Array.isArray(results)).to.be.true;
      done();
    });

    it('Returned array should contain Which objects', function(done){
      expect( results[0].hasOwnProperty('thingA') ).to.be.true;
      done();
    });

    it('Returned array should by default contain only one Which', function(done){
      expect( results.length ).to.equal(1);
      done();
    });

    it('Returned Whiches should be ordered by createdAt property, starting from the oldest', function(done){
      request(server.app)
        .get('/api/which?resultLimit=3')
        .end(function(err, serverResponse){
          if (err) throw err;
          var results = serverResponse.body;
          expect( results[0].question ).to.equal('Which first?');
          expect( results[1].question ).to.equal('Which second?');
          expect( results[2].question ).to.equal('Which third?');
          done();
        });
    });

    it('If ?userID= is provided, should not return Whiches created by the specified user', function(done){
      request(server.app)
        .get('/api/which?userID=J4XmZ8uV')
        .end(function(err, serverResponse){
          if (err) throw err;
          var results = serverResponse.body;
          expect( results[0].createdBy ).to.not.equal('J4XmZ8uV');
          done();
        });
    });

    it('If ?userID= is provided, should only return Whiches the specified user has not yet judged', function(done){
      request(server.app)
        .get('/api/which?userID=Brendan')
        .end(function(err, serverResponse){
          if (err) throw err;
          var results = serverResponse.body;
          expect( results[0].votesFrom.indexOf('Brendan') ).to.equal(-1);
          done();
        });
    });

    it('If ?createdBy= is provided, should only return Whiches created by the specified user ', function(done){
      request(server.app)
        .get('/api/which?createdBy=zzJ4XmZ8uV')
        .end(function(err, serverResponse){
          if (err) throw err;
          var results = serverResponse.body;
          expect( results[0].question ).to.equal('Which third?');
          done();
        });
    });

    it('If ?resultLimit= is provided, should return an appropriate number of results', function(done){
      request(server.app)
        .get('/api/which?resultLimit=2')
        .end(function(err, serverResponse){
          if (err) throw err;
          var results = serverResponse.body;
          expect( results.length ).to.equal(2);
          done();
        });
    });


  });
});
