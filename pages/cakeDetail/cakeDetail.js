var base = getApp();
Page({
    data: {
        loaded: false,
        list: "",
    },
    onLoad: function (e) {
      var that=this
      var dic = wx.getStorageSync("goods") ;
      that.setData({ list: dic[e.BarCode]})
    },
    initCake: function (d) {
        var _this = this;
        wx.setNavigationBarTitle({ title: d.Name });
        console.log(d.Name)
        this.setData({
            imgMinList: (function () {
                var _list = [];
                console.log(base.path.res)
                if (_this.data.brand == 0) {
                    for (var i = 1; i <= 4; i++) {
                        _list.push(base.path.res + "images-2/classical-detail/" + d.Name + "/w_400/" + d.Name + "-" + i + ".jpg"); 
                      console.log(_list)         
                    }
                } else {
                    _list.push(base.path.res + "images/ksk/item/w_400/" + d.Name + ".jpg");
                }
                return _list;
            })(),
            name: d.Name,
            num: 1,
            des: d.Means,
            resource: d.Resourse,
            fresh: d.KeepFresh,
            current: {
                size: d.CakeType[0].Size,
                price: d.CakeType[0].CurrentPrice,
                supplyno: d.CakeType[0].SupplyNo,
                des: d.CakeType[0].PackingList
            },
            CakeType: d.CakeType
        });
    },
    onShow: function (e) {
        this.setData({ cartNum: base.cart.getNum() });
    },
    previewImg: function (e) {
        preview.show(this.data.name,this.data.brand,e.currentTarget.dataset.index)
    },
    changeCurrent: function (e) {
        var s = e.currentTarget.dataset.size;
        var p = e.currentTarget.dataset.price;
        var sno = e.currentTarget.dataset.supplyno;
        if (s && p && this.data.current.size != s) {
            this.setData({ "current.size": s, "current.price": p, "current.supplyno": sno })
        }
    },
    addCart: function () {
        var that = this;
        if (base.cart.add(that.data.list)) {
            that.setData({ cartNum: base.cart.getNum() })
           wx.showModal({
                title: '加入成功！',
                content: "跳转到清单或留在当前页",
                showCancel: true,
                cancelText: "留在此页",
                confirmText: "进入清单",
                success: function (res) {
                    if (res.confirm) {
                      that.goc();
                    }
                }
            })

            // base.toast({
            //     title: '加入成功',
            //     icon: 'success',
            //     duration: 1500
            // })
        }
    },
    goc: function () {
        var _this = this;
        base.cart.ref = "../cakeDetail/cakeDetail?pname=" + _this.data.name + "&brand=" + _this.data.brand;
        wx.switchTab({
            url: "../cart/cart"
        })
    },
    _go: function () {
        var _this = this;
        wx.navigateTo({
            url: "../buy/buy?type="+_this.data.brand+"&price=" + _this.data.current.price
        })
    }
});