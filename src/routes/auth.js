var settings = require('mt-settings');
var Authenticator = require('../framework/Authenticator');
var WeixinOAuthClient = require('../framework/WeixinOAuthClient');
var UserKV = require('../modules/user/kvs/User');
var WebHelper = require('../app/web');
var scopes = require('../modules/wechat/common/oauth').scopes;
var Router = require('koa-router');

module.exports = function(app){
    var auth_router = new Router()

    var weixinOAuthClient = new WeixinOAuthClient({
        appKey: settings.wechat.appKey,
        appSecret: settings.wechat.appSecret,
        getAccessToken: UserKV.getAccessToken,
        saveAccessToken: UserKV.saveAccessToken,
        state: 'seed',
        scope: scopes.base,
        redirectUrl: WebHelper.getBaseUrl(settings.app) + '/auth/callback'
    });

    var auth = new Authenticator({
        defaultReturnUrl: '/',
        signinUri: '/auth/signin',
        callbackUri: '/auth/callback',
        signoutUri: '/auth/signout',
        oauthClient: weixinOAuthClient //oauth client which need to be injected
    });

    auth_router.get(auth.signinUri, function*(){
        auth.oauthClient.scope = this.query.scope;
        yield auth.signin.call(auth, this);
    });
    auth_router.get(auth.signoutUri, function*(){
        yield auth.signout.call(auth, this);
    });
    auth_router.get(auth.callbackUri, function*(){
        yield auth.oauthCallback.call(auth, this);
    }, function*(){
        yield auth.signUpOrIn.call(auth, this);
    });

    app.use(auth_router.routes());
};