var base = getApp();
var jzData = require('../../utils/jzData.js')
Page({
    data: {
      tab: 0,
      list: [],
      userInfo:"",
    },
    onLoad: function () {//
      var _this = this;
      base.openid.add(function (d) {
        console.log(d)
        var addr = {
          tablename: "manager",
          pagenum: 0,
        };
        var codition = {
          openid:d
        }
        addr.codition = codition;
        base.get(addr, function (d) {
          var id = wx.getStorageSync("openid") || {};
          console.log(id)
          console.log(d)
          if (d.length>=1 && d[0].openid ==id ) {
           
            console.log("是管理员")
            wx.setStorageSync("manager", true)
          }else{
            wx.setStorageSync("manager", false)
          }
        })
      })
      
      var dic = wx.getStorageSync("userlogin") || {};
      var addr = {
        tablename: "userinfo",
        pagenum: 0,
      };
      var codition = {
      }
      addr.codition = codition;
      base.get(addr, function (d) {
        console.log(d)
        console.log(dic["companyname"])
        if (dic["companyname"] == d[0].companyname && dic["password"] == d[0].password) {
        }
        else {
          wx.redirectTo({
            url: '../login/login'
          });
        }
      })
      base.goods.clear()
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
      }        
    },
    queryAllgoods: function () {
      var that=this
      console.log("查询图书")
      wx.hideLoading();
      var addr = {
        tablename: "myshop",
        pagenum: 0,
      };
      var codition = {
      }
      addr.codition = codition;
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'get',
        // 传递给云函数的event参数
        data: addr
      }).then(res => {
        // output: res.result === 3
        console.log(res)
        if (res.result.errMsg == "collection.get:ok") {
          console.log(res)
          for (var i = 0; i < res.result.data.length; i++) {
            base.goods.add(
              res.result.data[i]
            )
          }
          that.setData({
            list: wx.getStorageSync("goods")
          })
          
        }
      }).catch(err => {
        wx.showModal({
          showCancel: false,
          title: '失败',
          content: '未查询到相关信息！',
        });
        console.log(err)
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
    onShareAppMessage: function () {
      if (res.from === 'button') { }
      return {
        title: '转发',
        path: '/pages/cake/cake',
        success: function (res) { }
      }
    }
   
});