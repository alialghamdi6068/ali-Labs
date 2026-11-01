import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  summary: varchar("summary", { length: 220 }).notNull(),
  description: text("description"),
  projectType: varchar("projectType", { length: 40 }).notNull(),
  iconUrl: varchar("iconUrl", { length: 500 }),
  loaders: text("loaders").notNull(),
  gameVersions: text("gameVersions").notNull(),
  status: mysqlEnum("status", ["draft", "review", "approved", "rejected"]).default("draft").notNull(),
  downloads: int("downloads").default(0).notNull(),
  followers: int("followers").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const versions = mysqlTable("versions", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  versionNumber: varchar("versionNumber", { length: 40 }).notNull(),
  changelog: text("changelog"),
  loaders: text("loaders").notNull(),
  gameVersions: text("gameVersions").notNull(),
  fileKey: varchar("fileKey", { length: 500 }),
  fileName: varchar("fileName", { length: 255 }),
  fileSize: int("fileSize"),
  status: mysqlEnum("status", ["draft", "review", "approved", "rejected"]).default("draft").notNull(),
  downloads: int("downloads").default(0).notNull(),
  reviewedBy: int("reviewedBy"),
  reviewNote: text("reviewNote"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const projectReviews = mysqlTable("projectReviews", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  versionId: int("versionId"),
  reviewerId: int("reviewerId").notNull(),
  decision: mysqlEnum("decision", ["approved", "rejected"]).notNull(),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;
export type Version = typeof versions.$inferSelect;
export type InsertVersion = typeof versions.$inferInsert;
