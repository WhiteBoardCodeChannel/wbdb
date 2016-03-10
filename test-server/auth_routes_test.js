const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-http'));

process.env.MONGOLAB_URI = 'mongodb://localhost/app_dev_test';

const server = require(__dirname + '/../server.js');
const mongoose = require('mongoose');
const User = require(__dirname + '/../models/user.js');
const baseUri = 'localhost:4000';

describe('the authorization route', () => {
  before((done) => {
    this.server = server(4000, done);
  });
describe('User Signup authentication Test: ', () => {
  it('should create a new user with a POST request', (done) => {
    chai.request(baseUri)
    .post('/api/signup')
    .send({
      'username': 'test',
      'email': 'test@example.com',
      'password': 'password',
      'confirmpassword': 'password'
    })
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('token');
      expect(res.body).to.have.property('msg');
      done();
    });
  });
  it('should fail to signup if user did not enter a email', (done) => {
    var invalidUser = {
      username: 'test',
      email: '',
      password: 'password',
      confirmpassword: 'password'
    };
    chai.request(baseUri)
    .post('/api/signup')
    .send(invalidUser)
    .end((err, res) => {
      expect(res).to.have.status(400);
      expect(res.body.msg).to.eql('Please enter an email');
      done();
    });
  });

  it('should fail to signup if user did not enter a valid email', (done) => {
    var invalidUser = {
      username: 'test',
      email: 'test@',
      password: 'password',
      confirmpassword: 'password'
    };
    chai.request(baseUri)
      .post('/api/signup')
      .send(invalidUser)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.msg).to.eql('Please enter a valid email');
        done();
      });
  });

  it('should fail to signup if user did not enter a username', (done) => {
    var invalidUser = {
      username: '',
      email: 'test@example.com',
      password: 'password',
      confirmpassword: 'password'
    };
    chai.request(baseUri)
      .post('/api/signup')
      .send(invalidUser)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.msg).to.eql('Please enter a user name');
        done();
      });
   });

   it('should fail to signup if user fail to enter a password > 7 charachters',
     (done) => {
       var invalidUser = {
         username: 'test',
         email: 'test@example.com',
         password: 'passw',
         confirmpassword: 'passw'
       };
       chai.request(baseUri)
         .post('/api/signup')
         .send(invalidUser)
         .end((err, res) => {
           expect(res).to.have.status(400);
           expect(res.body.msg).to
             .eql('Please enter a password longer than 7 characters');
           done();
         });
     });

     it('should be able to check whether the user already exist for signup',
       (done) => {
         var sameUser = {
           username: 'test',
           email: 'test@example.com',
           password: 'password',
           confirmpassword: 'password'
         };
          chai.request(baseUri)
            .post('/api/signup')
            .send(sameUser)
            .end((err, res) => {
              expect(res).to.have.status(400);
              expect(res.body.msg).to
                .eql('User already exists! Please use a different username');
              done();
            });
        });
  });

  describe('rest requests that require an existing user in the DB', () => {
    beforeEach((done) => {
      var newUser = new User();
      newUser.authentication.email = 'chris@gmail.com';
      newUser.hashPassword('password');
      newUser.save((err, data) => {
        if (err) console.log(err);
        this.userToken = data.generateToken();
        this.userId = data._id;
        done();
      });
    });
    it('should check if the user has valid credentials', (done) => {
      chai.request(baseUri)
        .get('/api/signin')
        .auth('chris@gmail.com', 'password')
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.property('msg');
          done();
        });
    });

    it('should not allow user to signin if it did not exist yet',
      (done) => {
        chai.request(baseUri)
          .get('/api/signin')
          .auth('nouser@gmail.com', '12345678')
          .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body.msg).to.eql('no user exists');
            done();
          });
      });

      it('should be able to avoid user to login if password is incorrect',
        (done) => {
          chai.request(baseUri)
            .get('/api/signin')
            .auth('chris@gmail.com', '12345679')
            .end((err, res) => {
              expect(res).to.have.status(401);
              expect(res.body.msg).to.eql('incorrect password');
              done();
            });
        });
   });

  after((done) => {
    this.server.close(done);
  });

  after((done) => {
    User.remove({}, (err) => {
      if (err) console.log(err);
      done();
    });
  });
  after((done) => {
   mongoose.connection.db.dropDatabase(() => {
     done();
   });
  });
});
