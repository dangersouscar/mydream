var base = getApp();
var common = require('../../../utils/common.js');
Page({
    data: {
        loaded: true,
        _id: 0,
        mode: "add",
        goodsname:"",
        goodsspecifation:"",
        goodsnumber: "",
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        var _this = this;
        console.log(options)
        _this.setData({
            mode: options.mod,
            _id: options._id,
            goodsname: options.goodsname,
            goodsnumber: options.goodsnumber,
            goodsspecifation: options.goodsspecifation,
        });
      },
    changeName: function (e) {
        this.setData({
          goodsname: e.detail.value
        })
    },
   changegoodsspecifation: function (e) {
        this.setData({
          goodsspecifation: e.detail.value
        })
    },
    changegoodsnumber: function (e) {
        this.setData({
          goodsnumber: e.detail.value
        })
    },
    submit: function () {
        var _this = this;
        console.log(_this.valid())
        if (_this.valid()) {  
          if (_this.data.mode == "edit") {
            var addr = {
              tablename: "inventory",
              _id: _this.data._id,
              
            };
            var data = {
              goodsname: _this.data.goodsname,
              goodsspecifation: _this.data.goodsspecifation,
              goodsnumber: _this.data.goodsnumber,
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
                  content: '更新失败！'
                });

                console.log(dt.Msg);
              }
            })
          }
          else {
            var addr = {
              tablename: "inventory",
            };
            var data = {
              goodsname: _this.data.goodsname,
              goodsspecifation: _this.data.goodsspecifation,
              goodsnumber: _this.data.goodsnumber,
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
       if (!_this.data.goodsname) {
            err = "请填写材料名称！";
            wx.showModal({
                showCancel: false,
                title: '',
                content: err
            })
            return false;
        }
       if (!_this.data.goodsspecifation) {
            err = "请填写规格型号！";
            wx.showModal({
                showCancel: false,
                title: '',
                content: err
            })
            return false;
        }
       if (!_this.data.goodsnumber) {
        err = "请填写数量！";
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
