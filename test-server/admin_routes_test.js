const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-http'));

process.env.MONGOLAB_URI = 'mongodb://localhost/app_dev_test';

const server = require(__dirname + '/../server.js');
const mongoose = require('mongoose');
const User = require(__dirname + '/../models/user.js');
const Challenge = require(__dirname + '/../models/challenge.js');
const baseUri = 'localhost:4000';

describe('Admin Routes', () => {
  before((done) => {
    this.server = server(4000, done);
  });

  after((done) => {
    this.server.close(done);
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  describe('fail to login if user is not admin', () => {
    before((done) => {
      var notAdminUser = new User();
      notAdminUser. authentication.email = 'notadmin@codefellows.com';
      notAdminUser.hashPassword('password');
      notAdminUser.save((err, data) => {
        if (err) return console.log(err);
        this.noAdmin = data;
        this.adminToken = data.generateToken();
        done();
      });
    });

    it('should fail non-admin user to log in', (done) => {
      chai.request(baseUri)
        .get('/api/admin/challenges')
        .set('authorization', 'Bearer ' + this.adminToken)
        .end((err, res) => {
          expect(err).to.not.eql(null);
          expect(res).to.have.status(401);
          expect(res.body.msg).to.eql('Only admins are allows to do this!');
          done();
        });
    });
  });

  describe('Login as Admin', () => {
    beforeEach((done) => {
      var Admin = new User();
      Admin.authentication.email = 'admin@codefellows.com';
      Admin.authentication.isAdmin = true;
      Admin.hashPassword('password');
      Admin.save((err, data) => {
        if (err) return console.log(err);
        this.Admin = data;
        this.adminToken = data.generateToken();
        done();
      });
    });

    beforeEach((done) => {
      var noAdminUser = new User();
      noAdminUser.authentication.email = 'wbdb@codefellows.com';
      noAdminUser.hashPassword('password');
      noAdminUser.save((err, data) => {
        if (err) return console.log(err);
        this.noAdminUser = data;
        this.noAdminUserToken = data.generateToken();
        done();
      });
    });

    beforeEach((done) => {
      Challenge.create({
        title: 'test challenge',
        question: 'test question',
        userId: this.noAdminUser._id
      }, (err, data) => {
        if (err) return console.log(err);
        this.challenge = data;
        done();
      });
    });

    it('should show Challenges with unpublished', (done) => {
      chai.request(baseUri)
        .get('/api/admin/challenges')
        .set('authorization', 'Bearer ' + this.adminToken)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(Array.isArray(res.body)).to.eql(true);
          done();
        });
    });

    it('should publish a challenge', (done) => {
      chai.request(baseUri)
       .put(`/api/admin/${this.challenge._id}`)
       .set('authorization', 'Bearer ' + this.adminToken)
       .send({ published: true })
       .end((err, res) => {
         expect(err).to.eql(null);
         expect(res).to.have.status(200);
         expect(res.body.msg).to.eql('Successfully Published Challenge');
         done();
       });
    });

    it('should delete a challenge', (done) => {
      chai.request(baseUri)
        .delete(`/api/admin/${this.challenge._id}`)
        .set('authorization', 'Bearer ' + this.adminToken)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.msg).to.eql('Successfully Rejected Challenge');
          done();
        });
    });

  });

});
