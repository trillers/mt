var util = require('../../app/util');
var settings = require('mt-settings');
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

    router.get('/jssdk', function *(){
        yield this.render('jssdk');
    });

    router.get('/activity', baseAuthFilter, function *(){
        var id = this.query.id;
        var user = this.session.user || {};
        var activity = yield activityService.loadById(id);
        if(activity){
            activity.participateLink = this.protocol + '://' + settings.app.domain + '/participant?id=' + activity._id;
            activity.join = '';
            activity.joined = 'none';
            var participant = yield participantService.filter({conditions: {user: user.id}});
            if(participant.length > 0){
                activity.join = 'none';
                activity.joined = '';
            }
            var params = {
                conditions: {
                    activity: activity._id,
                    lFlg: 'a'
                },
                sort: {
                    total_money: -1
                },
                page: {
                    no: 1,
                    size: 10
                },
                populate: [
                    {
                        path: 'user'
                    }
                ]
            }
            var participants = yield participantService.filter(params);
            yield this.render('activity', {activity: activity, participants: participants});
        }else{
            yield this.render('error');
        }
    });

    router.get('/participant', baseAuthFilter, function *(){
        var id = this.query.id;
        var participant = yield participantService.loadById(id);
        if(participant){
            yield this.render('participant');
        }else{
            yield this.render('error');
        }
    });

    router.get('/join', userinfoAuthFilter, function *(){
        var id = this.query.id;
        var user = this.session.user || {};
        var activity = yield activityService.loadById(id);
        if(activity){
            yield this.render('join', {headimgurl: user.headimgurl, nickname: user.nickname, activityId: activity._id});
        }else{
            yield this.render('error');
        }
    });

};