var router = require('koa-router');

module.exports = function(app){
    //user module
    var user_router = new router();
    user_router.prefix('/api/user');
    require('./user')(user_router);
    app.use(user_router.routes());

    //activity module
    var activity_router = new router();
    activity_router.prefix('/api/activity');
    require('./activity')(activity_router);
    app.use(activity_router.routes());

    //participant module
    var participant_router = new router();
    participant_router.prefix('/api/participant');
    require('./participant')(participant_router);
    app.use(participant_router.routes());

    //file
    var file_router = new router();
    file_router.prefix('/api/file');
    require('./file')(file_router);
    app.use(file_router.routes());
}