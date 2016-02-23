var Activity = require('../models/Activity').model;
var logger = require('../../../app/logging').logger;
var util = require('util');

Service = {};

Service.create = function*(jsonData){
    var activity = new Activity(jsonData);
    var doc = yield activity.save();
    logger.info('success create activity: ' + util.inspect(doc));
    return doc.toObject();
}

Service.updateById = function*(id, update){
    var doc = yield Activity.findByIdAndUpdate(id, update, {new: true}).lean().exec();
    logger.info('success update activity by id: ' + id);
    return doc;
}

Service.loadById = function*(id){
    var doc = yield Activity.findById(id, {}, {lean: true}).exec();
    logger.info('success load activity by id: ' + id);
    return doc;
}

Service.deleteById = function*(id){
    var doc = yield Activity.findByIdAndUpdate(id, {lFlg: 'd'}, {new: true}).lean().exec();
    logger.info('success delete activity by id: ' + id);
    return doc;
}

Service.loadAll = function*(type){
    var docs = yield Activity.find({lFlg: 'a'}).lean().exec();
    logger.info('success load all activity');
    return docs;
}

module.exports = Service;