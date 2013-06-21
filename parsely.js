'use strict';

var request = require('request');
var querystring = require('querystring');
var _ = require('underscore');

var REST_ROOT = 'http://api.parsely.com';
var VERSION = 'v2';

var parsely = function () {
    this.ENDPOINT = REST_ROOT + '/' + VERSION;
    this.KEYS = {
        'secret': process.env.PARSELY_SECRET || '',
        'apikey': process.env.PARSELY_API_KEY || ''
    };
};

parsely.prototype.get = function (path, options, callback) {
    this.request('GET', path, options, callback);
};
parsely.prototype.request = function (method, path, options, callback) {
    if (method !== 'GET') {
        throw new Error('parsely::request -- Unsupported method "' + method + '"\n');
    }
    if (typeof options === 'function') {
        callback = options;
        options = null;
    }
    var params = querystring.stringify(_.extend(this.KEYS, options)),
        uri = this.ENDPOINT + '/' + path,
        requestOpts = {
            'uri': uri + '?' + params,
            'method': method,
            'jar': false
        };
    request(requestOpts, function (error, response, body) {
        if (error) {
            callback(error);
        }
        callback(body);
    });
};

module.exports = parsely;
