var activityService = require('../../modules/activity/services/ActivityService');
var participantService = require('../../modules/activity/services/ParticipantService');
var nodeExcel = require('excel-export');

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
        //var type = this.query.type;
        var data = yield activityService.loadAll();
        this.body = data;
    });

    router.get('/loadById', function *(){
        var id = this.query.id;
        var data = yield activityService.loadById(id);
        this.body = data;
    });

    router.post('/update', function *(){
        var id = this.request.body.id;
        var json = {
            name: this.request.body.name
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
        var data = yield activityService.updateById(id, json);
        this.body = data;
    });

    router.get('/exportParticipants', function*(){
        var activity_id = this.query.id;
        var conf ={};

        conf.rows = [];
        var params = {
            conditions: {
                activity: activity_id
            },
            populate:[{
                path: 'user'
            },{
                path: 'activity'
            }]
        }
        var participants = yield participantService.filter(params);
        if(participants[0].activity.type === 'flmh'){
            conf.cols = [{
                caption:'活动名称',
                type:'string',
                width:40
            },{
                caption:'报名昵称',
                type:'string',
                width:40
            },{
                caption:'报名电话',
                type:'string',
                width:40
            },{
                caption:'红包金额',
                type:'number',
                width:40
            }];
        }else{
            conf.cols = [{
                caption:'活动名称',
                type:'string',
                width:40
            },{
                caption:'报名昵称',
                type:'string',
                width:40
            },{
                caption:'报名电话',
                type:'string',
                width:40
            },{
                caption:'总积分',
                type:'number',
                width:40
            }];
        }
        participants.forEach(function(item){
            conf.rows.push([item.activity.name, item.user.nickname, item.phone, item.total_money]);
        });
        var result = nodeExcel.execute(conf);
        var data = yield activityService.loadById(activity_id);
        var activity_name = '报名数据';
        if(data){
            activity_name = data.name
        }
        this.set('Content-Type', 'application/vnd.openxmlformats');
        this.set("Content-Disposition", "attachment; filename=" + encodeURIComponent(activity_name) + ".xlsx");
        this.body = new Buffer(result, 'binary');
    });

}

