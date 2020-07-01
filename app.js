//app.js
var common = require('./utils/common');
App({
    version: {
        key: "version",
        current: "1.0.2",
        getValue: function () {
            return wx.getStorageSync(this.key);
        }
    },
    path: {
        res: "https://res.bestcake.com/",
        //www: "https://mcstj.bestcake.com/"
        www:"http://localhost:9419/"
    },
    user: {//用户相关操作
        userid: 0,//用户ID
        sessionid: "",//秘钥
        jzb: 0,
        exp: 0,
        phone: "",
        levels: 0,
        headimg: "",
        islogin: function (tp) {
            var re = false;
            if (this.userid > 0) {
                re = true;
            } else {
                if (tp == true) {
                    wx.navigateTo({
                        url: '../phone/phone'
                    })
                }
            }
            return re;
        },
        key: "userkey",
        setCache: function (obj) {
            wx.setStorageSync(this.key, obj);
        },
        getCache: function () {
            return wx.getStorageSync(this.key);
        },        
        clear: function () {
            wx.removeStorageSync(this.key);
        }
    },
    city: {

    },
    cart: {//购物车相关操作
        key: "cart",
        ref: "",
        add: function (p) {
            var re = false;
          if (p.BarCode && p.DescribeA && p.DescribeB && p.ProductName && p.ProductPrice && p.imgUrl ) {
                var dic = wx.getStorageSync(this.key) || {};
              if (p.BarCode in dic) {                                                          
                  dic[p.BarCode].num += 1;
                } else {
                dic[p.BarCode] = { BarCode: p.BarCode, DescribeA: p.DescribeA, DescribeB: p.DescribeB, ProductName: p.ProductName, ProductPrice: p.ProductPrice, imgUrl: p.imgUrl, num:1 }
                }
                wx.setStorageSync(this.key, dic);
                re = true;
            }
            return re;
        },
        exist: function (sno) {
            var re = false;
            var dic = wx.getStorageSync(this.key) || {};
            if (sno in dic) {
                re = true;
            }
            return re;
        },
        remove: function (sno) {
            var dic = wx.getStorageSync(this.key) || {};
            if (sno in dic) {
                delete dic[sno];
                wx.setStorageSync(this.key, dic);
            }
        },
        getNum: function () {//获取当前物品的数量
            var n = 0;
            var dic = wx.getStorageSync(this.key) || {}
            console.log(dic)
            console.log("蔡登鸿要知道")
            for (var i in dic) {
              console.log(i)
              n += dic[i].num;
            }
            return n;
        },
        num: function (sno, n) {
            var dic = wx.getStorageSync(this.key) || {};
            if (sno in dic) {
                if (n > 0) {
                    console.log(sno)
                    dic[sno].num = n;
                } else {
                    delete dic[sno];
                }
                wx.setStorageSync(this.key, dic);
            }
        },
        getList: function () {
            var list = [];
            var dic = wx.getStorageSync(this.key);
            for (var p in dic) {
              list.push({ BarCode: p, DescribeA: dic[p].DescribeA, DescribeB: dic[p].DescribeB, ProductName: dic[p].ProductName, ProductPrice: dic[p].ProductPrice, imgUrl: dic[p].imgUrl, num: dic[p].num });
            }
            return list;
        },
        clear: function () {
            wx.removeStorageSync(this.key);
        }
    },
    goods: {//购物车相关操作
      key: "goods",
      ref: "",
      add: function (p) {
        var re = false;
        console.log(p)
        if (p.BarCode && p.DescribeA && p.DescribeB && p.ProductName && p.ProductPrice && p.imgUrl) {
          var dic = wx.getStorageSync(this.key) || {};
          if (p.BarCode in dic) {
          } else {
            dic[p.BarCode] = { BarCode: p.BarCode, DescribeA: p.DescribeA, DescribeB: p.DescribeB, ProductName: p.ProductName, ProductPrice: p.ProductPrice, imgUrl: p.imgUrl, _id: p._id }
            wx.setStorageSync(this.key, dic);
            re = true;
          }
          
        }
        return re;
      },
      exist: function (sno) {
        var re = false;
        var dic = wx.getStorageSync(this.key) || {};
        if (sno in dic) {
          re = true;
        }
        return re;
      },
      remove: function (sno) {
        var dic = wx.getStorageSync(this.key) || {};
        if (sno in dic) {
          delete dic[sno];
          wx.setStorageSync(this.key, dic);
        }
      },
      getNum: function () {//获取当前物品的数量
        var n = 0;
        var dic = wx.getStorageSync(this.key) || {}
        console.log(dic)
        console.log("蔡登鸿要知道")
        for (var i in dic) {
          console.log(i)
          n += dic[i].num;
        }
        return n;
      },
      num: function (sno, n) {
        var dic = wx.getStorageSync(this.key) || {};
        if (sno in dic) {
          if (n > 0) {
            dic[sno].num = n;
          } else {
            delete dic[sno];
          }
          wx.setStorageSync(this.key, dic);
        }
      },
      getList: function () {
        var list = [];
        var dic = wx.getStorageSync(this.key);
        for (var p in dic) {
          list.push({ BarCode: p, DescribeA: dic[p].DescribeA, DescribeB: dic[p].DescribeB, ProductName: dic[p].ProductName, ProductPrice: dic[p].ProductPrice, imgUrl: dic[p].imgUrl, num: dic[p].num, _id: dic[p]._id});
        }
        return list;
      },
      getgoodname: function () {
        var list = [];
        var dic = wx.getStorageSync(this.key);
        for (var p in dic) {
          console.log(p)
          list.push(dic[p].ProductName);
        }
        return list;
      },
      clear: function () {
        wx.removeStorageSync(this.key);
      }
    },
    userlogin: {//购物车相关操作
      key: "userlogin",
      ref: "",
      add: function (p) {
        var re = false;
        console.log(p)
        if (p.companyname && p.password ) {
          var dic = wx.getStorageSync(this.key) || {};
          if (p.companyname in dic) {
          } else {
            dic["companyname"] = p.companyname,
            dic["password"] = p.password
            wx.setStorageSync(this.key, dic);
            re = true;
          }

        }
        return re;
      },
      exist: function (sno) {
        var re = false;
        var dic = wx.getStorageSync(this.key) || {};
        if (sno in dic) {
          re = true;
        }
        return re;
      },
      remove: function (sno) {
        var dic = wx.getStorageSync(this.key) || {};
        if (sno in dic) {
          delete dic[sno];
          wx.setStorageSync(this.key, dic);
        }
      },
      getNum: function () {//获取当前物品的数量
        var n = 0;
        var dic = wx.getStorageSync(this.key) || {}
        console.log(dic)
        console.log("蔡登鸿要知道")
        for (var i in dic) {
          console.log(i)
          n += dic[i].num;
        }
        return n;
      },
      num: function (sno, n) {
        var dic = wx.getStorageSync(this.key) || {};
        if (sno in dic) {
          if (n > 0) {
            dic[sno].num = n;
          } else {
            delete dic[sno];
          }
          wx.setStorageSync(this.key, dic);
        }
      },
      getList: function () {
        var list = [];
        var dic = wx.getStorageSync(this.key);
        for (var p in dic) {
          list.push({ BarCode: p, DescribeA: dic[p].DescribeA, DescribeB: dic[p].DescribeB, ProductName: dic[p].ProductName, ProductPrice: dic[p].ProductPrice, imgUrl: dic[p].imgUrl, num: dic[p].num, _id: dic[p]._id });
        }
        return list;
      },
      getgoodname: function () {
        var list = [];
        var dic = wx.getStorageSync(this.key);
        for (var p in dic) {
          console.log(p)
          list.push(dic[p].ProductName);
        }
        return list;
      },
      clear: function () {
        wx.removeStorageSync(this.key);
      }
    },
    openid: {//购物车相关操作
      key: "openid",
      ref: "",
      add: function (cb) {
        var openid = wx.getStorageSync("openid") || {};
        if (wx.getStorageSync("openid")){
        }else{
          wx.cloud.callFunction({
            // 要调用的云函数名称
            name: 'openid',
            // 传递给云函数的event参数
          }).then(res => {
            var id = res.result.openid
            wx.setStorageSync("openid", id)
          }).catch(err => {
            console.log(err)
          })
        }
        cb(openid)
      },
      exist: function (sno) {
        var re = false;
        var dic = wx.getStorageSync(this.key) || {};
        if (sno in dic) {
          re = true;
        }
        return re;
      },
      remove: function (sno) {
        var dic = wx.getStorageSync(this.key) || {};
        if (sno in dic) {
          delete dic[sno];
          wx.setStorageSync(this.key, dic);
        }
      },
      clear: function () {
        wx.removeStorageSync(this.key);
      }
    },
    cake: {
        tab: null,
        key: "cake",
        setCache: function (obj) {
            wx.setStorageSync(this.key, obj);
            var vs = getApp().version;
            wx.setStorageSync(vs.key, vs.current);//设置当前版本号
        },
        getCache: function () {
            return wx.getStorageSync(this.key);
        },
        getByName: function (nm) {
            var p = null;
            var dic = wx.getStorageSync(this.key) || {};
            if (nm in dic) {
                p = dic[nm];
            }
            return p;
        }
    },
    onLaunch: function () {
      wx.cloud.init({
        traceUser: true
      })
      const db = wx.cloud.database({
        env: 'cdh1-61abq'
      })
        //调用API从本地缓存中获取数据     
        var _this = this;
        var obj = _this.user.getCache("userkey");
        if (obj != null) {
            _this.user.userid = obj.userid;
            _this.user.sessionid = obj.sessionid;
            _this.user.jzb = obj.jzb;
            _this.user.exp = obj.exp;
            _this.user.phone = obj.phone;
            _this.user.levels = obj.levels;
            _this.user.headimg = obj.headimg;

        }    
    },
    onLoad: function () {
      wx.cloud.init({
        env: 'dh1-61abq'
      })

    },
    onShow: function () {
    },
    onHide: function () {
        var rrr = 1;       
    },  
    queryAllgoods: function () {
      var that = this
      console.log("查询图书")
      wx.hideLoading();
      const db = wx.cloud.database({
        env: 'cdh1-61abq',
      })
      console.log(db)
      db.collection('myshop')
        .get({
          success: res => {
            console.log(res)
            for (var i = 0; i < res.data.length; i++) {
              base.goods.add(
                res.data[i]
              )
            }
          }
        })
    },
    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function (v) {
                    console.log(v);
                    wx.getUserInfo({
                        success: function (res) {
                            console.log(res);
                            that.globalData.userInfo = res.userInfo
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },
    globalData: {
        userInfo: null
    },
    current: function () {
        var list = getCurrentPages();
        return list[list.length - 1];
    },
    load: function (p) {
        p = p ? p : {};
        var _obj = {//标准化
            data: {
            },
        };
        var base = { "onLoad": function () { }, "onReady": function () { }, "onShow": function () { }, "onHide": function () { }, "onUnload": function () { } };
        for (var i in base) {
            _obj[i] = (function (etype) {
                var _etype = "_" + etype;
                if (etype in p) {
                    _obj[_etype] = p[i];//重写局部定义
                };
                return function (e) {
                    base[etype]();//执行 global
                    _obj[_etype] && _obj[_etype](e);
                }
            })(i)
        };
        for (var o in p) {
            if (!(o in base)) {
                if (o == "data") {
                    for (var d in p[o]) {
                        _obj.data[d] = p[o][d];
                    }
                } else {
                    _obj[o] = p[o];
                }
            }
        };
        Page(_obj);
    },
    modal: function (p) {
        wx.showModal(p)
    },
    toast: function (p) {
        wx.showToast(p);
    },
    loading: (function () {
        return {
            show: function (p) {
                p = p ? p : {};
                wx.showToast({
                    title: p.title || '加载中',
                    icon: 'loading',
                    duration: p.duration || 10000
                })
            },
            hide: function () {
                wx.hideToast();
            }
        }
    })(),
    get: function (p, suc, tit) {
      var _this = this;
        //var loaded = false;//请求状态
      const db = wx.cloud.database({
        env: 'cdh1-61abq',
      })
      console.log(p)
      db.collection(p.tablename)
      .where(p.codition)
      .skip(p.pagenum)
      .orderBy('time', 'desc')
      .limit(20)
      .get({
        success: res => {
          var l =[]
          console.log(res)
          console.log(p.tablename)
          for (var i = 0; i < res.data.length; i++) {
            l.push(res.data[i])
          }
          suc(l);
        },
        fail: err => {
          suc(l);
          console.log(err)
        }
      })
    },
    post: function (p, suc) {//购物车信息及送货地址信息
      var that = this;
      console.log(p.tablename)
      //var loaded = false;//请求状态
      const db = wx.cloud.database({
        env: 'cdh1-61abq',
      })
      db.collection(p.tablename).add({
        // data 字段表示需新增的 JSON 数据
        data: p.data,
        success: function (res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log(res)
          wx.showToast({
            title: "添加成功"
          })
          suc(res);
        },
        fail: console.error,
        complete: console.log
      }) 
    },
    del: function (p, suc) {//购物车信息及送货地址信息
      var that = this;
      console.log(p.tablename)
      //var loaded = false;//请求状态
      if(p._id){
        const db = wx.cloud.database({
          env: 'cdh1-61abq',
        })
        wx.showModal({
          title: '提示',
          content: '确定需要删除？',
          success: function (res) {
            if (res.confirm) {
              db.collection(p.tablename).doc(p._id).remove({
                success: function (res) {
                  console.log(p._id + "删除成功")
                  wx.showToast({
                    title: "删除成功"
                  })
                  suc(res)
                },
                fail: function (res) {
                  console.log(db)
                  console.log(p._id + "删除失败")
                  wx.showToast({
                    title: "删除失败"
                  })
                }

              })


            } else if (res.cancel) {
              console.log('用户点击取消')
            }

          }
        });
      }
    },
    update: function (p, suc) {//购物车信息及送货地址信息
      var that = this;
      console.log(p.tablename)
      //var loaded = false;//请求状态
      if (p._id) {
        const db = wx.cloud.database({
          env: 'cdh1-61abq',
        })
        db.collection(p.tablename).doc(p._id).update({
          // data 字段表示需新增的 JSON 数据
          data:p.data,
          success: function (res) {
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            console.log(res)
            wx.showToast({
              title: "添加成功"
            })
            suc(res)
          },
          fail: console.error,
          complete: console.log
        })
      }
    },
    json2Form: function (json) {
        var str = [];
        for (var p in json) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
        }
        return str.join("&");
    }
});