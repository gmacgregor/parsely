
var parsely = require('../parsely');
var should = require('should');

describe('parsely', function () {

    describe('configuration', function () {

        it('should have an api endpoint', function () {
            parsely.ROOT.should.equal('http://api.parsely.com');
        });

        it('should have an api version', function () {
            parsely.VERSION.should.equal('v2');
        });

        it('should have an api key', function () {
            parsely.KEYS.apikey.should.not.equal('');
        });

        it('should have a shared secret', function () {
            parsely.KEYS.secret.should.not.equal('');
        });

    });

    describe('api response', function () {

        it('should be wrapped in a data envelope', function (done) {
            parsely.get('/analytics/posts', function (response) {
                var data = JSON.parse(response).data;
                data.should.be.an.instanceOf(Object);
                done();
            });
        });

    });

});