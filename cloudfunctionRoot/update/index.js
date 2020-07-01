// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (e, context) => {
  console.log(e.tablename)
  console.log(e.data)

  try {
    return await db.collection(e.tablename).doc(e._id).update({
      // data 传入需要局部更新的数据
      data: e.data
    })
  } catch (e) {
    console.error(e)
  }
}