var assert = require('chai').assert;
var kvs = require('../../../../src/modules/user/kvs/User');
var co = require('co');

describe('user kvs test', function () {
    before(function (done) {
        setTimeout(function () {
            done();
        }, 2000);
    })
    var user = {
        _id: 'test',
        id: 'test',
        openid: 'openid',
        token: 'token',
        nickname: 'sunny'
    }
    it('success save by id', function (done) {
        co(function*() {
            var res = yield kvs.saveById(user);
            console.log(res);
            assert.equal(res, 'OK');
            yield kvs.deleteById(user.id);
            done();
        })
    })

    it('success load by id', function (done) {
        co(function*() {
            yield kvs.saveById(user);
            var res = yield kvs.loadById(user.id);
            console.log(res);
            assert.equal(res.id, user.id);
            done();
        })
    })

    it('success delete by id', function (done) {
        co(function*() {
            yield kvs.saveById(user);
            var res = yield kvs.deleteById(user.id);
            console.log(res);
            assert.equal(res, 1);
            done();
        })
    })

    it('success load id by openid', function (done) {
        co(function*() {
            yield kvs.linkOpenid(user.openid, user.id);
            var res = yield kvs.loadIdByOpenid(user.openid);
            console.log(res);
            assert.equal(res, user.id);
            yield kvs.unlinkOpenid(user.openid);
            done();
        })
    })

    it('success link openid', function (done) {
        co(function*() {
            var res = yield kvs.linkOpenid(user.openid, user.id);
            console.log(res);
            assert.equal(res, 'OK');
            yield kvs.unlinkOpenid(user.openid);
            done();
        })
    })

    it('success unlink openid', function (done) {
        co(function*() {
            yield kvs.linkOpenid(user.openid, user.id);
            var res = yield kvs.unlinkOpenid(user.openid);
            console.log(res);
            assert.equal(res, 1);
            done();
        })
    })

    it('success load id by token', function (done) {
        co(function*() {
            yield kvs.linkToken(user.token, user.id);
            var res = yield kvs.loadIdByToken(user.token);
            console.log(res);
            assert.equal(res, user.id);
            yield kvs.unlinkToken(user.token);
            done();
        })
    })

    it('success link token', function (done) {
        co(function*() {
            var res = yield kvs.linkToken(user.token, user.id);
            console.log(res);
            assert.equal(res, 'OK');
            yield kvs.unlinkToken(user.token);
            done();
        })
    })

    it('success unlink token', function (done) {
        co(function*() {
            yield kvs.linkToken(user.token, user.id);
            var res = yield kvs.unlinkToken(user.token);
            console.log(res);
            assert.equal(res, 1);
            done();
        })
    })
});
