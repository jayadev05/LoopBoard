import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { z } from 'zod'
import auth from '@/features/auth/server/route'

const app = new Hono().basePath('/api')



const routes = app
    .route('/auth',auth);



export const POST = handle(app);
export const GET = handle(app);

export type AppType = typeof routes;