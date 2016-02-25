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
});
