
var dataExchange = require('../../utils/dataExchange');

var app = getApp();

Page({
  data: {
    userInfo: {},
    showBadge: false,
    meList: [
      {
        text: '发布二手图书',
        icon: '../../assets/img/iconfont-dingdan.png',
        url: '../addBooks/addBooks'
      }, {
        text: '已发布图书',
        icon: '../../assets/img/iconfont-help.png',
        url: '/pages/myPublish/myPublish'
      }, {
        text: '我的预订图书',
        icon: '../../assets/img/iconfont-icontuan.png',
        url: '/pages/myOrder/myOrder'
      }, {
        text: '我的资料',
        icon: '../../assets/img/iconfont-kefu.png',
        url: '../profile/profile'
      }, {
        text: '我的消息',
        icon: '../../assets/img/iconfont-kefu.png',
        url: '../message/message'
      }
    ]
  },

  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据

    that.setData({userInfo: wx.getStorageSync('userInfo')})
    
  }
})

