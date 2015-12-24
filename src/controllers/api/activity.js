var activityService = require('../../modules/activity/services/ActivityService');

module.exports = function(router){
    router.post('/add', function *(){
        var json = {
            type:  this.request.body.type
            ,name: this.request.body.name
            ,shareTitle: this.request.body.shareTitle
            ,shareDesc: this.request.body.shareDesc
            ,shareImg: this.request.body.shareImg
            ,bgImg: this.request.body.bgImg
            ,base_lucky_money: this.request.body.base_lucky_money
            ,friend_help_count_limit: this.request.body.friend_help_count_limit
            ,startTime: new Date(this.request.body.startTime)
            ,endTime: new Date(this.request.body.endTime)
            ,friend_help_min_money: this.request.body.friend_help_min_money
            ,friend_help_max_money: this.request.body.friend_help_max_money
            ,rule: this.request.body.rule
            ,desc: this.request.body.desc
        }
        var data = yield activityService.create(json);
        this.body = data;
    });

    router.get('/load', function *(){
        var type = this.query.type;
        var data = yield activityService.loadAllByType(type);
        this.body = data;
    });
}

