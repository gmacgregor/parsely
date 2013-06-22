
var parsely = require('../parsely');
var should = require('should');

describe('parsely', function () {

    describe('configuration', function () {

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

});