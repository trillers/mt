var assert = require('chai').assert;
var co = require('co');
var kv = require('../../../../src/modules/activity/kvs/index').activity;
var Participant  = require('../../../../src/modules/activity/models/Participant').model;


describe('move data', function(){
    before(function(done){
        setTimeout(function(){
            done();
        }, 2000);
    });

    describe('move data start', function(){
        it('succeed to move data', function(done){
            co(function*(){
                try{
                    var participants = yield Participant.find({activity: '1Tktai'}).exec();
                    console.info(participants.length);
                    for(var i=0; i<participants.length; i++){
                        yield kv.addParticipantInRankingListAsync(participants[i].activity, participants[i].user, participants[i].total_money);
                    }
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
