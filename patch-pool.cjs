// 兼容垫片：think-mongo 写死 generic-pool 的 acquireTimeoutMillis = 3000，
// 而 MongoDB 驱动 serverSelectionTimeoutMS 默认 30 秒。
// Vercel 函数冷启动 + 网络握手经常超过 3 秒，pool 先超时杀掉连接。
// 此垫片在 require('@waline/vercel') 之前 monkey-patch genericPool.createPool，
// 把 acquireTimeoutMillis 提升到 30 秒。
const genericPool = require('generic-pool');
const origCreatePool = genericPool.createPool.bind(genericPool);
genericPool.createPool = function (factory, opts) {
  opts = opts || {};
  if (!opts.acquireTimeoutMillis || opts.acquireTimeoutMillis < 30000) {
    opts.acquireTimeoutMillis = 30000;
  }
  return origCreatePool(factory, opts);
};