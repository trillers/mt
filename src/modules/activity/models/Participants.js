var mongoose = require('../../../app/mongoose');
var DomainBuilder = require('../../../framework/model/DomainBuilder');

var schema = DomainBuilder
    .i('Participants')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        activity: {type: String, ref: 'Activity'}
        ,user: {type: String, ref: 'User'}
        ,total_money: {type: Number}
        ,help_friends: [{type: string}] //openid array
    })
    .build();


module.exports.schema = schema;
module.exports.model = schema.model(true);
