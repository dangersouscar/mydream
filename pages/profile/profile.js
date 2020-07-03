
var dataExchange = require('../../utils/dataExchange')

Page({

  data: {
    disabled: true,
    btnShow: true,
    school: '',
    major: '',
    phone: ''
  },

  onLoad: function () {
    
    var that = this;

    var userId = wx.getStorageSync("userId");

    dataExchange.getProfile(userId, res => {
      console.log(res);
      that.setData({ school: res.data.data.school })
      that.setData({ major: res.data.data.major })
      that.setData({ phone: res.data.data.phone })
    })

  },

  updateShow: function () {
    console.log('update');
    var that = this;

    that.setData({disabled: !that.data.disabled});
    that.setData({btnShow: !that.data.btnShow});
  },

  confirmUpdate: function (event) {
    var that = this;
    
    var value = event.detail.value;
    if (value.school == '' || value.major == '') {
      return
    }
    wx.showLoading({
      title: '正在加载...'
    })
    dataExchange.updateProfile(event.detail.value, res => {
      if (res.statusCode == 200 && res.data.status == 200) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
        that.updateShow();
        wx.hideLoading();
      }
    })

  }

})