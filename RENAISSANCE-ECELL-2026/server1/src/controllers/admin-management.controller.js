import {
  archiveAmbassadorByAdmin,
  archivePromoByAdmin,
  assignTaskByAdmin,
  createAmbassadorByAdmin,
  createPromoByAdmin,
  createTaskByAdmin,
  deleteTaskByAdmin,
  getAdminDashboard,
  getAmbassadorForAdmin,
  getTaskForAdmin,
  hardDeleteAmbassadorByAdmin,
  hardDeletePromoByAdmin,
  listAmbassadors,
  listPromosByAdmin,
  listReferralsByAdmin,
  listTasksByAdmin,
  setAmbassadorStatusByAdmin,
  setPromoStatusByAdmin,
  updateAmbassadorByAdmin,
  updatePromoByAdmin,
  updateTaskByAdmin,
} from "../services/admin-management.service.js";

function ok(res, data, status = 200) {
  res.set("Cache-Control", "no-store").status(status).json({ success: true, data });
}

export async function adminDashboard(_req, res) { ok(res, await getAdminDashboard()); }
export async function adminListAmbassadors(req, res) { ok(res, await listAmbassadors(req.validatedQuery)); }
export async function adminGetAmbassador(req, res) { ok(res, await getAmbassadorForAdmin(req.validatedParams.id)); }
export async function adminCreateAmbassador(req, res) { ok(res, await createAmbassadorByAdmin(req.validatedBody), 201); }
export async function adminUpdateAmbassador(req, res) { ok(res, { ambassador: await updateAmbassadorByAdmin(req.validatedParams.id, req.validatedBody) }); }
export async function adminSetAmbassadorStatus(req, res) { ok(res, { ambassador: await setAmbassadorStatusByAdmin(req.validatedParams.id, req.validatedBody.status) }); }
export async function adminArchiveAmbassador(req, res) { ok(res, { ambassador: await archiveAmbassadorByAdmin(req.validatedParams.id) }); }
export async function adminHardDeleteAmbassador(req, res) { ok(res, await hardDeleteAmbassadorByAdmin(req.validatedParams.id)); }
export async function adminListPromos(req, res) { ok(res, await listPromosByAdmin(req.validatedQuery)); }
export async function adminCreatePromo(req, res) { ok(res, { promoCode: await createPromoByAdmin(req.validatedBody) }, 201); }
export async function adminUpdatePromo(req, res) { ok(res, { promoCode: await updatePromoByAdmin(req.validatedParams.promoId, req.validatedBody) }); }
export async function adminSetPromoStatus(req, res) { ok(res, { promoCode: await setPromoStatusByAdmin(req.validatedParams.promoId, req.validatedBody.isActive) }); }
export async function adminArchivePromo(req, res) { ok(res, { promoCode: await archivePromoByAdmin(req.validatedParams.promoId) }); }
export async function adminHardDeletePromo(req, res) { ok(res, await hardDeletePromoByAdmin(req.validatedParams.promoId)); }
export async function adminListTasks(req, res) { ok(res, await listTasksByAdmin(req.validatedQuery)); }
export async function adminGetTask(req, res) { ok(res, { task: await getTaskForAdmin(req.validatedParams.taskId) }); }
export async function adminCreateTask(req, res) { ok(res, { task: await createTaskByAdmin(req.validatedBody, req.admin._id) }, 201); }
export async function adminUpdateTask(req, res) { ok(res, { task: await updateTaskByAdmin(req.validatedParams.taskId, req.validatedBody) }); }
export async function adminAssignTask(req, res) { ok(res, { task: await assignTaskByAdmin(req.validatedParams.taskId, req.validatedBody.ambassadorId) }); }
export async function adminDeleteTask(req, res) { await deleteTaskByAdmin(req.validatedParams.taskId); res.status(204).end(); }
export async function adminListReferrals(req, res) { ok(res, await listReferralsByAdmin(req.validatedQuery)); }
