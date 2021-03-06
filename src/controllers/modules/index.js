var router = require('koa-router');
module.exports = function(app){
    //spa module
    var spa_router = new router();
    require('./spa')(spa_router);
    app.use(spa_router.routes());

    //activity module
    var activity_router = new router();
    require('./activity')(activity_router);
    app.use(activity_router.routes());

    //wechat
    app.use(require('./wechat')());
}