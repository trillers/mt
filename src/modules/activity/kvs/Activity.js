var cbUtil = require('../../../framework/callback');
var redis = require('../../../app/redis');

var idToRankingListKey = function(id){
    return 'act:ranking:id:' + id;
};

var Kv = function(context){
    this.context = context;
};

/**
 * Add the user and initial score for a participant
 * in the ranking list of a activity
 * @param activityId activity id
 * @param userId the id of the user of the participant
 * @param initialScore
 * @param callback callback(err, affectedNum)
 */
Kv.prototype.addParticipantInRankingList = function(activityId, userId, initialScore, callback){
    var key = idToRankingListKey(activityId);
    redis.ZADD(key, initialScore, userId, function(err, result){
        cbUtil.logCallback(
            err,
            'Fail to add participant with score, activity id ' + activityId + ': ' + err,
            'Succeed to add participant with score, activity id ' + activityId);

        cbUtil.handleSingleValue(callback, err, result);
    });
};

/**
 * Increase some score for the user for a participant
 * in the ranking list of a activity
 * @param activityId activity id
 * @param userId the id of the user of the participant
 * @param score increased (powered) score
 * @param callback callback(err, totalScore)
 */
Kv.prototype.increaseParticipantScoreInRankingList = function(activityId, userId, score, callback){
    var key = idToRankingListKey(activityId);
    redis.ZINCRBY(key, score, userId, function(err, result){
        cbUtil.logCallback(
            err,
            'Fail to increase score for participant, activity id ' + activityId + ': ' + err,
            'Succeed to increase score for participant, activity id ' + activityId);

        cbUtil.handleSingleValue(callback, err, result);
    });
};

/**
 * Get the ranking list of a activity.
 * the item of the list is like [user 0, 200, user 1, 198, ... user n, 10]
 * with score descending order
 * @param activityId
 * @param callback
 */
Kv.prototype.getRankingList = function(activityId, callback){
    var key = idToRankingListKey(activityId);
    var args = [ key, 0, -1, 'WITHSCORES'];
    redis.zrevrange(args, function(err, result){
        cbUtil.logCallback(
            err,
            'Fail to get ranking list, activity id ' + activityId + ': ' + err,
            'Succeed to get ranking list, activity id ' + activityId);

        cbUtil.handleSingleValue(callback, err, result);
    });
};

module.exports = Kv;