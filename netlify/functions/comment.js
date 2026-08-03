const http = require('http');
const Waline = require('@waline/vercel');
const serverless = require('serverless-http');

// 中和 Twikoo 时代残留的 MONGODB_URI（指向已停用的旧集群 cluster0），
// 确保 Waline 使用正确的 MONGO_* 系列变量连接新集群。
delete process.env.MONGODB_URI;

const app = Waline({
  env: 'netlify',
  async postSave(comment) {
    // do what ever you want after save comment
  },
});

const PREFIX = '/.netlify/functions/comment';

// Netlify 会把完整路径（含 /.netlify/functions/comment）传给函数，
// 剥掉前缀让 Waline 正确匹配 /ui/register、/comment 等路由。
const sls = serverless(http.createServer(app), {
  request(requestId, event) {
    if (event && event.path && event.path.startsWith(PREFIX)) {
      event.path = event.path.slice(PREFIX.length) || '/';
    }
    if (event && event.rawUrl && event.rawUrl.indexOf(PREFIX) !== -1) {
      event.rawUrl = event.rawUrl.replace(PREFIX, '');
    }
  },
});

module.exports.handler = sls;
