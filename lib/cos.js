
var COS = require('./cos-wx-sdk-v5');
var config = require('../config');
// var cos = new COS({
//     getAuthorization: function (options, callback) {
//         wx.request({
//             method: 'GET',
//             url: config.stsUrl, // 服务端签名，参考 server 目录下的两个签名例子
//             dataType: 'json',
//             success: function (result) {
//                 var data = result.data;
//                 callback({
//                     TmpSecretId: data.credentials && data.credentials.tmpSecretId,
//                     TmpSecretKey: data.credentials && data.credentials.tmpSecretKey,
//                     XCosSecurityToken: data.credentials && data.credentials.sessionToken,
//                     ExpiredTime: data.expiredTime,
//                 });
//             }
//         });
//     },
// });
var cos = new COS({
  SecretId: 'AKIDe4F9oCKI3ZpqszgUt64rXyCE1YostNny',
  SecretKey: '4sSlRsYBrJK6bEfx0lcEk8GMEyRi286r',
});
module.exports = cos;