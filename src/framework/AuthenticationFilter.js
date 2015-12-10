var logger = require('../app/logging').logger;
var settings = require('mt-settings');
var scopes = require('../modules/wechat/common/oauth').scopes;

var _extend = function(target, source){
    for (var key in source) {
        target[key] = source[key];
    }
};
var defaults = {
    userKey: 'user', //session key of user info
    tokenKey: 'token', //cookie key of user authentication token
    returnUrlKey: 'returnUrl', //session key of return url in session
    signinUri: '/auth/signin',
    context: '/' //context path of the app
};

var AuthenticatonFilter = function(options){
    _extend(this, defaults);
    _extend(this, options||{});
};

AuthenticatonFilter.prototype = {
    authenticated: function(ctx, scope){
        var user = ctx.session && ctx.session[this.userKey];
        var token = ctx.cookies.get(this.tokenKey);
        if(user && !token){
            ctx.cookies.set(this.tokenKey, user.token, {maxAge: 3600000*24*366});
        }
        var ok = (user && user.stt == 'a' || user && user.stt == 'r');
        /**
         * If property stt is "r" which means formally registered user, and
         * session variable authenticated is true, treat the user as authenticated
         * and let the user go in.
         */
        if(scope === scopes.userinfo){
            ok = user && user.stt == 'r' && ctx.session.authenticated;
        }

        /**
         * If a user browser is PC browser, treat the user as formal user
         * and let the user go in.
         * This workaround is mainly to support web crawling and developer testing.
         */
        var mobile = ctx.browser && ctx.browser.Mobile;
        ok = ok || !mobile || settings.env.name=='dev';
        return ok;
    },

    saveReturnUrl: function(ctx){
        var returnUrl = ctx.protocol + '://' + ctx.get('host') + (this.context=='/' ? '' : this.context) + ctx.originalUrl;
        ctx.session && (ctx.session[this.returnUrlKey] = returnUrl);
        logger.debug('save return url to session: ' + returnUrl);
    },

    signin: function(ctx, scope){
        var url = this.signinUri + '?scope=' + scope;
        ctx.redirect(url); //TODO: need to use https scheme
    },

    filter: function*(ctx, scope, next){
        if(this.authenticated(ctx, scope)){
            yield next;
        }
        else{
            this.saveReturnUrl(ctx);
            this.signin(ctx, scope);
        }
    },

    genFilter: function(){
        return this.filter.bind(this);
    }
};

module.exports = AuthenticatonFilter;