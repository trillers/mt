var configureLocals = require('../middlewares/locals');
var configureWechat = require('../middlewares/wechat-configuring');

module.exports = function(router){
    router.use(configureLocals);
    router.use(configureWechat);
};
