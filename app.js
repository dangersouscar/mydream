//app.js

var config = require('./config/config')

App({
  onLaunch: function () {

    var that = this;

    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

  },

  globalData: {
    socketOpen: false
  }
})