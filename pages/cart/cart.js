var base = getApp();
var preview=require('../../utils/preview.js');
Page({
    data: {
        plist: [],//购物车中所有项的信息
        total: 0,
        his: ""
    },
    onLoad: function (e) {

    },
    onShow: function (e) {
        if (base.cart.ref) {
            this.setData({ his: base.cart.ref });
            base.cart.ref = "";
        }
        var l = base.cart.getList();//获取购物车中的信息并转化为列表
        for (var i = 0; i < l.length; i++) {
          l[i].img = l[i].imgUrl[0];//插入互联网上的图片路径
          l[i].index = i;
        }
        console.log(l)
        this.setData({ plist: l });
        this.changeTotal();
    },
    goBack: function () {
        var _this = this;
        wx.navigateTo({
            url: _this.data.his
        })
    },
    previewImg: function (e) {
        preview.show(e.currentTarget.dataset.name,e.currentTarget.dataset.brand,e.currentTarget.dataset.index)
    },
    changeTotal: function () {//计算购物车中所有的金额
        var l = this.data.plist;
        var t = 0;
      console.log(l[0].del)
        for (var i = 0; i < l.length; i++) {
            if (!l[i].del) {//排除删除选项
              t += l[i].ProductPrice * l[i].num;
            }
        }
        this.setData({ total: t });
    },
    changeNum: function (e) {//加减号，改变当前品种的数量
        var t = e.currentTarget.dataset.type;
        var index = e.currentTarget.dataset.index;
        var re = this.data.plist[index].num + parseInt(t);
        if (re < 100 && re > 0) {
            var key = "plist[" + index + "].num";
            var obj = {}; obj[key] = re;
            
            this.setData(obj);
            this.changeTotal();
            console.log(this.data.plist[index].num)
          base.cart.num(this.data.plist[index].BarCode, re);
        }
    },
    del: function (e) {//删除掉购物车中的某一项商品，并把.del属性设置为true以判断这个商品确实被删除出购物车了
        var index = e.currentTarget.dataset.index;
        console.log(index)
        var BarCode = this.data.plist[index].BarCode;
        //var l = this.data.plist;
        // var _l = [];
        //var obj = { total: 0 };
        // for (var i = 0; i < l.length; i++) {
        //     if (i != index) {
        //         // _l.push(l[i]);
        //         obj.total += l[i].price * l[i].num;
        //     }
        // }

        var key1 = "plist[" + index + "].del";
        console.log(key1)
        var obj = {};
        obj[key1] = true;



        // var ani = wx.createAnimation({
        //     duration: 300,
        //     timingFunction:"ease"
        // })
        // ani.height(0).step();
        // var key = "plist[" + index + "]._ani";
        // obj[key] = ani.export();

        this.setData(obj);



        this.changeTotal();
        base.cart.remove(BarCode);
    },

    clearCart: function () {
        var _this = this;
        if (this.data.total > 0) {
            base.modal({
                title: "确认清空所有商品？", confirmText: "清空", success: function (res) {
                    if (res.confirm) {
                        _this.setData({ plist: [], total: 0 });
                        base.cart.clear();
                    }
                }
            })
        }
    },
    goOrder: function () {
     //   this.ing();
        if (this.data.plist.length > 0 && this.data.total > 0) {
            wx.navigateTo({
                url: '../order/order?from=cart'
            })
        } else {
            base.modal({
                title: '购物车无商品',
                showCancel: false
            })
        }
    },
    tips: ["尽请期待!", "不用点了、暂时下不了单！", "真de、不骗你！", "不信再试试？！", "没错吧？！", "您可以去其它地方转转了！", "嘿、还挺执着！", "就喜欢你这股子劲！", "但没有任何niao用！", "你已经陷入无限轮回..."],
    //,"......", ".........", "好吧、你赢了！", "你即将获得一份随机奖励！", "just for your 执着！", "不过先声明、我们真的还未开放下单！"],
    tipsN: 0,
    ing: function () {
        if (this.tipsN >= this.tips.length) {
            this.tipsN = 0;
        }

        base.modal({
            title: this.tips[this.tipsN],
            showCancel: false
        });
        this.tipsN += 1;



        // if (this.tipsN < this.tips.length) {
        //     base.modal({
        //         title: this.tips[this.tipsN],
        //         showCancel: false
        //     });
        //     this.tipsN += 1;
        // }
        // else {
        //     base.modal({
        //         title: "恭喜",
        //         content: "您已免费获得价值88元经典系列蛋糕优惠券,限领一次",
        //         cancelText: "放弃机会",
        //         confirmText: "立即领取",
        //         showCancel: true,
        //         success: function (res) {
        //             if (res.confirm) {
        //                 wx.navigateTo({
        //                     url: "../buy/buy?type=0&price=88&&pay=free"
        //                 })
        //             } else {

        //             }
        //         }
        //     })
        // }

    },
    p: {
        currentIndex: -1,
        eventOk: true,
        eventStartOk: true,
        aniOk: true,
        len: 0,//当前位置
        ani: wx.createAnimation(),
        // _ani: wx.createAnimation({
        //     duration: 200,
        //     timingFunction: 'ease-out'//
        // }),
        max: 80,
        size: 40
    },
    moveTo: function (index, x) {
        this.p.eventOk = false;//停止事件
        if (x == 0) {
            this.p.currentIndex = -1;
            if (this.p.len > 0 - this.p.max / 2) {
                if (this.p.len > 0) {
                    this.p.ani.translateX(this.p.size).step({
                        duration: 100,
                        timingFunction: 'ease-out'
                    });

                }
                this.p.ani.translateX(0 - this.p.size).step({
                    duration: 200,
                    timingFunction: 'ease'
                });
            }
        }
        if (x == 0 - this.p.max) {
            this.p.currentIndex = index;
            this.p.ani.translateX(x - this.p.size).step({
                duration: 200,
                timingFunction: 'ease'
            });
        }
        this.p.ani.translateX(x).step({
            duration: 200,
            timingFunction: 'ease-out'
        });
        var obj = {};
        var key = "plist[" + index + "].ani";
        obj[key] = this.p.ani.export();
        this.setData(obj);
    },
    ptouchsatrt: function (e) {

        var index = e.currentTarget.dataset.index;
        if (this.p.currentIndex >= 0) {
            this.moveTo(this.p.currentIndex, 0);
            return;
        }
        if (this.p.eventStartOk) {
            this.p.eventOk = true;
            this.p.len = 0;
            var pt = e.changedTouches[0];
            pt.aaaaaaa = 11111;
            this.p.x = pt.pageX;
            this.p.y = pt.pageY;
            console.log("start")
        }
    },
    ptouchend: function (e) {
        if (this.p.eventOk) {
            var pt = e.changedTouches[0];
            var len = pt.pageX - this.p.x;//预计目标位置
            var ht = pt.pageY - this.p.y;
            if (len != 0 && Math.abs(ht) / Math.abs(len) < 0.3) {//滑动倾斜度限制
                this.p.len = len;
                var index = e.currentTarget.dataset.index;
                if (len > 0 - this.p.max / 2) {
                    this.moveTo(index, 0);
                } else {
                    this.moveTo(index, 0 - this.p.max);
                }
            }
        }
        this.p.eventOk = false;
        this.p.eventStartOk = false;
        var _this = this;
        if (this.p.tm) {
            clearTimeout(this.p.tm);
        }
        this.p.tm = setTimeout(function () {
            _this.p.eventStartOk = true;
        }, 300);
    }
});