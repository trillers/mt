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
        var media_id = self.request.body.media_id;
        try {
            var voiceBuffer = yield wechatApi.getMediaAsync(media_id);
            //var uploadAsync = thunkify(qnClient.upload);
            qnClient.upload(voiceBuffer[0], {key: 'qn/test/voice/' + media_id + '.mp3'}, function(err, res){
                if(!err){
                    console.error(res);
                }
            });
            //self.body = result;
        }catch(err){
            self.body = '404';
        }
    });
};