var util = require('../../app/util');
var baseAuthFilter = require('../../middlewares/base-auth-filter');
var userinfoAuthFilter = require('../../middlewares/userinfo-auth-filter');
var participantService = require('../../modules/activity/services/ParticipantService');
var activityService = require('../../modules/activity/services/ActivityService');

module.exports = function(router){
    require('../../app/routes-spa')(router);
    router.get('/clear', function *(){
        this.cookies.set('token', null, {maxAge: 1});
        this.session.authenticated = false;
        this.session['user'] = null;
        this.body = 'clear successful!!';
    });

    router.get('/activity', baseAuthFilter, function *(){
        var id = this.query.id;
        //var activity = yield activityService.loadById(id);
        //if(activity){
            yield this.render('activity');
        //}else{
        //    yield this.render('error');
        //}
    });

    router.get('/participant', userinfoAuthFilter, function *(){
        var id = this.query.id;
        var participant = yield participantService.loadById(id);
        if(participant){
            yield this.render('participant');
        }else{
            yield this.render('error');
        }
    });
};