const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  try {
    return await cloud.uploadFile({
      cloudPath: event.path,
      fileContent: new Buffer(event.file, 'base64')
    })
  } catch (e) {
    return e;
  }




}