// Waline 服务端入口（Vercel 原生部署）
// 使用 @waline/vercel 提供的 Vercel Serverless 适配器（CommonJS）。
// 数据库后端由环境变量自动探测：配置了 MONGO_* 即启用 MongoDB。
const Application = require('@waline/vercel');

module.exports = Application({
  plugins: [],
  async postSave(comment) {
    // 评论保存后的回调钩子，可在此加通知/审核逻辑
  },
});
