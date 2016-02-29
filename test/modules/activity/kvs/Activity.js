var assert = require('chai').assert;
var co = require('co');
var kv = require('../../../../src/modules/activity/kvs/index').activity;

describe('Activity Kvs', function(){
    before(function(done){
        setTimeout(function(){
            done();
        }, 2000);
    });

    var activityId = "A01";
    var participants = [
        {user: 'U001', score: 10},
        {user: 'U002', score: 20},
        {user: 'U003', score: 30}
    ];
    var powers = [
        {user: 'U001', score: 3},
        {user: 'U002', score: 2},
        {user: 'U003', score: 1}
    ];

    before(function(done){
        co(function*(){
            var affected = 0;
            var score = 0;
            var len = participants.length;
            try{
                for(var i=0; i<len; i++){
                    affected = yield kv.addParticipantInRankingListAsync(activityId, participants[i].user, participants[i].score);
                    console.info(affected);
                }

                for(var i=0; i<len; i++){
                    score = yield kv.increaseParticipantScoreInRankingListAsync(activityId, powers[i].user, powers[i].score);
                    console.info(score);
                }
                done();
            }
            catch(e){
                console.error(e);
                done();
            }
        });
    });
    describe('getRankingList', function(){
        it('succeed to get ranking list', function(done){
            co(function*(){
                try{
                    var list = yield kv.getRankingListAsync(activityId);
                    console.info(list);
                    done();
                }
                catch(e){
                    console.error(e);
                    done();
                }
            })
        });
    });

    describe('getParticipantListString and setParticipantListString', function(){
        var userMap = {
            '12G1Qm':
            {
                "_id": "12G1Qm",
                "crtOn": new Date(1450940997237),
                "lFlg": "a",
                "token": "81d786d1e8b2dca8cc3691960881ffd97356e068",
                "wx_openid": "okvXqs4vtB5JDwtb8Gd6Rj26W6mE",
                "wx_scope": "snsapi_base",
                "wx_at": "OezXcEiiBSKSxW0eoylIeE8K-UCvPIM-GMcMRZOJk369nbKlLc_vKq--EcxVCYQOd6xVSjSohxWLKA1DhcZzwx0AqD7a7IlTW07jpOozHjqCwzfZ7dtym3cUj4eaaZQAet8_FHbMSeVOUnhnh3iAEA",
                "wx_rt": "OezXcEiiBSKSxW0eoylIeE8K-UCvPIM-GMcMRZOJk369nbKlLc_vKq--EcxVCYQO2aKReEuJQ7ChSwGKtdBoCDhKn_lnRvYePPO9xmhF1a5d86ZCKHV0emqMTzPOEFTBKhpKLo7J-JAEH5eFeA0g0Q",
                "wx_privilege": "",
                "stt": "r",
                "_dv": 0,
                "wx_language": "en",
                "wx_city": "",
                "wx_province": "北京",
                "wx_country": "中国",
                "wx_sex": 1,
                "wx_headimgurl": "http://wx.qlogo.cn/mmopen/CJ35Z2cnZA2r9iaUDwhRq0ic5oHTgXLallotFS8O5yEvdOglsSCe6icKk5ZlCmSM0JiarWme9yW0esKiaPRGLMABIAg/0",
                "headimgurl": "http://wx.qlogo.cn/mmopen/CJ35Z2cnZA2r9iaUDwhRq0ic5oHTgXLallotFS8O5yEvdOglsSCe6icKk5ZlCmSM0JiarWme9yW0esKiaPRGLMABIAg/0",
                "wx_nickname": "独自等待",
                "nickname": "独自等待"
            },
            '12Pgjw':
            {
                "_id": "12Pgjw",
                "crtOn": new Date(1450944406454),
                "lFlg": "a",
                "token": "67690a2e7ae6e151412fc58c39d9d0c7d5f2bb86",
                "wx_openid": "okvXqsz8z-2OEczDOQvryayh8MpM",
                "wx_scope": "snsapi_base",
                "wx_at": "OezXcEiiBSKSxW0eoylIeE8K-UCvPIM-GMcMRZOJk34T7KApyVi0iJWobrJRiAkYq081EMg2C0sdH8Neox4FzhdVlRfHvHcCsNByzmZcVxsYA-rj2_jHmIahrp4oRdzX98Bmo2HIZfyrJN_DWGPpYw",
                "wx_rt": "OezXcEiiBSKSxW0eoylIeE8K-UCvPIM-GMcMRZOJk34T7KApyVi0iJWobrJRiAkYDtJyuPBST2ZuHShWwLb7Tzt4uvgpVZqWBw4wr1WgIOfDF2ZQoHzB8OxbxRiNbTNSOxpdgMFcZGw-ET_3mVls5g",
                "wx_privilege": "",
                "stt": "r",
                "_dv": 0,
                "wx_language": "zh_CN",
                "wx_city": "朝阳",
                "wx_province": "北京",
                "wx_country": "中国",
                "wx_sex": 1,
                "wx_headimgurl": "http://wx.qlogo.cn/mmopen/CyYbk1vmHvYCTpBHH4UiblYicHGnvIlsgC73khZkuwPjtvGAfHLWOa4mcpMaCWl4EM7DI9A9mbultAxXQuwYsxU7FD6R9nnEGr/0",
                "headimgurl": "http://wx.qlogo.cn/mmopen/CyYbk1vmHvYCTpBHH4UiblYicHGnvIlsgC73khZkuwPjtvGAfHLWOa4mcpMaCWl4EM7DI9A9mbultAxXQuwYsxU7FD6R9nnEGr/0",
                "wx_nickname": "Rupert",
                "nickname": "Rupert"
            }
    };

        var addJson = {
            "_id": "13NqBk",
            "crtOn": new Date(1451048470880),
            "lFlg": "a",
            "token": "afdfc31a33d01e149907a10746e114d712210da6",
            "wx_openid": "okvXqswFmgRwEV0YrJ-h5YvKhdUk",
            "wx_scope": "snsapi_userinfo",
            "wx_at": "OezXcEiiBSKSxW0eoylIeE8K-UCvPIM-GMcMRZOJk35OhPqhnK70YhuUvIHY3BqIghZqH1V7wUBkBuwP4i002HBhTfBvbpcBABnZ2HxgBHr8OPnnl6WU12-ay1OZRHzi0QUQOmELr9ySP9sc8G1otA",
            "wx_rt": "OezXcEiiBSKSxW0eoylIeE8K-UCvPIM-GMcMRZOJk35OhPqhnK70YhuUvIHY3BqIXWY5LWdFuOANmsyxqXey9vhrNtvASD58vvESwv5gj5-6a-X-RW-3He2QkP0L9Q0MMjKOFtbdvc0aGqHvDsVcWA",
            "wx_privilege": "",
            "stt": "r",
            "_dv": 0,
            "wx_language": "zh_CN",
            "wx_city": "南开",
            "wx_province": "天津",
            "wx_country": "中国",
            "wx_sex": 1,
            "wx_headimgurl": "http://wx.qlogo.cn/mmopen/WiaGzvINYibQIsdezmic0kKrPrcTFhFOYfzcfzzUFUkWwj3xwibxO5tiabxuwgRdStwG8sPfuNynfHDnY6vNuEbSqQg/0",
            "headimgurl": "http://wx.qlogo.cn/mmopen/WiaGzvINYibQIsdezmic0kKrPrcTFhFOYfzcfzzUFUkWwj3xwibxO5tiabxuwgRdStwG8sPfuNynfHDnY6vNuEbSqQg/0",
            "wx_nickname": "祺天大剩",
            "nickname": "祺天大剩"
        };

        it('succeed to get and set', function(done){
            co(function*(){
                try{
                    var userMapString = yield kv.getParticipantListStringAsync(activityId);
                    if(userMapString){
                        console.info('activity\'s list string exists:');
                        console.info(userMapString);
                        done();
                        return;
                    }

                    console.info('activity\'s list string is BLANK, load and set it now');
                    userMapString = JSON.stringify(userMap);
                    yield kv.setParticipantListStringAsync(activityId, userMapString);

                    userMapString = yield kv.getParticipantListStringAsync(activityId);
                    console.info('activity\'s list string is load and cached:');
                    console.info(userMapString);
                    done();
                }
                catch(e){
                    console.error(e);
                    done();
                }
            })
        });
    });

});
