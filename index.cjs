// 必须放在最前：在 think-mongo 解构 mongodb.ObjectID 之前补齐
require('./patch-mongodb.cjs');
// 提升 generic-pool acquire 超时，避免 Vercel 冷启动被掐
require('./patch-pool.cjs');

const Application = require('@waline/vercel');

module.exports = Application({
  plugins: [],
  async postSave(comment) {
    // do what ever you want after comment saved
  },
});
