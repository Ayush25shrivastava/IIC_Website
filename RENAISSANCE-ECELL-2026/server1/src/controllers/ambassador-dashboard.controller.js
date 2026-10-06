import {
  getAmbassadorDashboardData,
  getAmbassadorPrimaryPromoCode,
  getAmbassadorTask,
  listAmbassadorReferrals,
  listAmbassadorTasks,
  updateAmbassadorTaskDetails,
  updateAmbassadorTaskStatus,
} from "../services/ambassador-dashboard.service.js";

function sendNoStore(res, data) {
  res.set("Cache-Control", "no-store").status(200).json({
    success: true,
    data,
  });
}

export async function getAmbassadorDashboard(req, res) {
  const data = await getAmbassadorDashboardData(req.ambassador);
  sendNoStore(res, data);
}

export async function getAmbassadorPromoCode(req, res) {
  const promoCode = await getAmbassadorPrimaryPromoCode(req.ambassador._id);
  sendNoStore(res, { promoCode });
}

export async function getAmbassadorTasks(req, res) {
  const data = await listAmbassadorTasks({
    ambassadorId: req.ambassador._id,
    ...req.validatedQuery,
  });
  sendNoStore(res, data);
}

export async function getAmbassadorTaskById(req, res) {
  const task = await getAmbassadorTask({
    ambassadorId: req.ambassador._id,
    taskId: req.validatedParams.taskId,
  });
  sendNoStore(res, { task });
}

export async function patchAmbassadorTaskStatus(req, res) {
  const task = await updateAmbassadorTaskStatus({
    ambassadorId: req.ambassador._id,
    taskId: req.validatedParams.taskId,
    status: req.validatedBody.status,
  });
  sendNoStore(res, { task });
}

export async function patchAmbassadorTaskDetails(req, res) {
  const task = await updateAmbassadorTaskDetails({
    ambassadorId: req.ambassador._id,
    taskId: req.validatedParams.taskId,
    ...req.validatedBody,
  });
  sendNoStore(res, { task });
}

export async function getAmbassadorReferrals(req, res) {
  const data = await listAmbassadorReferrals({
    ambassadorId: req.ambassador._id,
    ...req.validatedQuery,
  });
  sendNoStore(res, data);
}
