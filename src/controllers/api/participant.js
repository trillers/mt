var participantService = require('../../modules/activity/services/ParticipantService');
var activityService = require('../../modules/activity/services/ActivityService');
var util = require('../../app/util');
var _ = require('underscore');

module.exports = function (router) {
    router.post('/add', function *() {
        var id = this.request.body.id;
        var activity = yield activityService.loadById(id);
        if (activity) {
            var json = {
                activity: id
                , user: this.session.user.id
                , phone: this.request.body.phone
                , total_money: activity.base_lucky_money
                , help_friends: []
            }
            var data = yield participantService.create(json);
            this.body = data;
        } else {
            this.body = {error: 'no such activity'};
        }
    });

    router.post('/help', function *() {
        var id = this.request.body.id;
        var user = this.session.user;
        var today = new Date();
        var participant = yield participantService.loadById(id);
        if (participant) {
            var active = date >= new Date(participant.activity.startTime) && date <= new Date(participant.activity.endTime);
            if(active) {
                var helpArr = participant.help_friends;
                if (_.indexOf(helpArr, user.wx_openid) === -1) {
                    if (helpArr.length < participant.activity.friend_help_count_limit) {
                        helpArr.push(user.wx_openid);
                        var min = participant.activity.friend_help_min_money || 0;
                        var max = participant.activity.friend_help_max_money || 0;
                        var helpMoney = util.random(min, max);
                        var total_money = participant.total_money + helpMoney;
                        var update = {
                            total_money: total_money,
                            help_friends: helpArr
                        }
                        var data = yield participantService.updateById(participant._id, update);
                        this.body = data;
                    } else {
                        this.body = {limited: true};
                    }
                } else {
                    this.body = {helped: true};
                }
            }else{
                this.body = {active: false};
            }
        } else {
            this.body = {error: 'no such participant'};
        }
    });
}