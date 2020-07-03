var dataExchange = require('../../utils/dataExchange')

Page({
    /**
   * 页面的初始数据
   */
    data: {
        messages: [],
        inputVal: '',
        targetId: '',
        targetNickName: '',
        targetAvatarUrl: '',
        myNickName: '',
        myAvatarUrl: '',
        userId: '',
        messageBoardHeight: '',
        focus: false
    },

    onLoad: function (options) {

        var that = this;
        var conversationId = options.conversationId;

        var userInfo = wx.getStorageSync("userInfo");
        that.setData({myNickName: userInfo.nickName, myAvatarUrl: userInfo.avatarUrl})

        //根据conversationId得到对方的用户id，然后获取昵称，头像
        console.log(conversationId)
        var ids = conversationId.split('_');

        var userId = wx.getStorageSync('userId');
        that.setData({userId: userId})
        var targetId;
        console.log(ids);
        if (ids[0] == userId) {
            targetId = ids[1];
        } else {
            targetId = ids[0];
        }

        that.setData({
            targetId: Number.parseInt(targetId)
        })

        dataExchange.getUserById(targetId, res => {
            if (res.statusCode == 200 && res.data.status == 200) {

                that.setData({targetNickName: res.data.data.nickName, targetAvatarUrl: res.data.data.avatarUrl})

                wx.setNavigationBarTitle({title: res.data.data.nickName})
            }
        })

        dataExchange.getMessageByConversation(conversationId, res => {
            if (res.statusCode == 200 && res.data.status == 200) {
                var data = res.data.data;
                that.setData({messages: data})
                if (that.data.messages != null && that.data.messages.length != 0) {
                    //设置消息面板滚动到底部
                    var lastMessage = "message-id-" + data[data.length - 1].id
                    that.setData({lastMessage: lastMessage})
                }

            }
        })

        var windowHeight = wx
            .getSystemInfoSync()
            .windowHeight;

        var boardHeight = (windowHeight * 2 - 100) + 'rpx';

        that.setData({messageBoardHeight: boardHeight})

        //设置消息为已读

        dataExchange.setMessagehasRead(conversationId)

        //监听socket消息
        wx.onSocketMessage(res => {
            var data = JSON.parse(res.data);
            var messageList = that.data.messages;
            messageList.push(data);

            that.setData({messages: messageList})

            //如果返回的是自己发送的消息，就清空输入框
            if (data.fromId == that.data.userId) {
                that.setData({inputVal: ''})
            }
            if (that.data.messages != null && that.data.messages.length != 0) {
                //设置聊天面板滚动底部
                var lastMessage = "message-id-" + that.data.messages[that.data.messages.length - 1].id
                that.setData({lastMessage: lastMessage})
            }

        })

    },

    sendMessage: function () {
        var that = this;
        if (that.data.inputVal.trim() == '') {
            return;
        }

        var message = {
            fromId: that.data.userId,
            toId: that.data.targetId,
            content: that.data.inputVal
        }
        try {
            wx.sendSocketMessage({
                data: JSON.stringify(message)
            })
        } catch (err) {
            //开启websocket
            wx.connectSocket({
                url: config.socketUrl + 'chat',
                header: {
                    'content-type': 'application/json'
                }
            })

            wx.onSocketOpen(res => {
                app.socketOpen = true;
                var userId = wx.getStorageSync('userId');

                if (userId != null && userId != '') {
                    wx.sendSocketMessage({
                        data: "userid-" + userId
                    })
                }
            })
        }

    },
    inputTyping: function (event) {
        var that = this;
        that.setData({inputVal: event.detail.value})
    }
})