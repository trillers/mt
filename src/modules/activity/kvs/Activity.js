var cbUtil = require('../../../framework/callback');
var redis = require('../../../app/redis');

var idToRankingListKey = function(id){
    return 'act:ranking:id:' + id;
};

var idToParticipantUserListKey = function(id){
    return 'act:usrs:id:' + id;
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

Kv.prototype.setParticipantListString = function(activityId, listString, callback){
    var key = idToParticipantUserListKey(activityId);
    redis.set(key, listString, function(err, result){
        cbUtil.logCallback(
            err,
            'Fail to set participant list string for activity: ' + activityId + ': ' + err,
            'Succeed to set participant list string for activity: ' + activityId);
        cbUtil.handleOk(callback, err, result);
    });
};

Kv.prototype.getParticipantListString = function(activityId, callback){
    var key = idToParticipantUserListKey(activityId);
    redis.get(key, function(err, result){
        cbUtil.logCallback(
            err,
            'Fail to get participant list string for activity: ' + activityId + ': ' + err,
            'Succeed to get participant list string for activity: ' + activityId);
        cbUtil.handleSingleValue(callback, err, result);
    });
};

/**
 * Get the ranking list of a activity.
 * the item of the list is like ['{user: {nickname,'sunny' ......}, 'total_money' 10}', '{user: {nickname,'sunny' ......}, 'total_money' 10}']
 * @param activityId
 * @param callback
 */
Kv.prototype.getRankingListWithScore = function(activityId, callback){
    var lua = " \
local userIdScoreArr = redis.call('zrevrange', KEYS[1], 0, -1, 'WITHSCORES')\
local re = {}\
local index = 0\
    for i=0, #userIdScoreArr, 2 do\
        local jsonStr = '{}'\
        local json = cjson.decode(jsonStr)\
        local userStr = '{}'\
        local user = cjson.decode(jsonStr)\
        local key = table.concat({'usr:id:', userIdScoreArr[i-1]}) \
        local hm = redis.call('hgetall', key)\
        for j=0, #hm, 2 do\
           local field = tostring(hm[j-1])\
           user[field] = hm[j]\
        end\
        json['user'] = user\
        json['total_money'] = userIdScoreArr[i]\
        re[index] = cjson.encode(json)\
        index = index + 1\
    end    \
return re\
";
    var key = idToRankingListKey(activityId);
    redis.eval(lua, 1, key, function(err, result){
        var listJsonString = '[' + result.join(',') + ']';
        var listJson = JSON.parse(listJsonString);
        cbUtil.logCallback(
            err,
            'Fail to get ranking list with score, activity id ' + activityId + ': ' + err,
            'Succeed to get ranking list with score, activity id ' + activityId);

        cbUtil.handleSingleValue(callback, err, listJson);
    });
};

module.exports = Kv;