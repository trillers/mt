var mongoose = require('../../../app/mongoose');
var DomainBuilder = require('../../../framework/model/DomainBuilder');

var schema = DomainBuilder
    .i('Participant')
    .withBasis()
    .withLifeFlag()
    .withCreatedOn()
    .withProperties({
        activity: {type: String, ref: 'Activity'}
        ,user: {type: String, ref: 'User'}
        ,phone: {type: String}
        ,total_money: {type: Number}
        ,help_friends: [{type: String}] //openid array
    })
    .build();


module.exports.schema = schema;
module.exports.model = schema.model(true);
