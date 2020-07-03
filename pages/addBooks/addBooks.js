var util = require('../../utils/util');
var config = require('../../config/config');
var dataExchange = require('../../utils/dataExchange')

Page({
  data: {
    imgUrl: '',
    imgPath: '',
    name: '',
    author: '',
    isbn: '',
    publishCompany: '',
    originalPrice: '',
    salePrice: '',
    edition: ''
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: [
        'original', 'compressed'
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

        dataExchange.uploadImage(res.tempFilePaths[0], res => {
          console.log(res); //TODO
          wx.hideLoading()
          var resData = JSON.parse(res.data);

          if (res.statusCode == 200 && resData.status == 200) {
            wx.showToast({
              title: '上传成功'
            })
            that.setData({ imgUrl: config.imgUrl + resData.data })
            that.setData({ imgPath: resData.data })
          }
        })
      }
    })
  },

  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.imgUrl // 需要预览的图片http链接列表
    })
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

  },
  // 9787115335494
  bindIsbn: function (e) {
    this.setData({
      isbn: e.detail.value
    })
  },

  screenInput: function (e) {
    var that = this
    wx.scanCode({
      success: (res) => {
        wx.showLoading({
          title: '正在识别...'
        })
        var isbn = res.result;
        that.bindBookInfo(isbn);
      }
    })
  },
  searchIsbn: function (e) {
    var that = this;
    that.bindBookInfo(that.data.isbn)
  },

  bindBookInfo: function (isbn) {
    var that = this;
    dataExchange.getBookFromDoubanIsbn(isbn, res => {
      if (res.statusCode == 200) {
        
        //去掉'元'字
        var price = res.data.price;
        price = price.substring(0, price.length - 1);

        that.setData({ name: res.data.title })
        that.setData({ publishCompany: res.data.publisher })
        that.setData({ isbn: res.data.isbn13 })
        that.setData({ author: res.data.author[0] })
        that.setData({ originalPrice: price })


        dataExchange.saveImage(res.data.image, res => {
          if (res.statusCode == 200 && res.data.status == 200) {
            that.setData({imgPath: res.data.data})
            that.setData({imgUrl: config.imgUrl + res.data.data})
          }
        })
        wx.hideLoading();
      }
    })
  },

  addBook: function (e) {
    var that = this;
    var book = e.detail.value;
    book.imgUrl = this.data.imgPath
    book.userId = wx.getStorageSync('userId')
    if (book.name == '' || book.isbn == '' || book.author == '' || book.imgUrl == '' ||
      book.edition == '' || book.publishCompany == '' || book.originalPrice == '' ||
      book.salePrice == '') {
      wx.showModal({
        title: '提示',
        content: '你输入的图书信息不完善!',
        success: function (res) {
        }
      });
      return
    }
    var options = {
      url: config.url + '/book/add',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: e.detail.value
    };

    wx.showLoading({
      title: '正在提交...'
    });
    util.request(options, (res, err) => {
      wx.hideLoading();
      if (res.statusCode == 200 && res.data.status == 200) {
        wx.showToast({
          title: "添加成功"
        })
        that.setData({ name: '' })
        that.setData({ author: '' })
        that.setData({ isbn: '' })
        that.setData({ imgPath: '' })
        that.setData({ imgUrl: '' })
        that.setData({ publishCompany: '' })
        that.setData({ edition: '' })
        that.setData({ originalPrice: '' })
        that.setData({salePrice: ''})

      } else {
        wx.showToast({
          title: "添加失败"
        })
      }
    });
  },
  //根据扫码录入控制手动输入的form是否显示

  publish: function () {},

  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  }
})