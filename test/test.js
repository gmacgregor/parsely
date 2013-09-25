
var Parsely = require('../parsely');
var should = require('should');

describe('parsely', function () {

    var parsely;

    before(function () {
        parsely = new Parsely();
    });

    it('should have an endpoint', function () {
        parsely.ROOT.should.equal('http://api.parsely.com');
    });

    it('should be version v2', function () {
        parsely.VERSION.should.equal('v2');
    });

    it('should have an api key', function () {
        parsely.KEYS.apikey.should.not.equal('');
    });

    it('should have a shared secret', function () {
        parsely.KEYS.secret.should.not.equal('');
    });

    describe('response', function () {

        it('should be wrapped in a data envelope', function (done) {
            parsely.get('/analytics/posts', function (response) {
                var envelope = JSON.parse(response);
                envelope.should.ownProperty('data');
                done();
            });
        });


    });

    describe('search helper', function () {

        it('can accept options', function (done) {
            var opts = {page: 1, limit: 1};
            parsely.search('Canada', opts, function (response) {
                JSON.parse(response).should.ownProperty('data');
            });
            done();
        });

        it('options should be optional', function (done) {
            parsely.search('Canada', function (response) {
                JSON.parse(response).should.ownProperty('data');
            });
            done();
        });
    });

});