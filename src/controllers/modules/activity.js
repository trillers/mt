var util = require('../../app/util');
var settings = require('mt-settings');
var baseAuthFilter = require('../../middlewares/base-auth-filter');
var userinfoAuthFilter = require('../../middlewares/userinfo-auth-filter');
var participantService = require('../../modules/activity/services/ParticipantService');
var activityService = require('../../modules/activity/services/ActivityService');
var _ = require('underscore');

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

    router.get('/voice', function *(){
        yield this.render('voice');
    });

    router.get('/activity', baseAuthFilter, function *(){
        var id = this.query.id;
        var user = this.session.user || {};
        var activity = yield activityService.loadById(id);
        if(activity && activity.lFlg === 'a'){
            activity.participateLink = this.protocol + '://' + settings.app.domain + '/join?id=' + activity._id;
            activity.join = '';
            activity.joined = 'none';
            var participant = yield participantService.filter({conditions: {user: user.id, activity: activity._id}});
            if(participant.length > 0){
                activity.join = 'none';
                activity.joined = '';
                this.redirect('/participant?id=' + participant[0]._id);
            }else {
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
                console.warn('**************************');
                console.error(activity);

                console.error(participants);
                yield this.render('activity', {activity: activity, participants: participants});
            }
        }else{
            yield this.render('error', {error: '活动暂未开放'});
        }
    });

    router.get('/participant', baseAuthFilter, function *(){
        var id = this.query.id;
        var user = this.session.user || {};
        var participant = yield participantService.loadById(id);
        if(participant && participant.activity.lFlg === 'a'){
            participant.participateLink = this.protocol + '://' + settings.app.domain + '/join?id=' + participant.activity._id;
            participant.join = '';
            participant.joined = 'none';
            participant.help = '';
            participant.helped = 'none';
            var docs = yield participantService.filter({conditions: {user: user.id}});
            if(docs.length > 0){
                participant.join = 'none';
                participant.joined = '';
            }
            var helpArr = participant.help_friends;
            if (_.indexOf(helpArr, user.wx_openid) !== -1) {
                participant.help = 'none';
                participant.helped = '';
            }
            if(user.wx_openid === participant.user.wx_openid){
                participant.join = 'none';
                participant.joined = 'none';
                participant.help = 'none';
                participant.helped = 'none';
                participant.inviteFriend = '';
            }else{
                participant.inviteFriend = 'none';
            }
            var params = {
                conditions: {
                    activity: participant.activity._id,
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
            yield this.render('participant', {participant: participant, participants: participants});
        }else{
            yield this.render('error', {error: '活动暂未开放'});
        }
    });

    router.get('/join', userinfoAuthFilter, function *(){
        var id = this.query.id;
        var user = this.session.user || {};
        console.error(user);
        if(user.wx_openid){
            var activity = yield activityService.loadById(id);
            if(activity){
                yield this.render('join', {headimgurl: user.headimgurl, nickname: user.nickname, activityId: activity._id});
            }else{
                yield this.render('error');
            }
        }else{
            yield this.render('error');
        }
    });

};