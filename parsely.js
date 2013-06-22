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

parsely.prototype.postDetail = function (url, days, callback) {
    if (typeof days === 'function') {
        callback = days;
        days = null;
    }
    var self = this,
        opts = {
            'url': url,
            'days': days
        };
    this.get('analytics/post/detail', opts, function (body) {
        var detail = JSON.parse(body).data[0];
        self.postShares(url, function (shareBody) {
            var shares = JSON.parse(shareBody).data[0];
            detail.shares = shares;
            callback(detail);
        });
    });
};

parsely.prototype.postShares = function (url, callback) {
    this.get('shares/post/detail', {'url': url}, callback);
};

parsely.prototype.realtime = function (type, options, callback) {
    this.get('realtime/' + type, options, callback);
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

parsely.prototype.search = function (query, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = null;
    }
    this.get('search', _.extend({'q': query}, options), callback);
};

module.exports = new parsely();
