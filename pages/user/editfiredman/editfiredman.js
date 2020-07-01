var base = getApp();
var common = require('../../../utils/common.js');
Page({
    data: {
        loaded: true,
        _id: 0,
        mode: "add",
        name:"",
        idnumber:"",
        reason: "",
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        var _this = this;
        console.log(options)
        _this.setData({
          mode: options.mod,
          _id: options._id,
          name: options.name,
          idnumber: options.idnumber,
          reason: options.reason,
        });
       
      },
    changeName: function (e) {
        this.setData({
          name: e.detail.value
        })
    },
    changeidnumber: function (e) {
        this.setData({
          idnumber: e.detail.value
        })
    },
    changereason: function (e) {
        this.setData({
          reason: e.detail.value
        })
    },
    submit: function () {
        var _this = this;
        console.log(_this.valid())
        if (_this.valid()) {  
          if (_this.data.mode == "edit") {
            var addr = {
              tablename: "firedmanlist",
              _id: _this.data._id,
              
            };
            var data = {
              name: _this.data.name,
              idnumber: _this.data.idnumber,
              reason: _this.data.reason,
              time: common.formatTime(new Date()),
            }
            addr.data = data;
            console.log(addr)
            base.update(addr, function (d) {
              var dt = d
              console.log(d)
              if (dt.errMsg == "document.update:ok") {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000)
              }
              else {
                wx.showModal({
                  showCancel: false,
                  title: '',
                  content: dt.Msg
                });

                console.log(dt.Msg);
              }
            })
          }
          else {
            var addr = {
              tablename: "firedmanlist",
            };
            var data = {
              name: _this.data.name,
              idnumber: _this.data.idnumber,
              reason: _this.data.reason,
              time: common.formatTime(new Date()),
            }
            addr.data = data;
            console.log(addr)
            base.post(addr, function (d) {
              var dt = d
              console.log(d)
              if (dt.errMsg == "collection.add:ok") {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000)

              }
              else {
                wx.showModal({
                  showCancel: false,
                  title: '',
                  content: dt.errMsg
                });

                console.log(dt.errMsg);
              }
            })
            }
        }
      
    },
    valid: function () {
        var _this = this;
        var err = "";
      if (!_this.data.idnumber) {
          err = "身份证号为必填选项";
            wx.showModal({
                showCancel: false,
                title: '',
                content: err
            })
            return false;
        }
      
        // if (_this.data.area) {
        //   v.focArea = false;
        //   return showMsg("请选择区域！", "focArea");
        // }
        return true;

    },
    peoplenumberRegex: function (val) {
        var regex = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (!regex.test(val)) {
            return false;
        }
        return true;
    }
})
