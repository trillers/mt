var assert = require('chai').assert;
var service = require('../../../../src/modules/user/services/WechatUserService');
var co = require('co');

describe('wechat user service test', function () {
    before(function (done) {
        setTimeout(function () {
            done();
        }, 2000);
    })
    var base_oauth = {
        openid: 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE'
    }

    var userinfo_oauth = {
        access_token: 'OezXcEiiBSKSxW0eoylIeE8K-UCvPIM-GMcMRZOJk369nbKlLc_vKq--EcxVCYQOaR62wuEjX3PxckmSEyXg-__bKFIkQty7S9rsc3pJYKWwnPpDy3Oeipua0GWegvGIMuO8NVEHFg3d21Tsfsn2xg',
        expires_in: 7200,
        refresh_token: 'OezXcEiiBSKSxW0eoylIeE8K-UCvPIM-GMcMRZOJk369nbKlLc_vKq--EcxVCYQOhxYhWl_cCd4VJwk3eQO3ru-XmuLqonMKe992MGol33arj11e_jFOi7Z0tFeFH6Qn9_IBS36uyGZ8Fu8SYi_5lQ',
        openid: 'okvXqs4vtB5JDwtb8Gd6Rj26W6mE',
        scope: 'snsapi_userinfo',
        create_at: 1449736077315,
        nickname: '独自等待',
        sex: 1,
        language: 'en',
        city: '',
        province: '北京',
        country: '中国',
        headimgurl: 'http://wx.qlogo.cn/mmopen/CJ35Z2cnZA2r9iaUDwhRq0ic5oHTgXLallotFS8O5yEvdOglsSCe6icKk5ZlCmSM0JiarWme9yW0esKiaPRGLMABIAg/0',
        privilege: []
    }


    it('success createOrUpdateFromWechatOAuth throw base oauth', function (done) {
        co(function*() {
            var user = yield service.createOrUpdateFromWechatOAuth(base_oauth);
            yield service.deleteByOpenid(base_oauth.openid);
            assert.equal(user.stt, 'a');
            assert.equal(user.wx_openid, base_oauth.openid);
            done();
        })
    })

    it('success createOrUpdateFromWechatOAuth throw userinfo oauth', function (done) {
        co(function*() {
            var user = yield service.createOrUpdateFromWechatOAuth(userinfo_oauth);
            yield service.deleteByOpenid(userinfo_oauth.openid);
            assert.equal(user.stt, 'r');
            assert.equal(user.wx_openid, userinfo_oauth.openid);
            done();
        })
    })

    it('success upgrade user from base oauth user to userinfo oauth user', function (done) {
        co(function*() {
            var user = yield service.createOrUpdateFromWechatOAuth(base_oauth);
            assert.equal(user.stt, 'a');

            user = yield service.createOrUpdateFromWechatOAuth(userinfo_oauth);

            yield service.deleteByOpenid(userinfo_oauth.openid);
            assert.equal(user.stt, 'r');
            assert.equal(user.wx_openid, userinfo_oauth.openid);
            done();
        })
    })
});
