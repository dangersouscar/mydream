var qcloud = require('../../vendor/qcloud-weapp-client-sdk/index');

var app = getApp();
var config = require('../../config/config');
var url = config.url;
var util = require('../../utils/util');
var dataExchange = require('../../utils/dataExchange');

Page({
  data: {
    bookList: [],
    inputShowed: false,
    inputVal: "",
    page: 1,
    size: 10
  },
  onLoad: function () {
    var that = this;

    dataExchange.checkLogin(res => {

      dataExchange.getProfile(res, res => {
        console.log(res)
        if (res.data.data.school == null || res.data.data.school == '') {
          wx.navigateTo({
            url: '/pages/profile/profile'
          })
        }
      })
    });

    that.queryBooks();

        //开启websocket
        wx.connectSocket({
          url: config.socketUrl + 'chat',
          header: {
            'content-type': 'application/json'
          }
        })
    
        wx.onSocketOpen(res => {
          app.socketOpen = true;
          var userId = wx.getStorageSync('userId');

          if (userId != null && userId != '') {
            wx.sendSocketMessage({
              data: "userid-" + userId
            })
          }
        })


  },

  clearInput: function () {
    this.setData({inputVal: ""});
  },
  inputTyping: function (e) {
    this.setData({inputVal: e.detail.value});
  },

  queryBtn: function (e) {
    var that = this;
    that.setData({page: 1})
    that.setData({bookList: []})
    that.queryBooks()
  },

  queryBooks: function () {
    wx.showLoading({
      title: "正在加载..."
    });
    var that = this;
    if (that.data.inputVal.trim() === '') {
      that.queryAllBooks();
    } else {
      that.qeuryBooksByName();
    }
    
  },

  queryAllBooks: function () {
    var that = this;

    var userId = wx.getStorageSync("userId")

    if (userId == null || userId == '') {
      userId = 0
    }

    dataExchange.getAllBook(userId, that.data.page, that.data.size, res => {
      wx.hideLoading();
      var books = that.data.bookList;
      if (res.data.data == null) {
        return
      }
      for (var i = 0; i < res.data.data.length; i++) {
        res.data.data[i].imgUrl = config.imgUrl + res.data.data[i].imgUrl
        books.push(res.data.data[i]);
      }
      that.setData({bookList: books});
      var nextPage = that.data.page + 1;
      that.setData({ page: nextPage })
    })
  },

  qeuryBooksByName: function () {
    wx.hideLoading();
    var that = this;
    var userId = wx.getStorageSync("userId")

    if (userId == null || userId == '') {
      userId = 0
    }

    dataExchange.getBookByName(that.data.inputVal.trim(), userId, that.data.page, that.data.size, (res, err) => {
      var books = that.data.bookList;

      if (res.data.data.length === 0) {
        wx.showToast({title: '没有您想要的图书'})
        return
      }
      for (var i = 0; i < res.data.data.length; i++) {
        res.data.data[i].imgUrl = config.imgUrl + res.data.data[i].imgUrl
        books.push(res.data.data[i]);
      }
      that.setData({bookList: books});
      that.data.page = that.data.page + 1;
    });
  },

  onReachBottom() {
    console.log('on reach bottom')
    var that = this
    that.queryBooks();
  }

})
