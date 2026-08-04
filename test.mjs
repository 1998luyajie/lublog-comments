// 最小连通性测试：验证 Vercel 函数能否连上你的 MongoDB Atlas
// 用与 mongosh 完全一致的 SRV 连接串 + mongodb driver 6
import { MongoClient } from 'mongodb';

const URI =
  'mongodb+srv://lu_db_user:plQVr3yHZDsvJQbg@cluster0.zaisgxd.mongodb.net/?authSource=admin&retryWrites=true';

export default async function handler(req) {
  const client = new MongoClient(URI, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 });
  const start = Date.now();
  try {
    await client.connect();
    const res = await client.db('lublog').command({ ping: 1 });
    return new Response(
      JSON.stringify({ ok: true, elapsedMs: Date.now() - start, ping: res }),
      { headers: { 'content-type': 'application/json' } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, elapsedMs: Date.now() - start, error: String(e) }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  } finally {
    await client.close().catch(() => {});
  }
}
