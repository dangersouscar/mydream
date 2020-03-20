var base = getApp();
var jzData = require('../../utils/jzData.js')
Page({
    data: {
        tab: 0,
        list: [],
        listJz: []
    },
    onLoad: function () {//
        var _this = this;
        var _dic = base.cake.getCache();//返回本地存储中的蛋糕
        if (_dic) {
            this.setlist(_dic);//把各种品牌蛋糕的信息转换到LIST数组
        } else {
            this.initData();
        }
        //极致系列
        var list = [],_jzlist = [];
        var dic = jzData.data;//产品相关信息
        for (var i in dic) {
            console.log(i)
            _jzlist.push({
                name: i,
                price: dic[i].CakeType[0].CurrentPrice + ".00",
                des: dic[i].Means,
                imgUrl: base.path.res + dic[i].img
            })
            list.push({
                name: i,
                price: dic[i].CakeType[0].CurrentPrice + ".00",
                des: dic[i].Means,
                imgUrl: base.path.res + dic[i].img
            })
        }
        this.setData({
            "listJz": _jzlist,
            "list": list,
        });
    },
    onShow: function (e) {
        if (base.cake.tab != null) {
            this.setData({ "tab": base.cake.tab });
            base.cake.tab = null;
        }
        // if (base.version.current != base.version.getValue()) {

        //     this.initData();
        // }
    },
    initData: function () {
        var _this = this;
        // var _dic = base.cake.getCache();
        // if (_dic) {
        //     _this.setlist(_dic);
        // } else {
        base.get({ c: "Product", m: "GetAllProduct", City: "上海" }, function (d) {
            var data = d.data;
            if (data.Status == "ok") {
                base.cake.setCache(data.Tag);
                _this.setlist(data.Tag);
            }
        })
        //}

    },
    setlist: function (dic) {
        var _list = [];
        for (var i in dic) {
            _list.push({
                name: i,
                price: dic[i].CakeType[0].CurrentPrice + ".00",
                des: dic[i].Means,
                //imgUrl: base.path.res + "images/ksk/mlist/item/" + i + ".jpg"
                imgUrl: base.path.res + "/images-2/index-3/jdcake/w_240/" + encodeURI(i) + ".png"
            })
        }
        this.setData({ "list": _list });
    },
    goDetail: function (e) {//把名字品牌带到详情页去
        var d = e.currentTarget.dataset.pname;
        var b = e.currentTarget.dataset.brand;
       console.log(e.currentTarget)
        if (d) {
            wx.navigateTo({
                url: '../cakeDetail/cakeDetail?pname=' + d + "&brand=" + b
            })
        }
    }
});