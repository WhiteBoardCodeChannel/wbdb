const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-http'));

process.env.MONGOLAB_URI = 'mongodb://localhost/app_dev_test';

const server = require(__dirname + '/../server.js');
const mongoose = require('mongoose');
const User = require(__dirname + '/../models/user.js');
const Challenge = require(__dirname + '/../models/challenge.js');
const baseUri = 'localhost:4000';

describe('challege routes', () => {

  before((done) => {
    this.server = server(4000, done);
  });

  before((done) => {
    var newUser = new User();
    newUser.authentication.email = 'wbdb@codefellows.com';
    newUser.hashPassword('password');
    newUser.save((err, data) => {
      if (err) console.log(err);
      this.testUser = data;
      this.userToken = data.generateToken();
      done();
    });
  });
  it('should be able to create a new post', (done) => {
    chai.request(baseUri)
      .post('/api/challenges')
      .set('authorization','Bearer ' + this.userToken)
      .send({ 'title': 'test challenge', 'question': 'test question' })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.title).to.eql('test challenge');
        expect(res.body.question).to.eql('test question');
        done();
      });
  });
  describe('rest requests that require a challenge already in db', () => {
    beforeEach((done) => {
      Challenge.create({
        title: 'test challenge',
        question: 'test question',
        userId: this.testUser._id
      }, (err, data) => {
        if (err) console.log(err);
        this.testChallenge = data;
        done();
      });
    });
    it('should be able to get all of a user\'s challenges', (done) => {
      chai.request(baseUri)
        .get('/api/challenges')
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(Array.isArray(res.body)).to.eql(true);
          expect(res).to.have.status(200);
          done();
        });
    });

    it('should be able to post a challenge', (done) => {
      chai.request(baseUri)
        .post('/api/challenges')
        .set('authorization','Bearer ' + this.userToken)
        .send({ title: 'post challenge', question: 'post question', userId: this.testUser._id })
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res.body.title).to.eql('post challenge');
          expect(res.body.question).to.eql('post question');
          expect(res).to.have.status(200);
          done();
        });
    });
    it('should be able to update a challenge', (done) => {
      chai.request(baseUri)
        .put(`/api/challenges/${this.testChallenge._id}`)
        .set('authorization','Bearer ' + this.userToken)
        .send({ title: 'Updated Title' })
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.msg).to.eql('Successfully Updated Challenge');
          done();
        });
    });
    it('should be able to delete a post', (done) => {
      chai.request(baseUri)
        .delete(`/api/challenges/${this.testChallenge._id}`)
        .set('authorization','Bearer ' + this.userToken)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.msg).to.eql('Successfully Deleted Challenge');
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
      Challenge.remove({}, (err) => {
        if (err) console.log(err);
        done();
      });
    });
  });
  after((done) => {
   mongoose.connection.db.dropDatabase(() => {
     done();
   });
  });

});
