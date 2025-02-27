import { drizzle } from "drizzle-orm/neon-http"; 
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema"; 

// Initialize Neon database connection
const sql = neon(process.env.DATABASE_URL!);

// Initialize Drizzle with schema
export const db = drizzle(sql, { schema }); 
