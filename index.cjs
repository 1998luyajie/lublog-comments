// 必须放在最前：在 think-mongo 解构 mongodb.ObjectID 之前补齐
require('./patch-mongodb.cjs');

const Application = require('@waline/vercel');

module.exports = Application({
  plugins: [],
  async postSave(comment) {
    // do what ever you want after comment saved
  },
});
