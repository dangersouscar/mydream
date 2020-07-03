
var dataExchange = require('../../utils/dataExchange')
Page({
  data:{
    bookName: '',
    author: '',
    edition: ''
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    
  },
  addOrder:function(e){
    var that=this;
    
    var data = e.detail.value

    if (data.bookName.trim() == '') {
      wx.showModal({
        title: '提示',
        content: '未填写书名'
      })
      return 
    }

    dataExchange.addOrder(data, res => {
      if (res.statusCode === 200 && res.data.status === 200) {
        wx.showToast({
          title: "添加成功"
        })
        that.setData({ author: '' })
        that.setData({ bookName: '' })
        that.setData({ edition: '' })
      }
    })




  },

  onReady:function(){
    // 页面渲染完成
    
  },
  onShow:function(){
    // 页面显示
    
  },
  onHide:function(){
    // 页面隐藏
    
  },
  onUnload:function(){
    // 页面关闭
    
  }
})