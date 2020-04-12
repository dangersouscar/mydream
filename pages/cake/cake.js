var base = getApp();
var jzData = require('../../utils/jzData.js')
Page({
    data: {
        tab: 0,
        list: [],
    },
    onLoad: function () {//
      var that=this
      that.setData({
        list: wx.getStorageSync("goods")
      })
    },
    onShow: function (e) {
      var that = this
      console.log("页面加载")
      var dic = wx.getStorageSync("goods") || {};
      console.log(dic)
      if (wx.getStorageSync("goods")) {
        that.setData({ list: dic })
      } else {
        that.queryAllgoods()
        that.onLoad()
      }        
    },
    queryAllgoods: function () {
      var that=this
      console.log("查询图书")
      wx.hideLoading();
      const db = wx.cloud.database({
        env: 'cdh1-61abq',
      })
      console.log(db)
      db.collection('myshop')
        .get({
          success: res => {
            console.log(res)
            for (var i = 0; i < res.data.length; i++) {
              base.goods.add(
                res.data[i]
              )
            }
            that.setData({
              list: wx.getStorageSync("goods")
            })
          }    
        })
    },
    goDetail: function (e) {//把名字品牌带到详情页去

       console.log(e.currentTarget)
      var p = e.currentTarget.dataset.pname
      console.log(p)
          wx.navigateTo({
            url: '../cakeDetail/cakeDetail?BarCode='+ p
          })
    },
   
});