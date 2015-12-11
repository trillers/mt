var assert = require('chai').assert;
var service = require('../../../../src/modules/activity/services/ActivityService');
var co = require('co');

describe('Activity Service Test', function(){
    before(function(done){
        setTimeout(function(){
            done();
        }, 2000);
    })
    var lmhJson = {
        type: 'flmh'
        ,name: '跟谁学红包助力'
        ,base_lucky_money: 100
        ,friend_help_count_limit: 200
        ,startTime: new Date()
        ,endTime: new Date()
        ,friend_help_min_money: 1
        ,friend_help_max_money: 2
        ,participants_count: 0
        ,rule: 'my rule'
        ,desc: 'this is a activity'
    }
    it('success create and delete delete activity', function(done){
        co(function*(){
            var data = yield service.create(lmhJson);
            console.log(data);
            assert.ok(data._id);
            assert.equal(data.name, lmhJson.name);
            data = yield service.deleteById(data._id);
            console.log(data.lFlg);
            assert.equal(data.lFlg, 'd');
            done();
        })
    })

    it('success update and load activity', function(done){
        co(function*(){
            var data = yield service.create(lmhJson);
            yield service.updateById(data._id, {base_lucky_money: 200});
            data = yield service.loadById(data._id);
            console.log(data.base_lucky_money);
            assert.equal(data.base_lucky_money, 200);
            yield service.deleteById(data._id);
            done();
        })
    })

    it('success load all activity by type', function(done){
        co(function*(){
            var data1 = yield service.create(lmhJson);
            var data2 = yield service.create(lmhJson);
            var docs = yield service.loadAllByType('flmh');
            console.log(docs);
            assert.equal(docs.length, 2);
            yield service.updateById(data1._id, {type: 'test'});
            docs = yield service.loadAllByType('flmh');
            assert.equal(docs.length, 1);
            yield service.deleteById(data1._id);
            yield service.deleteById(data2._id);
            done();
        })
    })
})
