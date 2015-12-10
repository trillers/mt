var TypeRegistry = require('../../../framework/model/TypeRegistry');
var registry = new TypeRegistry('TypeRegistry', 'TypeRegistry', 'TypeRegistry');

registry
    .item('ActivityType', 'ActivityType', '活动类型')
    .addChild('FriendsLuckyMoneyHelp','flmh', '红包助力')

    //.up().item('IntegrationType', 'IntegrationType', '租户集成类型')
    //.addChild('Internal','i', '内部')
    //.addChild('External','e', '外部')


module.exports = registry;