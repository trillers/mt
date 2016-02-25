var Participant = require('../models/Participant').model;
var User = require('../../user/models/User').model;
var logger = require('../../../app/logging').logger;
var kv = require('../../activity/kvs/index').activity;

var util = require('util');

Service = {};

Service.create = function*(jsonData){
    var participant = new Participant(jsonData);
    var doc = yield participant.save();
    yield kv.addParticipantInRankingListAsync(doc.activity, doc.user, doc.total_money);
    logger.info('success create participant: ' + util.inspect(doc));
    return doc.toObject();
}

Service.updateById = function*(id, update, helpMoney){
    var doc = yield Participant.findByIdAndUpdate(id, update, {new: true}).lean().exec();
    yield kv.increaseParticipantScoreInRankingListAsync(doc.activity, doc.user, helpMoney);
    logger.info('success update participant by id: ' + id);
    return doc;
}

Service.update = function*(con, update){
    var res = yield Participant.update(con, update).exec();
    logger.info('success update participant by condition: ' + con);
    return res;
}

Service.loadById = function*(id){
    var doc = yield Participant.findById(id, {}, {lean: true}).populate({path: 'activity'}).populate({path: 'user'}).exec();
    logger.info('success load participant by id: ' + id);
    return doc;
}

Service.deleteById = function*(id){
    var doc = yield Participant.findByIdAndUpdate(id, {lFlg: 'd'}, {new: true}).lean().exec();
    logger.info('success delete participant by id: ' + id);
    return doc;
}

Service.loadAll = function*(){
    var docs = yield Participant.find({lFlg: 'a'}).lean().exec();
    logger.info('success load all participant');
    return docs;
}

Service.filter = function*(params){
    var query = Participant.find();

    if (params.options) {
        query.setOptions(params.options);
    }

    if (params.sort) {
        query.sort(params.sort);
    }

    if (params.page) {
        var skip = (params.page.no - 1) * params.page.size;
        var limit = params.page.size;
        if (skip) query.skip(skip);
        if (limit) query.limit(limit);
    }

    if (params.conditions) {
        query.find(params.conditions);
    }

    if (params.populate) {
        params.populate.forEach(function(item){
            query.populate(item);
        })
    }

    query.lean(true);
    var docs = yield query.exec();
    logger.info('success filter participant');

    return docs;
}

module.exports = Service;