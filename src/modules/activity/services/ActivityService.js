var Activity = require('../models/Activity').model;
var activityKv = require('../kvs').activity;
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

Service.getUserRankingList = function*(id){
    var userMapString = activityKv.getParticipantListStringAsync(id);

    //return to see: this is blank
    if(!userMapString) return null;
    var userMap = JSON.parse(userMapString);
    var rankingList = yield kv.getRankingListAsync(activityId);

    //return to say: this is blank
    if(!rankingList || rankingList.length==0) return null;
    var userRankingList = [];
    var len = rankingList.length;
    for(var i=0; i<len; i++, i++){
        var userId = rankingList[i+1];
        var user = userMap[userId];
        if(user){
            user.score = rankingList[i];
            userRankingList.push(user);
        }
    }

    return userRankingList;
}

module.exports = Service;