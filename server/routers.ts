import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createProject, createVersion, decideVersion, getProjectBySlug, incrementVersionDownload, listProjectsForOwner, listPublicProjects, listReviewQueue } from "./db";

const textList = z.array(z.string().min(1).max(40)).min(1).max(12);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  projects: router({
    list: publicProcedure.input(z.object({ search: z.string().max(80).optional(), loader: z.string().max(40).optional(), gameVersion: z.string().max(40).optional() }).optional()).query(({ input }) => listPublicProjects(input)),
    bySlug: publicProcedure.input(z.object({ slug: z.string().min(1).max(80) })).query(({ input }) => getProjectBySlug(input.slug)),
    mine: protectedProcedure.query(({ ctx }) => listProjectsForOwner(ctx.user.id)),
    create: protectedProcedure.input(z.object({ slug: z.string().regex(/^[a-z0-9-]+$/).min(3).max(80), name: z.string().min(2).max(120), summary: z.string().min(10).max(220), description: z.string().max(8000).optional(), projectType: z.string().min(2).max(40), loaders: textList, gameVersions: textList })).mutation(({ ctx, input }) => createProject({ ...input, ownerId: ctx.user.id, loaders: JSON.stringify(input.loaders), gameVersions: JSON.stringify(input.gameVersions), status: 'review' })),
    addVersion: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), versionNumber: z.string().min(1).max(40), changelog: z.string().max(5000).optional(), loaders: textList, gameVersions: textList, fileKey: z.string().max(500).optional(), fileName: z.string().max(255).optional(), fileSize: z.number().int().nonnegative().optional() })).mutation(({ input }) => createVersion({ ...input, loaders: JSON.stringify(input.loaders), gameVersions: JSON.stringify(input.gameVersions), status: 'review' })),
    download: publicProcedure.input(z.object({ versionId: z.number().int().positive() })).mutation(({ input }) => incrementVersionDownload(input.versionId)),
    reviewQueue: adminProcedure.query(() => listReviewQueue()),
    decide: adminProcedure.input(z.object({ versionId: z.number().int().positive(), decision: z.enum(['approved', 'rejected']), note: z.string().max(1000).optional() })).mutation(({ ctx, input }) => decideVersion(input.versionId, ctx.user.id, input.decision, input.note)),
  }),
});

export type AppRouter = typeof appRouter;
