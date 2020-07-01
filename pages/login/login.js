// pages/login/login.js

var base = getApp();
Page({
  data: {
    phone: "",
    pwd: ""
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数  
  },
  changephone: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },
  changepwd: function (e) {
    this.setData({
      pwd: e.detail.value
    });
  },
  submit: function () {
    var _this = this;
    var addr = {
      tablename: "userinfo",
      pagenum: 0,
    };
    var codition = {
      companyname: _this.data.phone,
      password: _this.data.pwd,
    }
    addr.codition = codition;

    base.get(addr, function (d) {
      console.log(d)
      if (d.length == 1) {
        base.user.userid = 1;
        wx.switchTab({
          url: '../user/user'
        })
        base.userlogin.add(d[0])
      }
      else {
        wx.showModal({
          showCancel: false,
          title: '',
          content: "账号或密码错误！"
        });

      }
    })
  }
})