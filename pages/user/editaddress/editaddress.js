var base = getApp();
var common = require('../../../utils/common.js');
Page({
    data: {
        loaded: true,
        _id: 0,
        mode: "add",
        placename: "",
        peoplenumber: "",
        address: "",
        arrayCity: [],
        objectArrayCity: [],
        arrayDistrict: [],
        objectArrayDistrict: [],
        indexCity: 0,
        indexDistrict: 0,
        editArea: ""//修改专用初始化字段
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        var _this = this;
        console.log(options)
        _this.setData({
            mode: options.mod,
            _id: options._id,
            placename: options.placename,
            peoplenumber: options.peoplenumber,
        });
        _this.getCity(_this.preLoad);//先获取城市，城市获取成功再执行加载其他内容过程。
      wx.setNavigationBarTitle({
        title: '更新人数'
      })

    },
    preLoad: function () {
        var _this = this;
        if (_this.data.mode == "edit") {
            base.get({c: "UserCenter", m: "getAddressById", id: _this.data.id}, function (d) {
                var dt = d.data;
                if (dt.Status == "ok") {
                    for (var i = 0; i < _this.data.objectArrayCity.length; i++) {
                        if (_this.data.objectArrayCity[i].name == dt.Tag.city) {
                            _this.setData({indexCity: _this.data.objectArrayCity[i].id});
                            break;
                        }
                    }
                    _this.setData({
                        loaded: true,
                        placename: dt.Tag.name,
                        peoplenumber: dt.Tag.peoplenumber,
                        address: dt.Tag.address,
                        editArea: dt.Tag.area
                    })
                    _this.getAreaByCity(_this.data.arrayCity[_this.data.indexCity], _this.preAreaByEdit);
                }
            })
        }
        else {
            _this.getAreaByCity(_this.data.arrayCity[0]);
            _this.setData({
                loaded: true
            })
        }
    },
    preAreaByEdit: function () {//编辑状态初始化加载区域
        var _this = this;
        for (var i = 0; i < _this.data.objectArrayDistrict.length; i++) {
            if (_this.data.objectArrayDistrict[i].name == _this.data.editArea) {
                _this.setData({indexDistrict: _this.data.objectArrayDistrict[i].id});
                break;
            }
        }
    },
    getCity: function (call) {//获取所有城市
        var _this = this;
        base.get({c: "CityCenter", m: "GetCitys"}, function (d) {
            var dt = d.data;
            if (dt.Status == "ok") {
                var arr_objcity = [];
                var arr_city = [];
                for (var i = 0; i < dt.Tag.length; i++) {
                    arr_city.push(dt.Tag[i].City);
                    arr_objcity.push({id: i, name: dt.Tag[i].City});
                }
                _this.setData({
                    arrayCity: arr_city,
                    objectArrayCity: arr_objcity
                })
                if (call) call();
            }
        })
    },
    getAreaByCity: function (city, call) {
        var _this = this;
        base.get({c: "CityCenter", m: "GetAreaByCity", city: city}, function (d) {
            var dt = d.data;
            if (dt.Status == "ok") {
                var arr_objArea = [];
                var arr_Area = [];
                for (var i = 0; i < dt.Tag.length; i++) {
                    arr_Area.push(dt.Tag[i].District);
                    arr_objArea.push({id: i, name: dt.Tag[i].District});
                }
                _this.setData({
                    arrayDistrict: arr_Area,
                    objectArrayDistrict: arr_objArea
                })
                if (call) call();
            }
        })
    },
    bindPickerChangeCity: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            indexCity: e.detail.value
        })
        this.getAreaByCity(this.data.arrayCity[e.detail.value]);
    },
    bindPickerChangeDistrict: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            indexDistrict: e.detail.value
        })
    },
    changeName: function (e) {
        this.setData({
            placename: e.detail.value
        })
    },
    changepeoplenumber: function (e) {
        this.setData({
            peoplenumber: e.detail.value
        })
    },
    changeAddress: function (e) {
        this.setData({
            address: e.detail.value
        })
    },
    submit: function () {
        var _this = this;
        console.log(_this.valid())
        if (_this.valid()) {  
          if (_this.data.mode == "edit") {
            var addr = {
              tablename: "addresslist",
              _id: _this.data._id,
              
            };
            var data = {
              placename: _this.data.placename,
              peoplenumber: _this.data.peoplenumber,
              time: common.formatTime(new Date()),
            }
            addr.data = data;
            console.log(addr)
            wx.cloud.callFunction({
              // 要调用的云函数名称
              name: 'update',
              // 传递给云函数的event参数
              data: addr
            }).then(res => {
              // output: res.result === 3
              console.log(res)
              if (res.errMsg == "cloud.callFunction:ok") {
                wx.reLaunch({
                  url: '../user/user'
                })
              }
            }).catch(err => {
                wx.showModal({
                  showCancel: false,
                  title: '',
                  content: res.errMsg
                });
                console.log(res.errMsg)
            })
          }
          else {
            var addr = {
              tablename: "addresslist",
            };
            var data = {
              placename: _this.data.placename,
              peoplenumber: _this.data.peoplenumber,
              time: common.formatTime(new Date()),
            }
            addr.data = data;
            console.log(addr)
            base.post(addr, function (d) {
              var dt = d.data;
              if (dt.Status == "ok") {
                wx.redirectTo({
                  url: "../../user/myaddress/myaddress"
                })
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
        }
          wx.navigateBack({
            delta: 1
          })

    },
    valid: function () {
        var _this = this;
        var err = "";
        if (!_this.data.placename) {
            err = "请填写收货人姓名！";
            wx.showModal({
                showCancel: false,
                title: '',
                content: err
            })
            return false;
        }
        if (!_this.data.peoplenumber) {
            err = "请填写收货人手机号码！";
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
