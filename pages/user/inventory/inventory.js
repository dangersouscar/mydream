// pages/user/myorder/myorder.js

var base = getApp();
var _list = [];
Page({
  data: {
    loaded: false,
    mylist: [],
    pagenum: 0,
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
      title: '重要物资库存'
    })
  },
  initData: function () {
    this.getOrderList();
  },
  getOrderList: function (){
    var _this = this;
    var addr = {
      tablename: "inventory",
      pagenum: _this.data.pagenum * 20,
    };
    var codition = {
    }
    console.log(codition)
    addr.codition = codition;
    console.log(addr)
    base.get(addr, function (d) {
      if(d.length==0){
        wx.showModal({
          title: '提示',
          content: '没有更多记录了',
        });
        return
        }
      if (d.length!==0) {
        _this.setData({
          mylist: _this.data.mylist.concat(d)
        })
      }
    })

  },
  getCity: function (call) {//获取所有城市 
    var _this = this;
    base.get({ c: "CityCenter", m: "GetCitys" }, function (d) {
      var dt = d.data;
      if (dt.Status == "ok") {
        var arr_objcity = [];
        var arr_city = [];
        for (var i = 0; i < dt.Tag.length; i++) {
          arr_city.push(dt.Tag[i].City);
          arr_objcity.push({ id: i, name: dt.Tag[i].City });
        }
        _this.setData({
          arrayCity: arr_city,
          objectArrayCity: arr_objcity
        })
        if (call) call();
      }
    })
  }, 
  getaddresslist: function (call) {//获取所有城市 只
    var _this = this;
    var addr = {
      tablename: "addresslist",
      pagenum: _this.data.pagenum * 20,
    };
    var codition = {
    }
    addr.codition = codition;
    base.get(addr, function (d) {
      console.log("哈哈")
      console.log(d[2].placename)
      var l=[]
      for (var i = 0; i < d.length; i++){
        console.log(i)
        l.push(d[i].placename)
      }
      console.log(l)
        _this.setData({
          addresslist: l
        })
    })
  }, 
  bindPickerChangefrom: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexfrom: e.detail.value,
      placenamefrom: this.data.addresslist[e.detail.value],
      })
  },
  bindPickerChangeto: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexto: e.detail.value,
      placenameto: this.data.addresslist[e.detail.value],
    })
  },
  bindPickerChangegoods: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexgoods: e.detail.value,
      indexgoods: this.data.addresslist[e.detail.value],
    })
  },
  myaddrChange: function () {//触摸选择地址
    this.setData({ addrShow: true });
    this.getOrderList()
  },
  myaddrCancel: function () {//点击地址簿中取消按钮
    this.setData({ addrShow: false });
    this.setData({ mylist: [] });
    this.setData({ pagenum: 0});

  },
  closeaddr: function () {//触摸遮罩层关闭地址选项
    this.setData({ addrShow: false });
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
  deletinventory: function (e) {
    var that = this
    console.log(e)
    var _id = e.currentTarget.dataset._id;
    var p = {}
    p.tablename = "inventory"
    p._id = _id
    base.del(p, function (d) {
     console.log(d)
     that.onShow()
    })

  },
  onReachBottom: function () {
    this.setData({
      pagenum: this.data.pagenum + 1
    });
    this.getOrderList()
  }
})