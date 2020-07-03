var dataExchange = require('../../utils/dataExchange')

Page({

  data: {
    orderList: [],
  },

  onLoad: function () {
    var that = this;
    var userId = wx.getStorageSync('userId');
    dataExchange.getOrderByUserId(userId, res => {
      if (res.statusCode === 200 && res.data.status === 200) {
        that.setData({orderList: res.data.data})
      }
    })

  }, 
  cancelOrder: function (event) {

    var that = this;

    var item = event.currentTarget.dataset.item;

    dataExchange.cancelOrder(item.id, res => {
      if (res.statusCode === 200 && res.data.status === 200) {
        wx.showToast({
          title: '取消成功'
        })
      }
      item.status = 1;
    })
  }
})