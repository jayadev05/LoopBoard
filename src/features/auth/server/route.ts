import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "../Schemas";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const app = new Hono()

  .post("/login", zValidator("json", loginSchema), async (c) => {
    const body = await c.req.json();

    const { email, password } = c.req.valid("json");

    return c.json({ sucess: "ok" });
  })
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const body = await c.req.json();

    const { name, email, password } = c.req.valid("json");

    // Check if the user already exists
    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return c.json({ error: "User already exists" }, 400);
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    await db.insert(users).values({ name, email, password: hashedPassword });

    return c.json({ success: "User registered successfully" });
  });

export default app;
