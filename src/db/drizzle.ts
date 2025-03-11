import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "./schema";


// Initialize the connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the database client
export const db = drizzle(pool, { schema });