import { and, desc, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertProject, InsertUser, InsertVersion, Project, User, Version, projects, users, versions } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  textFields.forEach(field => {
    if (user[field] !== undefined) {
      const value = user[field] ?? null;
      values[field] = value;
      updateSet[field] = value;
    }
  });
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = 'admin';
    updateSet.role = 'admin';
  }
  values.lastSignedIn ??= new Date();
  updateSet.lastSignedIn ??= new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listPublicProjects(filters?: { search?: string; loader?: string; gameVersion?: string }) {
  const db = await getDb();
  if (!db) return [] as Project[];
  const terms = [];
  if (filters?.search) {
    const term = `%${filters.search}%`;
    terms.push(or(like(projects.name, term), like(projects.summary, term), like(projects.slug, term)));
  }
  if (filters?.loader && filters.loader !== 'all') terms.push(like(projects.loaders, `%${filters.loader}%`));
  if (filters?.gameVersion && filters.gameVersion !== 'all') terms.push(like(projects.gameVersions, `%${filters.gameVersion}%`));
  return db.select().from(projects).where(and(eq(projects.status, 'approved'), ...terms)).orderBy(desc(projects.downloads)).limit(48);
}

export async function getProjectBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const project = (await db.select().from(projects).where(eq(projects.slug, slug)).limit(1))[0];
  if (!project) return undefined;
  const projectVersions = await db.select().from(versions).where(and(eq(versions.projectId, project.id), eq(versions.status, 'approved'))).orderBy(desc(versions.createdAt));
  return { project, versions: projectVersions };
}

export async function listProjectsForOwner(ownerId: number) {
  const db = await getDb();
  if (!db) return [] as Project[];
  return db.select().from(projects).where(eq(projects.ownerId, ownerId)).orderBy(desc(projects.updatedAt));
}

export async function createProject(input: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(projects).values(input);
  return (await db.select().from(projects).where(eq(projects.slug, input.slug)).limit(1))[0];
}

export async function createVersion(input: InsertVersion) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(versions).values(input);
  return (await db.select().from(versions).where(and(eq(versions.projectId, input.projectId), eq(versions.versionNumber, input.versionNumber))).limit(1))[0];
}

export async function listReviewQueue() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ project: projects, version: versions }).from(versions).innerJoin(projects, eq(versions.projectId, projects.id)).where(or(eq(versions.status, 'review'), eq(projects.status, 'review'))).orderBy(desc(versions.createdAt));
}

export async function decideVersion(versionId: number, reviewerId: number, decision: 'approved' | 'rejected', note?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(versions).set({ status: decision, reviewedBy: reviewerId, reviewNote: note ?? null }).where(eq(versions.id, versionId));
  const version = (await db.select().from(versions).where(eq(versions.id, versionId)).limit(1))[0];
  if (version) await db.update(projects).set({ status: decision }).where(eq(projects.id, version.projectId));
  return version;
}

export async function incrementVersionDownload(versionId: number) {
  const db = await getDb();
  if (!db) return;
  const version = (await db.select().from(versions).where(eq(versions.id, versionId)).limit(1))[0];
  if (!version) return;
  await db.update(versions).set({ downloads: version.downloads + 1 }).where(eq(versions.id, versionId));
  await db.update(projects).set({ downloads: (await db.select().from(projects).where(eq(projects.id, version.projectId)).limit(1))[0]?.downloads + 1 || 1 }).where(eq(projects.id, version.projectId));
}
