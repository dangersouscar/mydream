// pages/user/myorder/myorder.js

var base = getApp();
var _list = [];
Page({
  data: {
    loaded: false,
    mylist: [],
    pagenum: 0,
    idnumber:"",
  },
  onLoad: function (options) {
   
  },
  onShow: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var _this = this;
    _this.setData({
      mylist: []
    })
    _this.setData({
      pagenum: 0
    })
    this.initData();
    wx.setNavigationBarTitle({
      title: '孟工黑名单'
    })
  },
  initData: function () {
    this.getfiredmanList();
  },
  screenInput: function (e) {
    var that = this
    wx.scanCode({
      success: (res) => {
        var idnumber = res.result;
        that.setData({
          idnumber: idnumber
        })
      }
    })
  },
  inputTyping: function (e) {
    this.setData({
      idnumber: e.detail.value
    })
  },
  getfiredmanList: function (){
    var _this = this;
    var addr = {
      tablename: "firedmanlist",
      pagenum: _this.data.pagenum * 20,
    };
    var codition = {
    }
    console.log(codition)
    addr.codition = codition;
    console.log(addr)
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'get',
      // 传递给云函数的event参数
      data: addr
    }).then(res => {
      if (res.result.data.length == 0) {
        wx.showModal({
          title: '提示',
          content: '没有更多记录了',
        });
        return
      }
      if (res.result.data.length !== 0) {
        var l = []
        for (var i = 0; i < res.result.data.length; i++) {
          l.push(res.result.data[i])
        }
        _this.setData({
          mylist: _this.data.mylist.concat(l)
        })
      }
      // output: res.result === 3
      console.log(res)
    }).catch(err => {
      wx.showModal({
        showCancel: false,
        title: '失败',
        content: '未查询到相关信息！',
      });
      console.log(err)
    })
  },
  searchtfiredmanList: function () {
    var _this = this;
    const db = wx.cloud.database({
      env: 'cdh1-61abq',
    })
    var addr = {
      tablename: "firedmanlist",
      pagenum: 0,
    };
    var codition = {
      idnumber: db.RegExp({
        regexp: '.*' + _this.data.idnumber.trim() + '.*',
        //从搜索栏中获取的value作为规则进行匹配。
        options: 'i',
        //大小写不区分
      })
    }
    if (codition["idnumber"] == "") {
      delete codition["idnumber"]
    }
    console.log(codition)
    addr.codition = codition;
    console.log(addr)
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'get',
      // 传递给云函数的event参数
      data: addr
    }).then(res => {
      if (res.result.data.length == 0) {
        wx.showModal({
          title: '提示',
          content: '没有更多记录了',
        });
        return
      }
      if (res.result.data.length !== 0) {
        var l = []
        for (var i = 0; i < res.result.data.length; i++) {
          l.push(res.result.data[i])
        }
        _this.setData({
          mylist: l
        })
      }
      // output: res.result === 3
      console.log(res)
    }).catch(err => {
      wx.showModal({
        showCancel: false,
        title: '失败',
        content: '未查询到相关信息！',
      });
      console.log(err)
    })
    _this.setData({
      idnumber: ""
    })
   /* base.get(addr, function (d) {
      if (d.length == 0) {
        wx.showModal({
          title: '提示',
          content: '没有查找到相关记录',
        });
        return
      }
      if (d.length !== 0) {
        _this.setData({
          mylist: d
        })
      }
      _this.setData({
        idnumber: ""
      })
    })*/

  },
  deletecords: function (e) {
    var that = this
    console.log(e)
    var _id = e.currentTarget.dataset._id;
    var p = {}
    p.tablename = "allrecords"
    p._id = _id
    base.del(p, function (d) {
      console.log(d)
      setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
      }, 2000)
      
    })

  },
  onReachBottom: function () {
    var _this = this;
    this.setData({
      "pagenum": this.data.pagenum + 1
    });
    this.getfiredmanList();
  }
})