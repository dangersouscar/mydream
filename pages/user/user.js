var base = getApp();
Page({
    data: {
      addresslist:"",
      userInfo: '',
      loaded: true,
      manager: false,
      pagenum: 0,
    },
    onGotUserInfo:function (e) {//授权登陆
        const { userInfo } = e.detail
        console.log(e)
        this.setData({
            userInfo: userInfo
        })
    },
    gotomypublish: function () {
        base.user.userid = 0;
        base.user.sessionid = "";
        base.user.clear();
        wx.navigateTo({
          url: '../user/mypublish/mypublish'
        });
    },
  myaddrChange: function () {//触摸选择地址
    this.setData({ addrShow: true });
  },
  myaddrCancel: function () {//点击地址簿中取消按钮
    this.setData({ addrShow: false });
  },
  closeaddr: function () {//触摸遮罩层关闭地址选项
    this.setData({ addrShow: false });
  },
  toSelect: function (e) {//选中地址
    var _this = this;
    var id = e.currentTarget.dataset.aid;
    _this.setData({ selectedID: id });
    for (var i = 0; i < _this.data.addresslist.length; i++) {
      if (_this.data.addresslist[i].id == id) {
        _this.setData({
          "oinfo.City": _this.data.addresslist[i].city,
          "oinfo.District": _this.data.addresslist[i].area,
          "oinfo.Consignee": _this.data.addresslist[i].name,
          "oinfo.Cellphone": _this.data.addresslist[i].phone,
          "oinfo.Address": _this.data.addresslist[i].address,
          addr: _this.data.addresslist[i].city + ' ' + _this.data.addresslist[i].area + ' ' + _this.data.addresslist[i].address,
          addrShow: false
        });
        break;
      }
    }
  },
  onReady: function () {
      // 页面渲染完成
      console.log(base);
  },
  tomyorder: function () {
      wx.navigateTo({
          url: '../user/myorder/myorder'
      })
  },
  tomyaddress: function () {
      wx.navigateTo({
          url: '../user/myaddress/myaddress'
      })
  },
  tomyfiredman: function () {
      wx.navigateTo({
        url: '../user/firedman/firedman'
      })
  },
  changeimg: function () {//更改头像
      var _this = this;
      wx.showModal({
          title: '',
          content: '确定要更换头像？',
          success: function (res) {
              if (res.confirm) {
                  _this.up();
              }
          }
      })
  },
  getAddressList: function () {
    var _this = this;
    var addr = {
      tablename: "addresslist",
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
        var l = []
        for (var i = 0; i < res.result.data.length; i++) {
          l.push(res.result.data[i])
        }
        _this.setData({
          addresslist: l
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
  deletplacename: function (e) {
    var that = this
    console.log(e)
    var _id = e.currentTarget.dataset._id;
    var p={}
    p.tablename ="addresslist"
    p._id = _id

    wx.showModal({
      title: '提示',
      content: '确定需要删除？',
      success: function (res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            // 要调用的云函数名称
            name: 'delete',
            // 传递给云函数的event参数
            data: p
          }).then(res => {
            // output: res.result === 3
            console.log(res)
            if (res.result.errMsg == "document.remove:ok") {
              wx.reLaunch({
                url: '../user/user'
              })
              wx.showModal({
                showCancel: false,
                title: '',
                content: "删除成功！"
              });
            }
          }).catch(err => {
            wx.showModal({
              showCancel: false,
              title: '',
              content: res.errMsg
            });
            console.log(res.errMsg)
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
   
    // base.del(p, function (d) {
    //  console.log(d)
    //   wx.reLaunch({
    //     url: '../user/user'
    //   })
    // }) 
  },
  onLoad: function () {
      var that = this
      that.getAddressList();
      console.log(this.data.plist);
      //调用应用实例的方法获取全局数据
  },
  onShow: function () {
    var that = this
    that.getAddressList();   
    if (wx.getStorageSync("manager")==true){
      that.setData({
        manager: true
      })
    }else( 
    that.setData({
      manager: false
    })
    )
  },  
});