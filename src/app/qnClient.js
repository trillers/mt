var qn = require('qn');

var client = qn.create({
    accessKey: 'Ulac7lEuDqiZ593owTOcQ0L8QieCC8D0tm6itYaU',
    secretKey: 'PohkfZBuxkAxLiIk6lMR39IdbPy6jpPM27jtEL03',
    bucket: 'china',
    origin: '7u2kxz.com2.z0.glb.qiniucdn.com'
    // timeout: 3600000, // default rpc timeout: one hour, optional
    // if your app outside of China, please set `uploadURL` to `http://up.qiniug.com/`
    // uploadURL: 'http://up.qiniu.com/',
});

module.exports = client;