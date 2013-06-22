'use strict';

var request = require('request');
var querystring = require('querystring');
var _ = require('underscore');

function parsely() {
    this.ROOT = 'http://api.parsely.com';
    this.VERSION = 'v2';
    this.ENDPOINT = this.ROOT + '/' + this.VERSION;
    this.KEYS = {
        'secret': process.env.PARSELY_SECRET || '',
        'apikey': process.env.PARSELY_API_KEY || ''
    };
}

parsely.prototype.get = function (path, options, callback) {
    this.request('GET', path, options, callback);
};

parsely.prototype.request = function (method, path, options, callback) {
    if (method !== 'GET') {
        throw new Error('Unsupported method: ' + method + '\n');
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

parsely.prototype.postDetail = function (url, days, callback) {
    if (typeof days === 'function') {
        callback = days;
        days = null;
    }
    var opts = {
        'url': url,
        'days': days
    };
    this.get('analytics/post/detail', opts, callback);
};


parsely.prototype.search = function (query, callback) {
    this.get('search', {'q': query}, callback);
};

module.exports = new parsely();
