var redis = require('../../../app/redis');
var logger = require('../../../app/logging').logger;
var _ = require('underscore');

var idToUserKey = function(id){
    return 'usr:id:' + id;
};

var tokenToIdKey = function(token){
    return 'usr:tk:' + token;
};

var openidToIdKey = function(openid){
    return 'usr:oid:' + openid;
};


var processUserToSave = function(sourceObject){
    var targetObject = _.clone(sourceObject);
    targetObject.crtOn && (delete targetObject.crtOn);
    targetObject.wx_subscribe_time && (delete targetObject.wx_subscribe_time);

    return targetObject;
};

var User = {

    loadById: function*(id){
        var key = idToUserKey(id);
        return yield redis.hgetallAsync(key)
    },

    saveById: function*(user){
        var key = idToUserKey(user.id);
        var userToSave = processUserToSave(user);
        return yield redis.hmsetAsync(key, userToSave);
    },

    deleteById: function*(id){
        var key = idToUserKey(id);
        return yield redis.delAsync(key);
    },

    loadIdByOpenid: function*(openid){
        var key = openidToIdKey(openid);
        return yield redis.getAsync(key);
    },

    linkOpenid: function*(openid, id){
        var key = openidToIdKey(openid);
        return yield redis.setAsync(key, id);
    },

    unlinkOpenid: function*(openid){
        var key = openidToIdKey(openid);
        return yield redis.delAsync(key);
    },

    loadIdByToken: function*(token){
        var key = tokenToIdKey(token);
        return yield redis.getAsync(key);
    },

    linkToken: function*(token, id){
        var key = tokenToIdKey(token);
        return yield redis.setAsync(key, id);
    },

    unlinkToken: function*(token){
        var key = tokenToIdKey(token);
        return yield redis.delAsync(key);
    },
};

module.exports = User;