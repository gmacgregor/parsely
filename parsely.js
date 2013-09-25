'use strict';

var request = require('request');
var querystring = require('querystring');
var _ = require('underscore');

/**
 * A simple function that wraps calls to the Parsely api.
 *
 * @env PARSELY_SECRET
 * @env PARSELY_API_KEY
 */
function Parsely() {
    this.ROOT = 'http://api.parsely.com';
    this.VERSION = 'v2';
    this.ENDPOINT = this.ROOT + '/' + this.VERSION;
    this.KEYS = {
        'secret': process.env.PARSELY_SECRET || '',
        'apikey': process.env.PARSELY_API_KEY || ''
    };
}

/**
 * Response body parsing helper
 *
 * @param  {String} responseBody
 * @return {Object}
 */
function chomp( responseBody ) {
    return JSON.parse(responseBody).data[0];
}

/**
 * Syntatic sugar for a GET request
 *
 * @param  {String}   path
 * @param  {Object}   options
 * @param  {Function} callback
 */
Parsely.prototype.get = function (path, options, callback) {
    this.request('GET', path, options, callback);
};

/**
 * Retrieve details about a given url, optionally
 * going back n days in time.
 *
 * @param  {String}   url
 * @param  {Num}   days
 * @param  {Function} callback
 * @return callback
 */
Parsely.prototype.postDetail = function (url, days, callback) {
    var self = this,
        opts = { 'url': url };
    if (days && typeof days !=='function') {
        _.extend({'days': days}, opts);
    } else {
        callback = days;
        days = null;
    }
    function addDetailShares( detail, shares ) {
        detail.shares = chomp(shares);
        return detail;
    }
    this.get('analytics/post/detail', opts, function ( body ) {
        var detail = chomp( body );
        self.postShares(url, function ( shareBody ) {
            addDetailShares( detail, shareBody );
            callback( detail );
        });
    });
};

/**
 * Get the share count for a given url
 *
 * @param  {String}   url
 * @param  {Function} callback
 */
Parsely.prototype.postShares = function (url, callback) {
    this.get('shares/post/detail', {'url': url}, callback);
};

/**
 * Realtime endpoiint call
 *
 * @param  {String}   type
 * @param  {Object}   options
 * @param  {Function} callback
 */
Parsely.prototype.realtime = function (type, options, callback) {
    this.get('realtime/' + type, options, callback);
};

/**
 * Issue a GET request to PATH ~with options
 *
 * @param  {String}   method
 * @param  {String}   path
 * @param  {Object}   options
 * @param  {Function} callback
 *
 */
Parsely.prototype.request = function (method, path, options, callback) {
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
            'method': method
        };
    request(requestOpts, function (error, response, body) {
        if (error) {
            callback(error);
            return;
        }
        callback(body);
    });
};

/**
 * Search endpoint call ~with options
 *
 * @param  {String}   query
 * @param  {Object}   options
 * @param  {Function} callback
 *
 */
Parsely.prototype.search = function (query, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = null;
    }
    this.get('search', _.extend({'q': query}, options), callback);
};

module.exports = Parsely;
