// pages/user/myorder/myorder.js

var base = getApp();
var _list = [];
Page({
  data: {
    loaded: false,
    mypublishlist: [],
    pagenum: 1
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var _this = this;
    this.initData();
    wx.setNavigationBarTitle({
      title: '我的订单列表'
    })
  },
  initData: function () {
    this.getmypublishlist();  
  },

  getmypublishlist: function () {
    var l = base.goods.getList();//获取购物车中的信息并转化为列表
    for (var i = 0; i < l.length; i++) {
      l[i].img = l[i].imgUrl[0];//插入互联网上的图片路径
      l[i].index = i;
    }
    this.setData({ mypublishlist: l, loaded: true, });
  },
  deletegoods: function (e) {
    console.log(e)
    var _id = e.currentTarget.dataset._id;
    var BarCode = e.currentTarget.dataset.BarCode;
    console.log(_id)
    const db = wx.cloud.database({
      env: 'cdh1-61abq',
    })
    if (_id) {
      console.log(_id)
      const db = wx.cloud.database({
        env: 'cdh1-61abq',
      })
      wx.showModal({
        title: '提示',
        content: '确定需要删除图片？',
        success: function (res) {
          if (res.confirm) {
            db.collection('myshop').doc(_id).remove({
              success: function (res) {
                base.cart.remove(BarCode);
                console.log(_id + "删除成功")
                wx.showToast({
                  title: "删除成功"
                })
                wx.reLaunch({
                })
              },
              fail: function (res) {
                console.log(db)
                console.log(_id + "删除失败")
                wx.showToast({
                  title: "删除失败"
                })
                wx.reLaunch({
                  url: ''
                })
              }

            })
            
          } else if (res.cancel) {
            console.log('用户点击取消')
          }

        }
      });
     
    }
  },
  go: function (e) {
    var oid = e.currentTarget.dataset.poid;
    if (oid) {
      wx.navigateTo({
        url: "../../user/myorderdetals/myorderdetals?oid=" + oid
      })
    }
  },
  onReachBottom: function () {
    var _this = this;
    this.setData({
      "pagenum": this.data.pagenum + 1
    });
    this.getOrderList();
  }
})