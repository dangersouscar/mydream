var base = getApp();
var common = require('../../../utils/common');
var util = require('../../../lib/util.js');
var config = require('../../../config.js');
var cos = require('../../../lib/cos.js');
Page({
    data: {
      count:0,
      _id:"",
      BarCode: "",
      ProductName: "",
      ProductPrice: "",
      DescribeA: "",
      DescribeB: "",
      imgUrl:[],
      imgPath: [],

    },
  changeCode: function (e) {
    this.setData({
      BarCode: e.detail.value
    })
  },
  changeName: function (e) {
    this.setData({
      ProductName: e.detail.value
    })
  },
  changePrice: function (e) {
    this.setData({
      ProductPrice: e.detail.value
    })
  },
  bindDescribeA: function (e) {
    this.setData({
      DescribeA: e.detail.value
    })
  },
  bindDescribeB: function (e) {
    this.setData({
      DescribeB: e.detail.value
    })
  },


	uploadImage() {
        var that = this
        that.data.count=that.data.count+1
        if(that.data.count==1){
          that.setData({ imgUrl: "" })
          that.setData({ imgPath: "" })
        }
        wx.chooseImage({
            camera: 'back',
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                var filePath = res.tempFilePaths[0];
                console.log(filePath)
                if (filePath) {
                    var Key = util.getRandFileName(filePath);
                    wx.showLoading({title: '正在上传...'});
                    cos.postObject({
                        Bucket: config.Bucket,
                        Region: config.Region,
                        Key: Key,
                        FilePath: filePath,
                    }, function (err, data) {
                        wx.hideLoading();
                        console.log(data)
                        if (data && data.Location) {
                            wx.showToast({ title: '上传成功', icon: 'error', duration: 2000 });
                            console.log(data)
                          var x = that.data.imgUrl
                          var t = 'https://' + data.Location
                          console.log(t)
                          x.push (t)
                          console.log(x)
                          that.setData({ imgUrl: x })
                          var y = that.data.imgPath
                          y.push(filePath)
                          that.setData({ imgPath: y })
                            // that.setData({ imgPath: filePath })
                        } else {
                            wx.showToast({title: '上传失败,请重新上传', icon: 'error', duration: 2000});
                        }
                    });
                }
            }
        })
    },
  chooseImage: function (e) {
    var that = this;
    wx.cloud.init({
      traceUser: true
    })
    const db = wx.cloud.database({
      env: 'cdh1-61abq'
    })
    if (that.data.isbn == '') {
      wx.showModal({
        title: '提示',
        content: '请先完善其它信息再上传图片!',
        success: function (res) {
        }
      });
      return
    }
    wx.chooseImage({
      count: 1,
      sizeType: [
        'compressed'
      ], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: [
        'album', 'camera'
      ], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片

        wx.showLoading({
          title: "正在上传...",
          mask: true
        })
        console.log("caidenghong" + res.tempFilePaths[0]),
          that.setData({ imgPath: res.tempFilePaths[0] })
        that.setData({ imgUrl: "https://6364-cdh1-61abq-1253947787.tcb.qcloud.la/" + Date.parse(new Date()) + ".jpg" })
        var picturename = Date.parse(new Date()) + ".jpg"
        console.log(that.data);
        wx.cloud.uploadFile({
          cloudPath: picturename,
          filePath: res.tempFilePaths[0], // 文件路径
          success: res => {
            // get resource ID
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '图片上传成功，是否继续上传其它图片!',
              success: function (res) {
                if (res.confirm) {
                  console.log(res)
                  that.chooseImage()
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            });
          },
          fail: err => {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '上传失败，是否继续上传其它图片!',
              success: function (res) {
                if (res.confirm) {
                  console.log(res)
                  that.chooseImage()
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
               
              }
            });
          }
        })
      }
    })
  },
    onLoad: function (e) {
      var dic = wx.getStorageSync("goods")
      var barcode=e.barcode
      var that=this

      console.log(dic)
      that.setData({ BarCode: dic[barcode].BarCode, ProductName: dic[barcode].ProductName, ProductPrice: dic[barcode].ProductPrice, DescribeA: dic[barcode].DescribeA, DescribeB: dic[barcode].DescribeB, _id: dic[barcode]._id, imgUrl: dic[barcode].imgUrl, imgPath: dic[barcode].imgUrl})

    },
    onShow: function (e) {

    },

    valid: function () {
        var _this = this;
        var err = "";
        if (!_this.data.oinfo.Consignee) {
            err = "请选择收货人信息！";
            wx.showModal({
                showCancel: false,
                title: '',
                content: err
            })
            return false;
        }
        if (!_this.data.oinfo.DeliveryDate) {
            err = "请选择配送日期！";
            wx.showModal({
                showCancel: false,
                title: '',
                content: err
            })
            return false;
        }
        if (!_this.data.oinfo.DeliveryTime) {
            err = "请选择配送时间段！";
            wx.showModal({
                showCancel: false,
                title: '',
                content: err
            })
            return false;
        }
        return true;
    },
    submit: function (e) {
      var that = this;
      var  goods = e.detail.value;
      console.log(goods)
      console.log(e)
      // book.userId = wx.getStorageSync('userId')
      if (goods.BarCode == '' || goods.ProductName == '' || goods.ProductPrice == '' || goods.DescribeA == '' ||
        goods.DescribeB == '' ) {
        wx.showModal({
          title: '提示',
          content: '你输入的商品信息不完善!',
          success: function (res) {
          }
        });
        return
      }
      console.log(e)
      wx.showLoading({
        title: '正在提交...'
      });
      console.log("哈哈")
      const db = wx.cloud.database({
        env: 'cdh1-61abq',
      })
      db.collection('myshop').doc(that.data._id).update({
        // data 字段表示需新增的 JSON 数据
        data: {
          // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
          BarCode: goods.BarCode,
          ProductName: goods.ProductName,
          ProductPrice: goods.ProductPrice,
          DescribeA: goods.DescribeA,
          DescribeB: goods.DescribeB,
          imgUrl: that.data.imgUrl,
          time: common.formatTime(new Date()),
        },
        success: function (res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log(res)
          wx.showToast({
            title: "添加成功"
          })
          that.setData({ BarCode: '' })
          that.setData({ ProductName: '' })
          that.setData({ ProductPrice: '' })
          that.setData({ DescribeA: '' })
          that.setData({ DescribeB: '' })
          that.setData({ imgUrl: '' })
          that.setData({ imgPath: '', count: "" })
        },
        fail: console.error,
        complete: console.log
      })
    }
})