import { Router } from "express";
import { fileURLToPath } from "node:url";
import { requireAdminAuth } from "../middleware/admin-auth.js";

export const adminPagesRouter = Router();
const indexFile = fileURLToPath(new URL("../../../client/dist/index.html", import.meta.url));
adminPagesRouter.use((_req, res, next) => {
  res.set({ "X-Robots-Tag": "noindex, nofollow, noarchive", "Cache-Control": "no-store" });
  next();
});
function requireAdminPage(req, res, next) {
  requireAdminAuth(req, res, (error) => {
    if (error?.statusCode === 401 || error?.statusCode === 403) return res.redirect(302, `${req.baseUrl}/login`);
    if (error) return next(error);
    next();
  });
}
adminPagesRouter.get("/login", (_req, res, next) => res.sendFile(indexFile, (error) => { if (error) next(error); }));
adminPagesRouter.get("/", requireAdminPage, (req, res) => res.redirect(302, `${req.baseUrl}/campus-ambassadors`));
adminPagesRouter.get("/campus-ambassadors", requireAdminPage, (_req, res, next) => res.sendFile(indexFile, (error) => { if (error) next(error); }));
