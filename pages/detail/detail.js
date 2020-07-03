var app = getApp();
var url = app.url;
var util = require('../../utils/util');
var config = require('../../config/config');
var dataExchange = require('../../utils/dataExchange');

Page({
  data: {
    bookMsg: {},
    saler: '',
    source: '',
    saleStatus: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

    var that = this;

    that.setData({source: options.source})
    wx.showLoading({
      title: '正在加载...'
    })
    dataExchange.getBookById(options.id, res => {
      var data = res.data.data;
      if (res.statusCode == 200 && res.data.status == 200) {
        data.imgUrl = config.imgUrl + data.imgUrl
        that.setData({bookMsg: data})
        switch (data.status) {
          case 0:
            that.setData({ saleStatus: '在售' })
            break;
          case 1:
            that.setData({ saleStatus: '已售' })
            break;
          case 2:
            that.setData({ saleStatus: '取消' })
            break;
          default:
            break;
        }
      }
      wx.hideLoading();
    })

    dataExchange.getUserById(options.userId, res => {
      var data = res.data.data;
      if (res.statusCode == 200 && res.data.status == 200) {
        that.setData({saler: data.nickName})
      }
    })

  },
  cancelSaleBook: function () {
    var that = this;
    dataExchange.updateBookStatus(that.data.bookMsg.id, 2, res => {
      if (res.statusCode === 200 && res.data.status === 200) {
        wx.showToast({
          title: '修改成功'
        })
        that.setData({saleStatus: '取消'})
      }
    })
  }, 
  confirmSaled: function () {
    var that = this;
    dataExchange.updateBookStatus(that.data.bookMsg.id, 1, res => {
      if (res.statusCode === 200 && res.data.status === 200) {
        wx.showToast({
          title: '修改成功'
        })
        that.setData({saleStatus: '已售'})
      }
    })
  },
  sendMsg: function (event) {
    console.log(event)
    var targetId = event.target.dataset.userid;
    var conversationId;
    var userId = wx.getStorageSync('userId')
    console.log(targetId)
    if (userId < targetId) {
      conversationId = userId + '_' + targetId
    } else {
      conversationId = targetId + '_' + userId
    }
    wx.navigateTo({
      url: '/pages/chat/chat?conversationId=' + conversationId
    })
  }
})