
var dataExchnage = require('../../utils/dataExchange')

Page({

  data: {
    conversations: []
  },

  onLoad: function () {
    var that = this
    //得到所有消息记录
    wx.showLoading({
      title: '正在加载...'
    })
    var userId = wx.getStorageSync("userId");
    dataExchnage.getConversations(userId, res => {
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.status == 200) {
        that.setData({ conversations: res.data.data });
      }
    })

    //监听聊天消息
  }

})