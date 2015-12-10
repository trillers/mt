var User = require('../models/User').model;
var UserHelper = require('../models/User').helper;
var UserState = require('../../../framework/model/enums').UserState;
var LifeFlag = require('../../../framework/model/enums').LifeFlag;
var UserKv = require('../kvs/User');
var settings = require('mt-settings');
var logger = require('../../../app/logging').logger;
var u = require('../../../app/util');
var wechat = require('../../wechat/common/api');
var Service = {};
var cbUtil = require('../../../framework/callback');

var generateUserToken = function(uid){
    var key = settings.secretKey;
    return require('crypto').createHash('sha1').update(String(uid)).update(key).digest('hex');
};

var createUser = function* (userInfo) {
    var user = new User(userInfo);
    var uid = user.autoId();
    user.token = generateUserToken(uid); //TODO: use token generator
    return yield user.save();
}

var updateUser = function*(id, update) {
    return yield User.update({_id: id}, update).exec();
};

var loadById = function*(id){
    return yield User.findById(id).exec();
};

var deleteById = function*(id){
    return yield yield User.update({_id: id}, {lFlg: LifeFlag.Deleted}).exec();
};

/**
 *  Create a user from wechat
 * @param user user json object
 * @param callback
 */
Service.createFromWechat = function*(userInfo) {
    if(userInfo.wx_nickname){
        userInfo.stt = UserState.Registered;
    }
    else{
        userInfo.stt = UserState.Anonymous;
    }
    var user = yield createUser(userInfo);
    user = UserHelper.getUserJsonFromModel(user);
    yield UserKv.saveById(user);
    yield UserKv.linkOpenid(user.wx_openid, user.id);
    yield UserKv.linkToken(user.token, user.id);
    return user;
};

Service.updateFromWechat = function*(id, update){
    var toUpdate = {};

    /*
     * Update stt properties
     */
    if(update.wx_nickname){
        toUpdate.stt = UserState.Registered;
    }
    else{
        toUpdate.stt = UserState.Anonymous;
    }

    /*
     * Remove undefined properties voiding update errors
     */
    for (var prop in update) {
        if(typeof update[prop] !== 'undefined'){
            toUpdate[prop] = update[prop];
        }
    }
    yield updateUser(id, toUpdate);
    var user = yield loadById(id);
    user = UserHelper.getUserJsonFromModel(user);
    yield UserKv.saveById(user);
    return user;
};

Service.deleteByOpenid = function*(openid){
    var id = yield UserKv.loadIdByOpenid(openid);
    var user = null;
    if(id){
        user = yield UserKv.loadById(id);
        yield UserKv.deleteById(id);
        if(user && user.wx_openid){
            yield UserKv.unlinkOpenid(user.wx_openid);
        }
        if(user && user.token){
            yield UserKv.unlinkToken(user.token);
        }
        yield deleteById(id);
    }
    return user;
};

Service.createOrUpdateFromWechatOAuth = function*(oauth){
    var newUserJson = null;
    var openid = oauth.openid;
    var id = yield UserKv.loadIdByOpenid(openid);
    var user = null;
    if(id){
        user = yield UserKv.loadById(id);
        newUserJson = UserHelper.mergeUserInfo(oauth, user);
        user = yield Service.updateFromWechat(id, newUserJson);
    }else{
        newUserJson = UserHelper.mergeUserInfo(oauth, {});
        user = yield Service.createFromWechat(newUserJson);
    }
    return user;
};

module.exports = Service;