var WechatOAuth = require('wechat-oauth');
var Promise = require('bluebird');
var util = require('util');
var logger = require('../app/logging').logger;
var request = require('request');
var scopes = require('../modules/wechat/common/oauth').scopes;
var languages = require('../modules/wechat/common/oauth').languages;
var errorUtil = require('../modules/wechat/common/error');

var defaultConfig = {
    appKey: '', //the client id in oauth2, which needs to be applied from service provider
    appSecret: '', //the client secret in oauth2, which needs to be applied from service provider
    getAT: null, //
    saveAT: null,//
    state: 'seed',
    scope: scopes.base,
    redirectUrl: ''//the client side url which is used to return after logout from service provider side
};

var _extend = function (target, source) {
    for (var key in source) {
        target[key] = source[key];
    }
    return target;
};

var generateRequestUserAsync = function(client){
    var fn = function(openid, callback){
        var options = {
            openid: openid,
            lang: languages.zh_CN
        };
        client.getUser(options, function(err, result){
            if(err){
                if(callback) callback(err);
            }
            else{
                if(callback) callback(null, result);
            }
        });
    };
    return Promise.promisify(fn);
};

/**
 *
 * @param options
 *  appKey
 *  appSecret
 *  getAccessToken
 *  saveAccessToken
 *  redirectUrl
 *  state
 *  scope snsapi_userinfo
 * @constructor
 */
var WeixinOAuthClient = function (options) {
    options = options || {};
    _extend(this, options);
    if(this.getAT && this.saveAT){
        this.wo = new WechatOAuth(this.appKey,this.appSecret, this.getAT, this.saveAT);
    }
    else{
        this.wo = new WechatOAuth(this.appKey,this.appSecret);
    }
    Promise.promisifyAll(this.wo);
    this.wo.requestUserAsync = generateRequestUserAsync(this.wo);
};

_extend(WeixinOAuthClient.prototype, defaultConfig);

WeixinOAuthClient.prototype.getAuthorizeUrl = function () {
    //if(!this.authorizeUrl){
        this.authorizeUrl = this.wo.getAuthorizeURL(this.redirectUrl, this.state, this.scope);
    //}
    return this.authorizeUrl;
};

WeixinOAuthClient.prototype.getAuthorizationCode = function (ctx) {
    ctx.redirect(this.getAuthorizeUrl());
};

WeixinOAuthClient.prototype.exchangeAccessToken = function*(ctx, next) {
    try {
        var state = ctx.query.state;
        var code = ctx.query.code;
        var client = this.wo;
        if (this.state != state) {
            yield ctx.render('error', {error: new Error('Wechat oauth exchange access token: echo state is different')});
            return;
        }

        var result = yield client.getAccessTokenAsync(code);
        ctx.oauth = result.data;
        if(scopes.userinfo == ctx.oauth.scope) {
            var user = yield client.requestUserAsync(ctx.oauth.openid);
            if (ctx.oauth != user) {
                _extend(ctx.oauth, user);
            }
        }
        yield next;
    }catch(err){
        logger.error('Fail to signup or signin with wechat oauth: ' + err);
        yield ctx.render('error', {error: err});
    }
};

WeixinOAuthClient.prototype.logout = function* () {};

module.exports = WeixinOAuthClient;
