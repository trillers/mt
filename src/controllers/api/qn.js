var util = require('util');
var logger = require('../../app/logging').logger;
var FileService = require('../../modules/file/services/FileService');
var wechatApi = require('../../modules/wechat/common/api').api;
var fs = require('fs');
var path = require('path');
var thunkify = require('thunkify');
var readFile = thunkify(fs.readFile);
var qnClient = require('../../app/qnClient');

module.exports = function(router){
    /**
     * upload voice api
     * */
    router.post('/voice', function* (){
        var self = this;
        console.log(self.query);
        var media_id = self.query.media_id;
        try {
            console.error(media_id);
            var voiceBuffer = yield wechatApi.getMediaAsync(media_id);
            console.log(voiceBuffer);
            qnClient.upload(voiceBuffer[0], {key: 'qn/test/voice/' + media_id + '.amr'}, function(err, result){
                if(!err){
                    console.error(result);
                }
                self.body = result;
            })
        }catch(err){
            console.log(err);
            self.body = '404';
        }
    });
};