// Waline 服务端入口（Vercel 原生部署）
// 使用 @waline/vercel 提供的 Vercel Serverless 适配器，
// 数据库后端由环境变量自动探测：配置了 MONGO_* 即启用 MongoDB。
import Waline from '@waline/vercel';

export default Waline();
