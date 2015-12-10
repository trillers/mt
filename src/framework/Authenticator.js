var UserService = require('../modules/user/services/UserService');
var WechatUserService = require('../modules/user/services/WechatUserService');
var scopes = require('../modules/wechat/common/oauth').scopes;
var logger = require('../app/logging').logger;

var _extend = function(target, source){
    for (var key in source) {
        target[key] = source[key];
    }
    return target;
};
var defaults = {
    userKey: 'user', //session key of user info
    tokenKey: 'token', //cookie key of user authentication token
    agentKey: 'agent', ////cookie key of agent flags of authentication
    returnUrlKey: 'returnUrl', //session key of return url in session
    defaultReturnUrl: '/',
    callbackUri: '/auth/callback',
    signinUri: '/auth/signin',
    signoutUri: '/auth/signout',
    oauthClient: null //oauth client which need to be injected
};

var Authenticator = function(options){
    _extend(this, defaults);
    _extend(this, options||{});
};

Authenticator.prototype = {
    clearAuthentication: function(ctx){
        ctx.session && ctx.session.destroy();

        /*
         * TODO: set agent a flag to do not signin automatically
         *  but I don't code the flag logic
         */
        ctx.cookie(this.agentKey, '1', {maxAge: 3600000*24*366});
    },

    setAuthentication: function(ctx, userJson){
        ctx.cookie(this.tokenKey, userJson.token, {maxAge: 3600000*24*366}); //TODO
        ctx.session.authenticated = true;
        ctx.session[this.userKey] = userJson;
        return userJson;
    },

    redirectReturnUrl: function(ctx){
        var returnUrl = ctx.session[this.returnUrlKey];
        if(returnUrl){
            ctx.session[this.returnUrlKey] = null;
        }
        else{
            returnUrl = this.defaultReturnUrl;
        }
        logger.warn('redirect to return url: ' + returnUrl);
        ctx.redirect(returnUrl);
    },

    signin: function*(ctx, next){
        this.oauthAuthorize(ctx, next);
    },

    signout: function*(ctx, next){
        this.clearAuthentication(ctx);
        ctx.redirect(this.defaultReturnUrl);
    },

    oauthAuthorize: function(ctx, next){
        this.oauthClient.getAuthorizationCode(ctx, next);
    },

    oauthCallback: function*(ctx, next){
        console.error(this.oauthClient.scope);
        console.error('callback')
        if(this.oauthClient.scope === scopes.userinfo){
            this.oauthClient.exchangeAccessToken(ctx, next);
        }
        yield next;
    },

    afterLogin: function(userJson, next){
        next();
    },

    signUpOrIn: function*(ctx, next){
        console.error('$$$$$');
        console.error(ctx.oauth);
        var oauth = ctx.oauth;
        var authenticator = this;
        if(!oauth){
            logger.error('Fail to pass oauth authorization flow');
            yield ctx.render('error', {error: new Error('Fail to pass oauth authorization flow')});
            return;
        }

        return WechatUserService.createOrUpdateFromWechatOAuth(oauth)
            .then(function(userJson){
                var userInfo = authenticator.setAuthentication(ctx, userJson);
                authenticator.afterLogin(userInfo, function(){
                    authenticator.redirectReturnUrl(ctx);
                });
                return userJson;
            })
            .catch(Error, function*(err){
                logger.error('Fail to signup or signin with wechat oauth: ' + err);
                yield ctx.render('error', {error: err});
            });
    }
};

module.exports = Authenticator;