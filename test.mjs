// 最小连通性测试：验证 Vercel 函数能否连上 MongoDB Atlas
// 两层防御：驱动超时 5s + JS 硬超时 50s（强制函数在 50s 内一定返回）
import { MongoClient } from 'mongodb';

const URI =
  'mongodb+srv://lu_db_user:plQVr3yHZDsvJQbg@cluster0.zaisgxd.mongodb.net/?authSource=admin&retryWrites=true';

export default async function handler(req) {
  const client = new MongoClient(URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 5000,
  });
  const start = Date.now();
  const hardTimeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('HARD_TIMEOUT_50s — driver 自身未在 50s 内 reject')), 50000)
  );
  try {
    const work = (async () => {
      await client.connect();
      return await client.db('lublog').command({ ping: 1 });
    })();
    const ping = await Promise.race([work, hardTimeout]);
    return new Response(
      JSON.stringify({ ok: true, elapsedMs: Date.now() - start, ping }),
      { headers: { 'content-type': 'application/json' } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        ok: false,
        elapsedMs: Date.now() - start,
        error: String(e),
        type: e?.constructor?.name,
      }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  } finally {
    await client.close().catch(() => {});
  }
}