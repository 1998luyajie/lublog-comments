// 兼容垫片：think-mongo@2.2.1 的 model.js 顶部
//   const { ObjectID } = require('mongodb')
// 而 mongodb driver 6.x 已移除 ObjectID（大写 D 旧名），
// 解构出来 undefined，导致后续 instanceof ObjectID 抛
// "Right-hand side of 'instanceof' is not an object"。
// 此垫片在 require('@waline/vercel') 之前执行，给 mongodb
// module exports 补回 ObjectID 别名指向 ObjectId。
const mongodb = require('mongodb');
if (!mongodb.ObjectID && mongodb.ObjectId) {
  mongodb.ObjectID = mongodb.ObjectId;
}