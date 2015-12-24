var settings = require('mt-settings');
var logger = require('../app/logging').logger;
var token = require('../modules/wechat/common/token');
var jsApiList = ['checkJsApi','chooseImage','previewImage','uploadImage','downloadImage','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','getNetworkType'];

var env = settings.env.NODE_ENV;
var debug = env != 'production';

var wechatConfiguring = function*(next) {
    var url = this.protocol + '://' + this.get('host') + this.originalUrl;
    this.app || (req.app = {});
    this.app.env = env;
    this.app.debug = debug;
    try {
        var jsConfig = yield token.getJc({url: url, jsApiList: jsApiList, debug: debug});
        this.app.jc = jsConfig;
        this.state.__page.jc = jsConfig;
    }catch (err){
        logger.error('Fail to get jc: ' + err);
    }
    yield next;
};

module.exports = wechatConfiguring;