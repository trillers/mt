var Participant = require('../models/Participant').model;
var User = require('../../user/models/User').model;
var logger = require('../../../app/logging').logger;
var util = require('util');

Service = {};

Service.create = function*(jsonData){
    var participant = new Participant(jsonData);
    var doc = yield participant.save();
    logger.info('success create participant: ' + util.inspect(doc));
    return doc.toObject();
}

Service.updateById = function*(id, update){
    var doc = yield Participant.findByIdAndUpdate(id, update, {new: true}).lean().exec();
    logger.info('success update participant by id: ' + id);
    return doc;
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

module.exports = Service;