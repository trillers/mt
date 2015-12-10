var AuthenticationFilter = require('../framework/AuthenticationFilter');
var scopes = require('../modules/wechat/common/oauth').scopes;

var filter = new AuthenticationFilter({
    context: '/' //TODO
});

var filterFn = function*(next){
    yield filter.filter.call(filter, this, scopes.userinfo, next);
}

module.exports = filterFn;
