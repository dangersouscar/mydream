var dataExchange = require('../../utils/dataExchange')
var config = require('../../config/config')

Page({

  onLoad: function () {
    
    var that = this;

    var userId = wx.getStorageSync('userId');
    console.log(userId);
    wx.showLoading({
      title: '正在加载...'
    })
    dataExchange.getBookByUserId(userId, (res, err) => {
      var books = [];
      for (var i = 0; i < res.data.data.length; i++) {
        res.data.data[i].imgUrl = config.imgUrl + res.data.data[i].imgUrl
        books.push(res.data.data[i]);
      }
      that.setData({ bookList: books });
      wx.hideLoading();
    });
  }
})