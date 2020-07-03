var util = require('./util')
var config = require('../config/config');
var url = config.url;

function login(code, nickName, avatarUrl, cb) {

    util.request({
        url: config.url + 'user/login',
        method: 'post',
        header: {
            "content-type": "application/x-www-form-urlencoded"
        },
        data: util.json2Form({code: code, nickName: nickName, avatarUrl: avatarUrl})
    }, res => {
        if (res.statusCode == 200 && res.data.status == 200) {
            wx.setStorageSync('userId', res.data.data.userId);
            wx.setStorageSync('token', res.data.data.token);
            typeof cb == 'function' && cb(res.data.data.userId)
        }
    })
}

function checkLogin(cb) {

    var userId = wx.getStorageSync('userId');

    if (userId == null || userId == '') {
        wx.login({
            success: function (res) {
                getUserInfo(res.code, cb);
            }
        })
    } else {
        wx.checkSession({
            success: function () {
                getUserInfo(0, cb);
            },
            fail: function () {
                wx.login({
                    success: function (res) {
                        getUserInfo(res.code, cb);
                    }
                })
            }
        })
    }

}

function getUserInfo(code, cb) {
    wx.getUserInfo({
        success: function (res) {
            wx.setStorageSync('userInfo', res.userInfo);
            if (code != 'undefined' && code != 0) {
                login(code, res.userInfo.nickName, res.userInfo.avatarUrl, cb);
            } else {
                cb(wx.getStorageSync('userId'))
            }
        }
    })
}

function getProfile(userId, cb) {
    util.request({
        url: config.url + "user/" + userId,
        method: 'get'
    }, cb)
}

function updateProfile(data, cb) {
    data.id = wx.getStorageSync("userId");
    console.log(data) //TODO
    util.request({
        url: config.url + "user/update",
        method: 'post',
        header: {
            "content-type": "application/x-www-form-urlencoded"
        },
        data: util.json2Form(data)
    }, cb)
}

function uploadImage(filePath, cb) {

    wx.uploadFile({
        url: config.url + "/image/upload",
        filePath: filePath,
        name: 'file',
        success: function (res) {
            cb(res)
        },
        fail: function (res) {
            cb(res)
        }
    })

}

function getBookFromDoubanIsbn(isbn, cb) {
    util.request({
        url: config.doubanIsbn + isbn,
        method: 'get',
        header: {
            "content-type": "application/x-www-form-urlencoded"
        },
        data: util.json2Form({url: url})
    }, cb)
}

/**
 * 将本地得到的图片url上传至服务器保存
 * @param {*} url
 */
function saveImage(url, cb) {
    util.request({
        url: config.url + 'image/save',
        method: 'post',
        header: {
            "content-type": "application/x-www-form-urlencoded"
        },
        data: util.json2Form({url: url})
    }, cb)
}

function getBookByName(name, userId, page, size, cb) {

    util.request({
        url: config.url + 'book/list/name',
        method: 'get',
        data: {
            name: name,
            userId: userId,
            page: page,
            size: size
        }
    }, cb)
}

function getAllBook(userId, page, size, cb) {
    util.request({
        url: config.url + 'book/list',
        method: 'get',
        data: {
            page: page,
            userId: userId,
            size: size
        }
    }, cb)
}

function getBookById(id, cb) {
    util.request({
        url: config.url + 'book/' + id,
        method: 'get'
    }, cb)
}

function getUserById(id, cb) {
    util.request({
        url: config.url + 'user/' + id,
        method: 'get'
    }, cb)
}

function addOrder(data, cb) {
    data.userId = wx.getStorageSync('userId');
    util.request({
        url: config.url + 'order/add',
        method: 'post',
        header: {
            "content-type": "application/x-www-form-urlencoded"
        },
        data: util.json2Form(data)
    }, cb)
}

function getBookByUserId(userId, cb) {
    util.request({
        url: config.url + '/book/list/user/' + userId,
        method: 'get'
    }, cb)
}

function updateBookStatus(id, status, cb) {
    util.request({
        url: config.url + '/book/update/status/' + id + '/' + status,
        method: 'post'
    }, cb)
}

function getOrderByUserId(userId, cb) {
    util.request({
        url: config.url + 'order/user/' + userId,
        method: 'get'
    }, cb)
}

function cancelOrder(id, cb) {
    util.request({
        url: config.url + 'order/cancel/' + id,
        method: 'post'
    }, cb)
}

function getConversations(userId, cb) {
    util.request({
        url: config.url + 'message/list',
        method: 'get',
        data: {
            userId: userId
        }
    }, cb)
}

function getMessageByConversation(conversationId, cb) {
    util.request({
        url: config.url + 'message/conversation',
        method: 'get',
        data: {
            conversationId,
            conversationId
        }
    }, cb)
}

function setMessagehasRead(conversationId) {
    util.request({
        url: config.url + 'message/read',
        method: 'get',
        data: {
            conversationId,
            conversationId
        }
    })
}

module.exports = {
    checkLogin: checkLogin,
    getUserInfo: getUserInfo,
    getProfile: getProfile,
    updateProfile: updateProfile,
    uploadImage: uploadImage,
    getBookFromDoubanIsbn: getBookFromDoubanIsbn,
    saveImage: saveImage,
    getBookByName: getBookByName,
    getAllBook: getAllBook,
    getBookById: getBookById,
    getUserById: getUserById,
    addOrder: addOrder,
    getBookByUserId: getBookByUserId,
    updateBookStatus: updateBookStatus,
    getOrderByUserId: getOrderByUserId,
    cancelOrder: cancelOrder,
    getConversations: getConversations,
    getMessageByConversation: getMessageByConversation,
    setMessagehasRead: setMessagehasRead
}