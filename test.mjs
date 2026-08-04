// 最小连通性测试：验证 Vercel 函数能否连上 MongoDB Atlas
// 使用 @vercel/node 标准 ESM handler 写法 (req, res) -> res.status().json()
import { MongoClient } from 'mongodb';

const URI =
  'mongodb+srv://lu_db_user:plQVr3yHZDsvJQbg@cluster0.zaisgxd.mongodb.net/?authSource=admin&retryWrites=true';

export default async function handler(req, res) {
  const client = new MongoClient(URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 5000,
  });
  const start = Date.now();
  const hardTimeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('HARD_TIMEOUT_50s')), 50000)
  );
  try {
    const work = (async () => {
      await client.connect();
      return await client.db('lublog').command({ ping: 1 });
    })();
    const ping = await Promise.race([work, hardTimeout]);
    res.status(200).json({ ok: true, elapsedMs: Date.now() - start, ping });
  } catch (e) {
    res.status(500).json({
      ok: false,
      elapsedMs: Date.now() - start,
      error: String(e),
      type: e?.constructor?.name,
    });
  } finally {
    await client.close().catch(() => {});
  }
}