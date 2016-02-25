var Promise = require('bluebird');

var Activity = require('./Activity');
module.exports.activity = Promise.promisifyAll(new Activity());