import { pgTable, serial, text, timestamp, varchar, integer, pgEnum, index, json, primaryKey, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Status enums with more specific naming
export const projectStatusEnum = pgEnum('project_status', ['planned', 'in_progress', 'completed', 'on_hold']);
export const taskStatusEnum = pgEnum('task_status', ['planned', 'in_progress', 'completed', 'blocked']);
export const rolesEnum = pgEnum('role', ['user', 'admin']);
export const userStatusEnum = pgEnum('user_status', ['active', 'inactive', 'pending_invite']);
export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'urgent']);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }), // 🔥 Made nullable for OAuth users
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }), // Nullable for OAuth users
  avatarUrl: varchar('avatar_url', { length: 500 }), // 🔥 Keep it consistent with NextAuth
  role: rolesEnum('role').default('user').notNull(),
  status: userStatusEnum('status').default('active').notNull(),
  bio: text('bio'),
  jobTitle: varchar('job_title', { length: 255 }),
  theme: varchar('theme', { length: 50 }).default('light'),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true }),
  provider: varchar('provider', { length: 100 }), // 🔥 Stores "google" or "github"
  providerId: varchar('provider_id', { length: 255 }), // 🔥 Stores OAuth provider ID
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => {
  return {
    emailIdx: index('users_email_idx').on(table.email),
    providerIdIdx: index('users_provider_id_idx').on(table.providerId),
  };
});


// NextAuth Tables

// Accounts table - links provider accounts to users
export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 255 }).notNull(), // oauth, email, etc.
  provider: varchar('provider', { length: 255 }).notNull(), // google, github, etc.
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  id_token: text('id_token'),
  session_state: varchar('session_state', { length: 255 }),
}, (table) => {
  return {
    providerProviderAccountIdKey: uniqueIndex('accounts_provider_account_id_key').on(table.provider, table.providerAccountId),
    userIdIdx: index('accounts_user_id_idx').on(table.userId),
  };
});

// Sessions table - used for session management
export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sessionToken: varchar('session_token', { length: 255 }).notNull().unique(),
  expires: timestamp('expires', { withTimezone: true }).notNull(),
}, (table) => {
  return {
    sessionTokenKey: index('sessions_token_key').on(table.sessionToken),
    userIdIdx: index('sessions_user_id_idx').on(table.userId),
  };
});

// Verification tokens - used for email verification and password resets
export const verificationTokens = pgTable('verification_tokens', {
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  expires: timestamp('expires', { withTimezone: true }).notNull(),
}, (table) => {
  return {
    compoundKey: primaryKey(table.identifier, table.token),
    tokenKey: index('verification_token_key').on(table.token),
  };
});

// Projects table
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  status: projectStatusEnum('status').default('planned').notNull(),
  ownerId: integer('owner_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => {
  return {
    ownerIdIdx: index('projects_owner_id_idx').on(table.ownerId),
  };
});

// Tasks table
export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: taskStatusEnum('status').default('planned').notNull(),
  priority: priorityEnum('priority').default('medium'),
  projectId: integer('project_id').references(() => projects.id).notNull(),
  assigneeId: integer('assignee_id').references(() => users.id),
  position: integer('position').default(0),
  dueDate: timestamp('due_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => {
  return {
    projectIdIdx: index('tasks_project_id_idx').on(table.projectId),
    assigneeIdIdx: index('tasks_assignee_id_idx').on(table.assigneeId),
    statusIdx: index('tasks_status_idx').on(table.status),
    dueDateIdx: index('tasks_due_date_idx').on(table.dueDate),
  };
});

// Comments table for discussions
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  taskId: integer('task_id').references(() => tasks.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => {
  return {
    taskIdIdx: index('comments_task_id_idx').on(table.taskId),
    userIdIdx: index('comments_user_id_idx').on(table.userId),
  };
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  ownedProjects: many(projects),
  assignedTasks: many(tasks, { relationName: 'assignee' }),
  comments: many(comments),
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, {
    fields: [projects.ownerId],
    references: [users.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
    relationName: 'assignee',
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  task: one(tasks, {
    fields: [comments.taskId],
    references: [tasks.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));