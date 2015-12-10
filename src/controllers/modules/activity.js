var util = require('../../app/util');
var baseAuthFilter = require('../../middlewares/base-auth-filter');
var userinfoAuthFilter = require('../../middlewares/userinfo-auth-filter');

module.exports = function(router){
    require('../../app/routes-spa')(router);

    router.get('/activity', baseAuthFilter, function *(){
        console.log('******************');
        yield this.render('activity');
    });

    router.get('/participate', userinfoAuthFilter, function *(){
        console.log('&&&&&&&&&&&&&&&&&');
        yield this.render('participate');
    });
};