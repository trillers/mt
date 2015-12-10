var util = require('../../app/util');
var baseAuthFilter = require('../../middlewares/base-auth-filter');
var userinfoAuthFilter = require('../../middlewares/userinfo-auth-filter');

module.exports = function(router){
    require('../../app/routes-spa')(router);
    router.get('/clear', function *(){
        this.cookies.set(this.tokenKey, null, {expires: 1});
        this.session.authenticated = false;
        this.session[this.userKey] = null;
        this.body = 'clear successful!!';
    });

    router.get('/activity', baseAuthFilter, function *(){
        yield this.render('activity');
    });

    router.get('/participate', userinfoAuthFilter, function *(){
        yield this.render('participate');
    });
};