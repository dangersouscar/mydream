// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()


// 云函数入口函数
exports.main = async (p, context) => {
  console.log(p)
  console.log(p.tablename)
  try {



    return await db.collection(p.tablename)
      .where(p.codition)
      .skip(p.pagenum)
      .orderBy('time', 'desc')
      .limit(100)
      .get()



  } catch (e) {
    console.error(e)
  }
}