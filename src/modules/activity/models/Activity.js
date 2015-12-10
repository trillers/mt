var mongoose = require('../../../app/mongoose');
var DomainBuilder = require('../../../framework/model/DomainBuilder');
var ActivityType = require('../../../common/models/TypeRegistry').item('ActivityType');

var schema = DomainBuilder
    .i('Activity')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        type: {type: String, enum: ActivityType.valueList(), require: true}
        ,name: {type: String, require: true}
        ,base_lucky_money: {type: Number}
        ,friend_help_count_limit: {type: Number}
        ,startTime: {type: Date}
        ,endTime: {type: Date}
        ,friend_help_min_money: {type: Number}
        ,friend_help_max_money: {type: Number}
        ,participants_count: {type: Number, default: 0}
        ,rule: {type: String}
        ,desc: {type: String}
    })
    .build();


module.exports.schema = schema;
module.exports.model = schema.model(true);
