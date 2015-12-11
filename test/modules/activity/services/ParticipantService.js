var assert = require('chai').assert;
var service = require('../../../../src/modules/activity/services/ParticipantService');
var co = require('co');

describe('Participant Service Test', function(){
    before(function(done){
        setTimeout(function(){
            done();
        }, 2000);
    })
    var jsonData = {
        activity: 'abd1'
        ,user: 'user1'
        ,total_money: 300
        ,help_friends: ['openid1', 'openid2']
    }
    it('success create and delete delete participant', function(done){
        co(function*(){
            var data = yield service.create(jsonData);
            assert.ok(data._id);
            assert.equal(data.activity, jsonData.activity);
            data = yield service.deleteById(data._id);
            console.log(data.lFlg);
            assert.equal(data.lFlg, 'd');
            done();
        })
    })

    it('success update and load participant', function(done){
        co(function*(){
            var data = yield service.create(jsonData);
            yield service.updateById(data._id, {help_friends: ['openid1', 'openid2', 'openid3']});
            data = yield service.loadById(data._id);
            console.log(data.help_friends);
            assert.equal(data.help_friends.length, 3);
            yield service.deleteById(data._id);
            done();
        })
    })

    it('success load all participant', function(done){
        co(function*(){
            var data1 = yield service.create(jsonData);
            var data2 = yield service.create(jsonData);
            var docs = yield service.loadAll();
            assert.equal(docs.length, 2);
            yield service.deleteById(data1._id);
            yield service.deleteById(data2._id);
            done();
        })
    })
})
