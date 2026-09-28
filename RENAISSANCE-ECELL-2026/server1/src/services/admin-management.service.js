import crypto from "node:crypto";
import mongoose from "mongoose";
import { AMBASSADOR_STATUS, REGISTRATION_STATUS, TASK_STATUS } from "../constants/domain.js";
import { AuthSession, CampusAmbassador, PromoCode, Registration, Task } from "../models/index.js";
import { revokeAmbassadorSessions } from "./ambassador-auth.service.js";
import { publicPromoCode, publicTask } from "./ambassador-dashboard.service.js";
import { ApiError } from "../utils/api-error.js";

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function pagination(page, limit, total, count) {
  const skip = (page - 1) * limit;
  return {
    page, limit, total,
    totalPages: total === 0 ? 0 : Math.ceil(total / limit),
    hasNextPage: skip + count < total,
    hasPreviousPage: page > 1,
  };
}

function temporaryPassword() {
  return `RnX!${crypto.randomBytes(12).toString("base64url")}9a`;
}

function randomId(prefix) {
  return `${prefix}-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
}

function ambassadorLookup(id) {
  if (mongoose.isValidObjectId(id)) return { _id: id };
  return { ambassadorId: String(id).trim().toUpperCase() };
}

export function adminAmbassadorView(ambassador) {
  return {
    id: ambassador._id.toString(),
    ambassadorId: ambassador.ambassadorId,
    name: ambassador.name,
    email: ambassador.email,
    phone: ambassador.phone ?? null,
    college: ambassador.college,
    status: ambassador.status,
    mustChangePassword: ambassador.mustChangePassword,
    lastLoginAt: ambassador.lastLoginAt,
    createdAt: ambassador.createdAt,
    updatedAt: ambassador.updatedAt,
  };
}

function adminPromoView(promo) {
  const view = publicPromoCode(promo);
  return {
    ...view,
    ambassadorId: promo.ambassadorId?.toString?.() ?? String(promo.ambassadorId),
    isArchived: Boolean(promo.archivedAt),
    archivedAt: promo.archivedAt ?? null,
    createdAt: promo.createdAt,
    updatedAt: promo.updatedAt,
  };
}

function adminTaskView(task) {
  return {
    ...publicTask(task),
    ambassadorId: task.ambassadorId?.toString?.() ?? String(task.ambassadorId),
    createdByAdminId: task.createdByAdminId?.toString?.() ?? null,
  };
}

export async function createAmbassadorByAdmin(input) {
  const duplicate = await CampusAmbassador.exists({ email: input.email });
  if (duplicate) throw new ApiError(409, "An ambassador with this email already exists", "AMBASSADOR_EMAIL_EXISTS");

  const { promoCode, password: suppliedPassword, ...profile } = input;
  const password = suppliedPassword ?? temporaryPassword();
  const ambassador = await mongoose.connection.transaction(async (session) => {
    const [created] = await CampusAmbassador.create([{
      ...profile, ambassadorId: input.ambassadorId || randomId("CA-RNX"), password, mustChangePassword: false,
    }], { session });
    if (promoCode) await PromoCode.create([{ code: promoCode, ambassadorId: created._id }], { session });
    return created;
  });

  return { ambassador: adminAmbassadorView(ambassador), temporaryPassword: password };
}

export async function listAmbassadors({ page, limit, status, search, college }) {
  const filter = {};
  if (status) filter.status = status;
  if (college) filter.college = { $regex: escapeRegex(college), $options: "i" };
  if (search) {
    const regex = { $regex: escapeRegex(search), $options: "i" };
    filter.$or = [{ name: regex }, { email: regex }, { ambassadorId: regex }];
  }
  const skip = (page - 1) * limit;
  const [rows, total] = await Promise.all([
    CampusAmbassador.find(filter).sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit).lean(),
    CampusAmbassador.countDocuments(filter),
  ]);
  const ids = rows.map((row) => row._id);
  const [promos, registrations, tasks] = await Promise.all([
    PromoCode.find({ ambassadorId: { $in: ids }, isPrimary: true }).lean(),
    Registration.aggregate([{ $match: { ambassadorId: { $in: ids } } }, { $group: { _id: "$ambassadorId", count: { $sum: 1 } } }]),
    Task.aggregate([{ $match: { ambassadorId: { $in: ids } } }, { $group: { _id: "$ambassadorId", total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] } } } }]),
  ]);
  return { ambassadors: rows.map((row) => ({
    ...adminAmbassadorView(row),
    promoCode: promos.find((p) => String(p.ambassadorId) === String(row._id))?.code || null,
    registrationCount: registrations.find((v) => String(v._id) === String(row._id))?.count || 0,
    taskProgress: tasks.find((v) => String(v._id) === String(row._id)) || { total: 0, completed: 0 },
  })), pagination: pagination(page, limit, total, rows.length) };
}

export async function getAmbassadorForAdmin(id) {
  const ambassador = await CampusAmbassador.findOne(ambassadorLookup(id)).lean();
  if (!ambassador) throw new ApiError(404, "Campus ambassador was not found", "AMBASSADOR_NOT_FOUND");
  const [promo, taskCounts, referralCounts] = await Promise.all([
    PromoCode.findOne({ ambassadorId: ambassador._id, isPrimary: true }).lean(),
    Task.aggregate([{ $match: { ambassadorId: ambassador._id } }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
    Registration.aggregate([{ $match: { ambassadorId: ambassador._id } }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);
  return { ambassador: adminAmbassadorView(ambassador), promoCode: promo ? adminPromoView(promo) : null, taskCounts, referralCounts };
}

export async function updateAmbassadorByAdmin(id, input) {
  const { promoCode, ...update } = input;
  const mutation = { $set: update };
  if (input.phone === null) { delete update.phone; mutation.$unset = { phone: 1 }; }
  const ambassador = await mongoose.connection.transaction(async (session) => {
    const saved = await CampusAmbassador.findOneAndUpdate(ambassadorLookup(id), mutation, { new: true, runValidators: true, session });
    if (!saved) throw new ApiError(404, "Campus ambassador was not found", "AMBASSADOR_NOT_FOUND");
    if (promoCode) {
      await PromoCode.findOneAndUpdate({ ambassadorId: saved._id, isPrimary: true },
        { $set: { code: promoCode }, $setOnInsert: { ambassadorId: saved._id, isPrimary: true } },
        { upsert: true, runValidators: true, session });
    }
    return saved;
  });
  return adminAmbassadorView(ambassador);
}

export async function setAmbassadorStatusByAdmin(id, status) {
  const ambassador = await CampusAmbassador.findOne(ambassadorLookup(id)).select("+authVersion");
  if (!ambassador) throw new ApiError(404, "Campus ambassador was not found", "AMBASSADOR_NOT_FOUND");
  if (ambassador.status === AMBASSADOR_STATUS.ARCHIVED && status !== AMBASSADOR_STATUS.ARCHIVED) {
    throw new ApiError(409, "Archived ambassadors cannot be reactivated", "AMBASSADOR_ARCHIVED");
  }

  const previous = ambassador.status;
  ambassador.status = status;
  ambassador.disabledAt = status === AMBASSADOR_STATUS.DISABLED ? new Date() : null;
  ambassador.archivedAt = status === AMBASSADOR_STATUS.ARCHIVED ? new Date() : ambassador.archivedAt;
  if (status !== AMBASSADOR_STATUS.ACTIVE && previous !== status) ambassador.authVersion += 1;
  await ambassador.save();
  if (status !== AMBASSADOR_STATUS.ACTIVE && previous !== status) {
    await revokeAmbassadorSessions(ambassador._id, `ACCOUNT_${status}`);
  }
  return adminAmbassadorView(ambassador);
}

export function archiveAmbassadorByAdmin(id) {
  return setAmbassadorStatusByAdmin(id, AMBASSADOR_STATUS.ARCHIVED);
}

export async function hardDeleteAmbassadorByAdmin(id) {
  const ambassador = await CampusAmbassador.findOne(ambassadorLookup(id)).lean();
  if (!ambassador) {
    throw new ApiError(404, "Campus ambassador was not found", "AMBASSADOR_NOT_FOUND");
  }
  if (ambassador.status !== AMBASSADOR_STATUS.ARCHIVED) {
    throw new ApiError(
      409,
      "Archive the ambassador before permanently deleting the account",
      "AMBASSADOR_NOT_ARCHIVED",
    );
  }

  const referralCount = await Registration.countDocuments({ ambassadorId: ambassador._id });
  if (referralCount > 0) {
    throw new ApiError(
      409,
      "This ambassador has referral history and cannot be hard deleted. Keep the account archived to preserve registration attribution.",
      "AMBASSADOR_HAS_REFERRALS",
    );
  }

  await Promise.all([
    AuthSession.deleteMany({ ambassadorId: ambassador._id }),
    Task.deleteMany({ ambassadorId: ambassador._id }),
    PromoCode.deleteMany({ ambassadorId: ambassador._id }),
  ]);
  await CampusAmbassador.deleteOne({ _id: ambassador._id });

  return {
    deleted: true,
    ambassadorId: ambassador.ambassadorId,
    email: ambassador.email,
  };
}

export async function createPromoByAdmin(input) {
  const ambassador = await CampusAmbassador.findById(input.ambassadorId);
  if (!ambassador || ambassador.status === AMBASSADOR_STATUS.ARCHIVED) {
    throw new ApiError(404, "Campus ambassador was not found", "AMBASSADOR_NOT_FOUND");
  }
  if (input.isPrimary && await PromoCode.exists({ ambassadorId: ambassador._id, isPrimary: true })) {
    throw new ApiError(409, "This ambassador already has a primary promo code", "PRIMARY_PROMO_EXISTS");
  }
  const promo = await PromoCode.create(input);
  return adminPromoView(promo);
}

export async function listPromosByAdmin({ page, limit, ambassadorId, isActive, search }) {
  const filter = {};
  if (ambassadorId) filter.ambassadorId = ambassadorId;
  if (isActive !== undefined) filter.isActive = isActive;
  if (search) filter.code = { $regex: escapeRegex(search), $options: "i" };
  const skip = (page - 1) * limit;
  const [rows, total] = await Promise.all([
    PromoCode.find(filter).sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit).lean(),
    PromoCode.countDocuments(filter),
  ]);
  return { promoCodes: rows.map(adminPromoView), pagination: pagination(page, limit, total, rows.length) };
}

export async function updatePromoByAdmin(promoId, input) {
  const promo = await PromoCode.findById(promoId);
  if (!promo) throw new ApiError(404, "Promo code was not found", "PROMO_NOT_FOUND");
  if (promo.archivedAt) {
    throw new ApiError(409, "Archived promo codes cannot be edited", "PROMO_ARCHIVED");
  }

  if (input.isPrimary === true && !promo.isPrimary) {
    const conflict = await PromoCode.exists({
      _id: { $ne: promo._id },
      ambassadorId: promo.ambassadorId,
      isPrimary: true,
    });
    if (conflict) {
      throw new ApiError(409, "This ambassador already has a primary promo code", "PRIMARY_PROMO_EXISTS");
    }
  }

  for (const [key, value] of Object.entries(input)) promo[key] = value;
  await promo.save();
  return adminPromoView(promo);
}

export async function setPromoStatusByAdmin(promoId, isActive) {
  const promo = await PromoCode.findById(promoId);
  if (!promo) throw new ApiError(404, "Promo code was not found", "PROMO_NOT_FOUND");
  if (promo.archivedAt) {
    throw new ApiError(409, "Archived promo codes cannot be enabled or disabled", "PROMO_ARCHIVED");
  }

  promo.isActive = isActive;
  await promo.save();
  return adminPromoView(promo);
}

export async function archivePromoByAdmin(promoId) {
  const promo = await PromoCode.findById(promoId);
  if (!promo) throw new ApiError(404, "Promo code was not found", "PROMO_NOT_FOUND");

  promo.isActive = false;
  promo.isPrimary = false;
  if (!promo.archivedAt) promo.archivedAt = new Date();
  await promo.save();

  return adminPromoView(promo);
}

export async function hardDeletePromoByAdmin(promoId) {
  const promo = await PromoCode.findById(promoId).lean();
  if (!promo) throw new ApiError(404, "Promo code was not found", "PROMO_NOT_FOUND");
  if (!promo.archivedAt) {
    throw new ApiError(
      409,
      "Archive the promo code before permanently deleting it",
      "PROMO_NOT_ARCHIVED",
    );
  }

  const referralCount = await Registration.countDocuments({ promoCodeId: promo._id });
  if (referralCount > 0) {
    throw new ApiError(
      409,
      "This promo code has registration history and cannot be hard deleted. Keep it archived to preserve referral attribution.",
      "PROMO_HAS_REFERRALS",
    );
  }

  await PromoCode.deleteOne({ _id: promo._id });
  return { deleted: true, promoCode: promo.code };
}

export async function createTaskByAdmin(input, adminId) {
  const ambassadors = input.ambassadorId === "ALL"
    ? await CampusAmbassador.find({ status: AMBASSADOR_STATUS.ACTIVE }).select("_id").lean()
    : await CampusAmbassador.find({ _id: input.ambassadorId, status: AMBASSADOR_STATUS.ACTIVE }).select("_id").lean();
  if (!ambassadors.length) throw new ApiError(409, "No active ambassadors match this assignment", "NO_ACTIVE_AMBASSADORS");
  // One atomic insert per recipient, within a transaction so bulk assignment cannot partially succeed.
  const tasks = await mongoose.connection.transaction(async (session) => Task.create(ambassadors.map((ambassador) => ({
    taskId: randomId("TASK-RNX"), title: input.title, description: input.description,
    dueAt: input.dueAt ?? null, ambassadorId: ambassador._id, createdByAdminId: adminId,
  })), { session, ordered: true }));
  return input.ambassadorId === "ALL" ? tasks.map(adminTaskView) : adminTaskView(tasks[0]);
}

export async function listTasksByAdmin({ page, limit, ambassadorId, status, search }) {
  const filter = {};
  if (ambassadorId) filter.ambassadorId = ambassadorId;
  if (status) filter.status = status;
  if (search) {
    const regex = { $regex: escapeRegex(search), $options: "i" };
    filter.$or = [{ taskId: regex }, { title: regex }];
  }
  const skip = (page - 1) * limit;
  const [rows, total] = await Promise.all([
    Task.find(filter).sort({ assignedAt: -1, _id: -1 }).skip(skip).limit(limit).lean(),
    Task.countDocuments(filter),
  ]);
  return { tasks: rows.map(adminTaskView), pagination: pagination(page, limit, total, rows.length) };
}

export async function getTaskForAdmin(taskId) {
  const task = await Task.findOne({ taskId }).lean();
  if (!task) throw new ApiError(404, "Task was not found", "TASK_NOT_FOUND");
  return adminTaskView(task);
}

export async function updateTaskByAdmin(taskId, input) {
  const task = await Task.findOne({ taskId }).lean();
  if (!task) throw new ApiError(404, "Task was not found", "TASK_NOT_FOUND");
  const update = { ...input };
  const now = new Date();
  if (input.status === TASK_STATUS.IN_PROGRESS) {
    update.startedAt = task.startedAt ?? now;
    update.completedAt = null;
    update.reviewStatus = "NONE";
  }
  if (input.status === TASK_STATUS.COMPLETED) {
    update.startedAt = task.startedAt ?? now;
    update.completedAt = task.completedAt ?? now;
    if (task.status !== TASK_STATUS.COMPLETED) update.reviewStatus = "PENDING";
  }
  if (input.status === TASK_STATUS.ASSIGNED) { update.startedAt = null; update.completedAt = null; update.reviewStatus = "NONE"; }
  const saved = await Task.findOneAndUpdate(
    { _id: task._id, ambassadorId: task.ambassadorId, status: task.status, updatedAt: task.updatedAt },
    { $set: update }, { new: true, runValidators: true },
  );
  if (!saved) throw new ApiError(409, "Task changed. Refresh and try again.", "TASK_CHANGED");
  return adminTaskView(saved);
}

export async function assignTaskByAdmin(taskId, ambassadorId) {
  const [task, ambassador] = await Promise.all([Task.findOne({ taskId }), CampusAmbassador.findById(ambassadorId)]);
  if (!task) throw new ApiError(404, "Task was not found", "TASK_NOT_FOUND");
  if (!ambassador || ambassador.status !== AMBASSADOR_STATUS.ACTIVE) throw new ApiError(409, "Choose an active ambassador", "AMBASSADOR_NOT_ACTIVE");
  if (task.ambassadorId.equals(ambassador._id)) return adminTaskView(task);
  if (task.status === TASK_STATUS.COMPLETED) throw new ApiError(409, "Completed tasks cannot be reassigned", "TASK_ALREADY_COMPLETED");
  const saved = await Task.findOneAndUpdate(
    { _id: task._id, ambassadorId: task.ambassadorId, status: task.status, updatedAt: task.updatedAt },
    { $set: {
      ambassadorId: ambassador._id,
      status: TASK_STATUS.ASSIGNED,
      assignedAt: new Date(),
      startedAt: null,
      completedAt: null,
      remarks: "",
      completionDetails: "",
      reviewStatus: "NONE", reviewFeedback: "", reviewedAt: null, reviewedByAdminId: null,
    } },
    { new: true, runValidators: true },
  );
  if (!saved) throw new ApiError(409, "Task changed. Refresh and try again.", "TASK_CHANGED");
  return adminTaskView(saved);
}

export async function deleteTaskByAdmin(taskId) {
  const task = await Task.findOne({ taskId });
  if (!task) throw new ApiError(404, "Task was not found", "TASK_NOT_FOUND");
  if (
    task.status !== TASK_STATUS.ASSIGNED ||
    task.startedAt ||
    task.completedAt ||
    task.remarks ||
    task.completionDetails
  ) {
    throw new ApiError(409, "Only untouched assigned tasks can be deleted", "TASK_HAS_PROGRESS");
  }
  const deleted = await Task.deleteOne({
    _id: task._id, ambassadorId: task.ambassadorId, updatedAt: task.updatedAt,
    status: TASK_STATUS.ASSIGNED, startedAt: null, completedAt: null,
    remarks: { $in: ["", null] }, completionDetails: { $in: ["", null] },
  });
  if (!deleted.deletedCount) throw new ApiError(409, "Task changed. Refresh and try again.", "TASK_CHANGED");
}

export async function listReferralsByAdmin({ page, limit, ambassadorId, promoCode, status, search }) {
  const filter = { ambassadorId: { $ne: null } };
  if (ambassadorId) filter.ambassadorId = ambassadorId;
  if (promoCode) filter.promoCode = promoCode.toUpperCase();
  if (status) filter.status = status;
  if (search) {
    const regex = { $regex: escapeRegex(search), $options: "i" };
    filter.$or = [{ registrationId: regex }, { name: regex }, { email: regex }];
  }
  const skip = (page - 1) * limit;
  const [rows, total] = await Promise.all([
    Registration.find(filter)
      .select("registrationId name email phone packageCode packageName promoCode ambassadorId status paymentStatus transactionId createdAt")
      .sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit).lean(),
    Registration.countDocuments(filter),
  ]);
  return { registrations: rows, pagination: pagination(page, limit, total, rows.length) };
}

function countMap(rows, keys) {
  const result = Object.fromEntries(keys.map((key) => [key, 0]));
  let total = 0;
  for (const row of rows) {
    result[row._id] = row.count;
    total += row.count;
  }
  return { total, ...result };
}

export async function getAdminDashboard() {
  const [ambassadorRows, taskRows, referralRows, activePromos, pendingReviews] = await Promise.all([
    CampusAmbassador.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Task.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Registration.aggregate([{ $match: { ambassadorId: { $ne: null } } }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
    PromoCode.countDocuments({ isActive: true, archivedAt: null }),
    Task.countDocuments({ status: "COMPLETED", reviewStatus: { $ne: "APPROVED" } }),
  ]);
  return {
    ambassadors: countMap(ambassadorRows, Object.values(AMBASSADOR_STATUS)),
    tasks: countMap(taskRows, Object.values(TASK_STATUS)),
    referrals: countMap(referralRows, Object.values(REGISTRATION_STATUS)),
    activePromoCodes: activePromos,
    pendingReviews,
  };
}

export async function resetAmbassadorCredential(id) {
  const password = temporaryPassword();
  const ambassador = await CampusAmbassador.findOneAndUpdate(
    { ...ambassadorLookup(id), status: { $ne: AMBASSADOR_STATUS.ARCHIVED } },
    { $set: { password, passwordChangedAt: new Date(), mustChangePassword: false },
      $unset: { passwordHash: 1 }, $inc: { authVersion: 1 } },
    { new: true, runValidators: true },
  );
  if (!ambassador) throw new ApiError(404, "Campus ambassador was not found", "AMBASSADOR_NOT_FOUND");
  await revokeAmbassadorSessions(ambassador._id, "ADMIN_PASSWORD_RESET");
  return { ambassador: adminAmbassadorView(ambassador), temporaryPassword: password };
}

export async function reviewTaskByAdmin(taskId, input, adminId) {
  const task = await Task.findOne({ taskId }).lean();
  if (!task) throw new ApiError(404, "Task was not found", "TASK_NOT_FOUND");
  if (task.status !== TASK_STATUS.COMPLETED || task.reviewStatus === "APPROVED") {
    throw new ApiError(409, "Only pending completed submissions can be reviewed", "TASK_NOT_REVIEWABLE");
  }
  const update = { reviewStatus: input.decision, reviewFeedback: input.feedback, reviewedAt: new Date(), reviewedByAdminId: adminId };
  if (input.decision === "CHANGES_REQUESTED") {
    update.status = TASK_STATUS.IN_PROGRESS;
    update.completedAt = null;
  }
  const saved = await Task.findOneAndUpdate(
    { _id: task._id, ambassadorId: task.ambassadorId, status: task.status, updatedAt: task.updatedAt },
    { $set: update }, { new: true, runValidators: true },
  );
  if (!saved) throw new ApiError(409, "Task changed. Refresh and try again.", "TASK_CHANGED");
  return adminTaskView(saved);
}
