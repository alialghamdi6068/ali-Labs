import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { publicPlatformScript } from "./publicConfig";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { storagePut } from "../storage";
import { serveStatic, setupVite } from "./vite";

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.post("/api/uploads", async (req, res) => {
    try {
      const ctx = await createContext({ req, res, info: undefined as any });
      if (!ctx.user) return res.status(401).json({ error: "تسجيل الدخول مطلوب" });
      const { fileName, contentType, data } = req.body as { fileName?: string; contentType?: string; data?: string };
      if (!fileName || !data) return res.status(400).json({ error: "بيانات الملف ناقصة" });
      const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
      if (!/\.(jar|zip)$/i.test(safeName)) return res.status(400).json({ error: "يسمح بملفات JAR أو ZIP فقط" });
      const base64 = data.replace(/^data:[^;]+;base64,/, "");
      const bytes = Buffer.from(base64, "base64");
      if (bytes.byteLength > 20 * 1024 * 1024) return res.status(413).json({ error: "الحد الأقصى للملف 20MB" });
      const result = await storagePut(`releases/${ctx.user.id}/${Date.now()}-${safeName}`, bytes, contentType || "application/octet-stream");
      return res.json({ ...result, fileName: safeName, fileSize: bytes.byteLength });
    } catch (error) {
      console.error("[Uploads] Failed:", error);
      return res.status(500).json({ error: "تعذر رفع الملف الآن" });
    }
  });
  app.get("/manus-routes.json", (_req, res) => res.json({
    routes: [
      { path: "/", title: "Ali Labs" },
      { path: "/discover", title: "Discover projects" },
      { path: "/projects/:slug", title: "Project" },
      { path: "/projects/:slug/versions/:version", title: "Project version" },
      { path: "/dashboard", title: "Developer dashboard" },
      { path: "/admin", title: "Admin review" },
      { path: "/404", title: "Not found" },
    ],
  }));
  app.get("/api/platform/config.js", (_req, res) => {
    res.set("Cache-Control", "no-store").type("application/javascript").send(publicPlatformScript());
  });
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = Number(process.env.PORT || "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PORT");
  server.on("error", error => { console.error("Server failed:", error.message); process.exit(1); });
  server.listen(port, "0.0.0.0", () => console.log(`Server listening on port ${port}`));
}

startServer().catch(error => { console.error(error); process.exit(1); });
