import {
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
    primaryKey,
    integer,
    json,
    boolean,
    uuid,
    pgEnum,
  } from "drizzle-orm/pg-core";


  export const roleEnum = pgEnum("role", [ "ADMIN", "MEMBER"]);
  
  // Users table - compatible with both NextAuth and your custom auth
  export const users = pgTable("user", {
    id: uuid("id").primaryKey().defaultRandom(), 
    name: text("name"),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerified: timestamp("emailVerified"),
    role: varchar("role", { length: 50 }).default("user").notNull(),
    image: text("image"),
    password: text("password"), // Optional: for your custom auth if needed
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  });
  
  // NextAuth Accounts table - for OAuth providers
  export const accounts = pgTable("account", {
    id: uuid("id").defaultRandom(), 
    userId: uuid("userId")  
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(), // Changed from "provider_account_id"
    refreshToken: text("refresh_token"), // Changed from "refresh_token"
    accessToken: text("access_token"),   // Changed from "access_token"
    expiresAt: integer("expires_at"),    // Changed from "expires_at"
    tokenType: varchar("token_type", { length: 255 }), // Changed from "token_type"
    scope: varchar("scope", { length: 255 }),
    idToken: text("id_token"), // Changed from "id_token"
    sessionState: varchar("session_state", { length: 255 }), // Changed from "session_state"
  }, (table) => {
    return {
      providerProviderAccountIdKey: primaryKey({
        columns: [table.provider, table.providerAccountId], 
      }),
    };
  });
  
  
  // NextAuth Sessions table - required for database session strategy
  export const sessions = pgTable("session", {
    id: serial("id").primaryKey(),
    sessionToken: varchar("sessionToken", { length: 255 }).notNull().unique(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires").notNull(),
  });
  
  // NextAuth Verification Tokens table - for email verification and password reset
  export const verificationTokens = pgTable("verification_token", {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires").notNull(),
  }, (table) => {
    return {
      compoundKey: primaryKey({ columns: [table.identifier, table.token] }),
    };
  });
  

  export const workspaces = pgTable("workspace", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    imageUrl: varchar("imageUrl", { length: 255 }) ,
    inviteCode:varchar('inviteCode',{length:10}).notNull()
  });
  
  export const workspaceMembers = pgTable("workspace_members", {
    workspaceId: uuid("workspaceId")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }), 
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
      role: roleEnum("role").notNull().default("MEMBER"),
      
  }, (table) => {
    return {
      compositeKey: primaryKey({ columns: [table.workspaceId, table.userId] }) 
    };
  });
  