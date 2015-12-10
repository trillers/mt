var WechatUserService = require('../modules/user/services/WechatUserService');
var scopes = require('../modules/wechat/common/oauth').scopes;
var logger = require('../app/logging').logger;

var _extend = function (target, source) {
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

var Authenticator = function (options) {
    _extend(this, defaults);
    _extend(this, options || {});
};

Authenticator.prototype = {
    clearAuthentication: function (ctx) {
        ctx.session && ctx.session.destroy();

        /*
         * TODO: set agent a flag to do not signin automatically
         *  but I don't code the flag logic
         */
        ctx.cookie(this.agentKey, '1', {maxAge: 3600000 * 24 * 366});
    },

    setAuthentication: function (ctx, userJson) {
        console.error('set auth info');
        ctx.cookies.set(this.tokenKey, userJson.token, {maxAge: 3600000 * 24 * 366}); //TODO
        ctx.session.authenticated = true;
        ctx.session[this.userKey] = userJson;
        return userJson;
    },

    redirectReturnUrl: function (ctx) {
        console.error('auth return');
        var returnUrl = ctx.session[this.returnUrlKey];
        console.error(returnUrl);
        if (returnUrl) {
            ctx.session[this.returnUrlKey] = null;
        }
        else {
            returnUrl = this.defaultReturnUrl;
        }
        logger.warn('redirect to return url: ' + returnUrl);
        ctx.redirect(returnUrl);
    },

    signin: function*(ctx, next) {
        this.oauthAuthorize(ctx, next);
    },

    signout: function*(ctx, next) {
        this.clearAuthentication(ctx);
        ctx.redirect(this.defaultReturnUrl);
    },

    oauthAuthorize: function (ctx, next) {
        this.oauthClient.getAuthorizationCode(ctx, next);
    },

    oauthCallback: function*(ctx, next) {
        console.error(this.oauthClient.scope);
        console.error('callback')
        console.error('exchange');
        yield this.oauthClient.exchangeAccessToken(ctx, next);
    },

    afterLogin: function (userJson, next) {
        next();
    },

    signUpOrIn: function*(ctx, next) {
        try {
            console.error('$$$$$');
            console.error(ctx.oauth);
            var oauth = ctx.oauth;
            var authenticator = this;
            if (!oauth) {
                logger.error('Fail to pass oauth authorization flow');
                yield ctx.render('error', {error: new Error('Fail to pass oauth authorization flow')});
                return;
            }

            var user = yield WechatUserService.createOrUpdateFromWechatOAuth(oauth);
            authenticator.setAuthentication(ctx, user);
            console.error('redirect start');
            authenticator.afterLogin(user, function () {
                authenticator.redirectReturnUrl(ctx);
            });
            return user;
        } catch (err) {
            logger.error('Fail to signup or signin with wechat oauth: ' + err);
            yield ctx.render('error', {error: err});
        }
    }
};

module.exports = Authenticator;