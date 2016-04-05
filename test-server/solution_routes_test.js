const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-http'));

process.env.MONGOLAB_URI = 'mongodb://localhost/app_dev_test';

const server = require(__dirname + '/../server.js');
const mongoose = require('mongoose');
const User = require(__dirname + '/../models/user.js');
const Challenge = require(__dirname + '/../models/challenge.js');
const Solution = require(__dirname + '/../models/solution.js');
const baseUri = 'localhost:4000';

describe('solution routes', () => {

  before((done) => {
    this.server = server(4000, done);
  });

  before((done) => {
    var newUser = new User();
    newUser.authentication.email = 'wbdb@codefellows.com';
    newUser.hashPassword('password');
    newUser.save()
      .then((data) => {
        this.testUser = data;
        this.userToken = data.generateToken();
        return Challenge.create({
          title: 'test challenge',
          question: 'test question',
          userId: this.testUser._id
        });
      })
      .then((data) => this.testChallenge = data)
      .then(() => Solution.create({
        solution: 'test solution',
        challengeId: this.testChallenge._id,
        userId: this.testUser._id
      }))
      .catch((err) => err ? console.log(err) : null)
      .then(() => done());
  });

  after((done) => {
    this.server.close(done);
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  it('should be able to create a new solution', (done) => {
    chai.request(baseUri)
      .post('/api/solutions')
      .set('authorization', 'Bearer ' + this.userToken)
      .send({
        'solution': 'test solution',
        'userId': this.testUser._id,
        'challengeId': this.testChallenge._id
      })
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res).to.have.status(200);
        expect(res.body.userId).to.eql('' + this.testUser._id);
        expect(res.body.challengeId).to.eql('' + this.testChallenge._id);
        done();
      });
  });

  describe('rest requests that require a solution already in db', () => {
    before((done) => {
      Solution.create({
        challengeId: this.testChallenge._id,
        userId: this.testUser._id
      })
      .then((data) => this.testSolution = data)
      .catch((err) => err ? console.log(err) : null)
      .then(() => done());
    });

    it('should be able to get list of a user\'s solutions', (done) => {
      chai.request(baseUri)
        .get(`/api/usersolutions/${this.testUser._id}`)
        .set('authorization', 'Bearer ' + this.userToken)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(Array.isArray(res.body)).to.eql(true);
          expect(res).to.have.status(200);
          done();
        });
    });

    it('should be able to get a list of a challenge\'s solutions', (done) => {
      chai.request(baseUri)
        .get('/api/solutions/')
        .send({
          challengeId: this.testChallenge._id
        })
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(Array.isArray(res.body)).to.eql(true);
          expect(res).to.have.status(200);
          done();
        });
    });

    it('should be able to get a list of a challenge\'s published solutions',
      (done) => {
        chai.request(baseUri)
          .get(`/api/solutions/${this.testChallenge._id}`)
          .end((err, res) => {
            expect(err).to.eql(null);
            expect(Array.isArray(res.body)).to.eql(true);
            expect(res).to.have.status(200);
            done();
          });
    });

    it('should be able to edit a solution', (done) => {
      chai.request(baseUri)
        .post('/api/solutions')
        .set('authorization', 'Bearer ' + this.userToken)
        .send({
          'solution': 'edited test solution',
          'userId': this.testUser._id,
          'challengeId': this.testChallenge._id
        })
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          done();
        });
    });

    it('should be able to delete a solution', (done) => {
      chai.request(baseUri)
        .delete(`/api/challenges/${this.testSolution._id}`)
        .set('authorization', 'Bearer ' + this.userToken)
        .end((err, res) => {
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res.body.msg).to.eql('Successfully Deleted Challenge');
          done();
        });
    });
  });
});
