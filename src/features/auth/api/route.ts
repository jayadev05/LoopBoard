import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, registerSchema } from "../schemas";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import bcrypt from 'bcryptjs'
import { eq } from "drizzle-orm";
import { createCustomSession, deleteSession, getSession } from "@/lib/session";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";



const app = new Hono()

.get('/current-user', async (c) => {
  const nextAuthsession = await getServerSession(authOptions);
  const session = await getSession();
  
  const activeSession = nextAuthsession || session;
  
  if (!activeSession) {
    return c.json({ error: "Session not found", data: null }, 404);
  }
  
  const userId = activeSession.user.id;
  
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  
  if (!user) {
    return c.json({ error: "User not found", data: null }, 404);
  }
  
  return c.json({ error: null, data: user });
})

.post("/login", zValidator("json", loginSchema), async (c) => {
  try {
   
    const {email,password} = c.req.valid('json');

    const user = await db.query.users.findFirst({
      where: eq(users.email,email),
    });

    if(!user) return c.json({message:'User Not found'},404);

    const passwordIsMatch = await bcrypt.compare(password,user.password!);

    if(!passwordIsMatch) return c.json({message:"Password is incorrect"},400);

     await createCustomSession(user.id);


    return c.json({ 
      success: "ok", 
      message: 'User logged in successfully',
   
    }, 200);

  } catch (error) {
    console.error("Login error:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
})

  .post("/register", zValidator("json", registerSchema), async (c) => {
   

    const { name, email, password } = c.req.valid("json");

    const userExists = await db.query.users.findFirst({
      where: eq(users.email,email),
    });

    if(userExists) return c.json({message:"user already exist"},401);

     const hashedPassword = await bcrypt.hash(password, 10);

    
     const newUser = await db.insert(users).values({
         name,
         email,
         password: hashedPassword, 
         createdAt: new Date(), 
     }).returning(); 

    return c.json({ success: "User registered successfully",user:newUser },200);
  })

  .post("/logout", async (c) => {
   
    await deleteSession();
    
    return c.json({ success: "User logged out successfully" });
  });

  

export default app;
