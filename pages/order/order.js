var base = getApp();
var common = require('../../utils/common.js');
Page({
    data: {
        addresslist:"",
        scrollTop: 100,
        selectedID: -1,
        placenamechoice:"",
        oinfo: { 
          placenamefrom: "",
          placenameto: "",
          Remarks:"",
        },
    },
    bindDateChange: function (e) {
        this.setData({
            "oinfo.DeliveryDate": e.detail.value
        })
    },
    bindTextAreaBlur: function (e) {
      console.log(e)
      this.setData({
        "oinfo.Remarks": e.detail.value
      })
    },
    myaddrChange: function (e) {//触摸选择地址
        console.log(e)
        this.setData({addrShow: true});
      if (e.currentTarget.id=="from"){
        this.setData({ placenamechoice: "from" });
        }else{
        this.setData({ placenamechoice: "to" });
        }
    },   
    myaddrCancel: function () {//点击地址簿中取消按钮
        this.setData({addrShow: false});
    },
    closeaddr: function () {//触摸遮罩层关闭地址选项
        this.setData({addrShow: false});
    },
    toSelect: function (e) {//选中地址
        console.log(e)
        var _this = this;
        var _id = e.currentTarget.dataset._id;
        _this.setData({selectedID: _id});
      if (_this.data.placenamechoice=="from"){
          for (var i = 0; i < _this.data.addresslist.length; i++) {
              if (_this.data.addresslist[i]._id == _id) {
                  _this.setData({
                    "oinfo.placenamefrom": _this.data.addresslist[i].placename,
                      addrShow: false
                  });
                  break;
              }
          }
        }else{
          for (var i = 0; i < _this.data.addresslist.length; i++) {
            if (_this.data.addresslist[i]._id == _id) {
              _this.setData({
                "oinfo.placenameto": _this.data.addresslist[i].placename,
                addrShow: false
              });
              break;
            }
          }
          
        }
    },
    onLoad: function (e) {
        var _this = this;
        var now = new Date();
        console.log(base.user.islogin() )
        if (true) {
            if (e.from && e.from == "cart") {
                var l = base.cart.getList();
                console.log(l)
                _this.setData({
                    plist: l,
                    dateStart: common.addDate(now, 1),
                    dateEnd: common.addDate(now, 90)
                });
            }
        }
        this.getAddressList();
        console.log(this.data.plist);
    },
    getAddressList: function () {
      var _this = this;
      var addr = {
        tablename: "addresslist",
        pagenum: _this.data.pagenum * 20,
      };
      var codition = {
      }
      addr.codition = codition;

      base.get(addr, function (d) {
        var dt = d.data;
        if (d) {
          _this.setData({
            addresslist: d
          })

        }
      })
    },
    onShow: function (e) {

    },

    getTotalPrice: function () {//应付金额
        var _this = this;
        var pl = _this.data.plist;//name: p.name, price: p.price, size: p.size, num: p.num, brand: p.brand,supplyno
        var alltotal = 0;
        for (var i = 0; i < pl.length; i++) {
            if (!isNaN(pl[i].price)) {
                alltotal += parseFloat(pl[i].price);
            }
        }
        this.setData({
            "oinfo.TotalPrice": alltotal
        });
    },
    getProductList: function () {
        var _this = this;
        var arr_pro = [];
        var pl = _this.data.plist;//name: p.name, price: p.price, size: p.size, num: p.num, brand: p.brand,supplyno
        for (var i = 0; i < pl.length; i++) {
            arr_pro.push({
                ProductName: pl[i].name,
                Price: pl[i].price,
                Size: pl[i].size,
                Num: pl[i].num,
                CakeNo: 0,
                OType: 0,
                IType: 0,
                SupplyNo: pl[i].supplyno,
                //生日内容
                IsCutting: 0,
                CutNum: 0,
                BrandCandleType: 0,
                Remarks: '',
                Premark: null,//生产备注
            });
        }
        return arr_pro;
    },
    valid: function () {
        var _this = this;
        var err = "";
         if (!_this.data.oinfo.placenamefrom) {
            err = "请选择发货单位！";
            wx.showModal({
                showCancel: false,
                title: '',
                content: err
            })
            return false;
        }
       if (!_this.data.oinfo.placenameto) {
            err = "请选择收货单位！";
            wx.showModal({
                showCancel: false,
                title: '',
                content: err
            })
            return false;
        }
       if (!_this.data.oinfo.Remarks) {
          err = "请填写姓名！";
          wx.showModal({
            showCancel: false,
            title: '',
            content: err
          })
          return false;
        }
       return true;
    },
    submit: function () {
      var _this = this;
      wx.showModal({
        title: '提示',
        content: '信息是否准确？',
        success: function (res) {
          if (res.confirm) {
            if (_this.valid()) {
              var addr = {
                tablename: "allrecords",
              };
              var data = {
                placenamefrom: _this.data.oinfo.placenamefrom,
                placenameto: _this.data.oinfo.placenameto,
                Remarks: _this.data.oinfo.Remarks,
                time: common.formatTime(new Date()),
              }
              for (var i = 0; i < _this.data.plist.length; i++) {
                data.BarCode = _this.data.plist[i].BarCode
                data.ProductName = _this.data.plist[i].ProductName
                data.ProductPrice = _this.data.plist[i].ProductPrice
                data.num = _this.data.plist[i].num
                addr.data = data;
                base.post(addr, function (d) {
                  var dt = d
                  console.log(dt)
                  if (dt.errMsg == "collection.add:ok") {
                    wx.navigateBack({
                      delta: 2
                    })
                    base.cart.clear();
                  }
                  else {
                    wx.showModal({
                      showCancel: false,
                      title: '',
                      content: dt.errMsg
                    });
                  }
                })
              }
            }
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });    
    }
})