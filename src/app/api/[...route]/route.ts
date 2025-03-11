import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import customAuth from '@/features/auth/api/route'
import workspace from '@/features/workspace/api/route'
import { authMiddleware } from '../middleware/authMiddleware'

const app = new Hono().basePath('/api')

// 🔹 Apply authentication middleware globally (for all requests)
app.use("*", authMiddleware);

const routes = app
    .route('/customAuth',customAuth)
    .route('/workspace',workspace)


export const POST = handle(app);
export const GET = handle(app);

// for rpc
export type AppType = typeof routes;