var request = require('request');
var querystring = require('querystring');
var _ = require('underscore');

var api = {
    endpoint: 'http://api.parsely.com/v2/',
    config: {
        'secret': process.env.PARSELY_SECRET || '',
        'apikey': process.env.PARSELY_API_KEY || ''
    }
};

function url (path, options) {
    var params = querystring.stringify(_.extend(api.config, options));
    return api.endpoint + path + '?' + params;
}

exports.fetch = function (path, options, callback) {
    var parsely_endpoint = url(path, options);
    console.log(parsely_endpoint);
    request(parsely_endpoint, function (error, response, body) {
        if (error) {
            callback(error);
        } else {
            callback(body);
        }
    });
};