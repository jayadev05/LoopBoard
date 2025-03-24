import { User } from "@/types/auth";
import { Hono } from "hono";

type Variables = {
  user: User | null;
};

const app = new Hono<{ Variables: Variables }>()

    .get()


export default app;    