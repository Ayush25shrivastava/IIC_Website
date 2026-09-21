import {
  REGISTRATION_STATUS,
  TASK_STATUS,
} from "../constants/domain.js";
import {
  PromoCode,
  Registration,
  Task,
} from "../models/index.js";
import { publicAmbassador } from "./ambassador-auth.service.js";
import { ApiError } from "../utils/api-error.js";

const TASK_TRANSITIONS = Object.freeze({
  [TASK_STATUS.ASSIGNED]: new Set([TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED]),
  [TASK_STATUS.IN_PROGRESS]: new Set([TASK_STATUS.COMPLETED]),
  [TASK_STATUS.COMPLETED]: new Set(),
});

function emptyTaskStats() {
  return {
    total: 0,
    assigned: 0,
    inProgress: 0,
    completed: 0,
  };
}

function emptyReferralStats() {
  return {
    total: 0,
    pendingVerification: 0,
    verified: 0,
    rejected: 0,
  };
}

function mapTaskStats(rows) {
  const stats = emptyTaskStats();

  for (const row of rows) {
    stats.total += row.count;
    if (row._id === TASK_STATUS.ASSIGNED) stats.assigned = row.count;
    if (row._id === TASK_STATUS.IN_PROGRESS) stats.inProgress = row.count;
    if (row._id === TASK_STATUS.COMPLETED) stats.completed = row.count;
  }

  return stats;
}

function mapReferralStats(rows) {
  const stats = emptyReferralStats();

  for (const row of rows) {
    stats.total += row.count;
    if (row._id === REGISTRATION_STATUS.PENDING_VERIFICATION) {
      stats.pendingVerification = row.count;
    }
    if (row._id === REGISTRATION_STATUS.VERIFIED) stats.verified = row.count;
    if (row._id === REGISTRATION_STATUS.REJECTED) stats.rejected = row.count;
  }

  return stats;
}

function promoEffectiveStatus(promo, now = new Date()) {
  if (!promo) return "NOT_ASSIGNED";
  if (!promo.isActive) return "DISABLED";
  if (promo.validFrom && promo.validFrom > now) return "UPCOMING";
  if (promo.validUntil && promo.validUntil < now) return "EXPIRED";
  if (promo.maxUses !== null && promo.usageCount >= promo.maxUses) return "EXHAUSTED";
  return "ACTIVE";
}

export function publicPromoCode(promo) {
  if (!promo) return null;

  const remainingUses = promo.maxUses === null
    ? null
    : Math.max(promo.maxUses - promo.usageCount, 0);

  return {
    id: promo._id.toString(),
    code: promo.code,
    discountType: promo.discountType,
    discountValue: promo.discountValue,
    usageCount: promo.usageCount,
    maxUses: promo.maxUses,
    remainingUses,
    isActive: promo.isActive,
    isPrimary: promo.isPrimary,
    effectiveStatus: promoEffectiveStatus(promo),
    validFrom: promo.validFrom,
    validUntil: promo.validUntil,
  };
}

export function publicTask(task) {
  return {
    id: task._id.toString(),
    taskId: task.taskId,
    title: task.title,
    description: task.description,
    status: task.status,
    remarks: task.remarks,
    completionDetails: task.completionDetails,
    assignedAt: task.assignedAt,
    startedAt: task.startedAt,
    completedAt: task.completedAt,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

function participantDisplayName(name) {
  const firstName = String(name || "").trim().split(/\s+/)[0];
  return firstName || "Participant";
}

export function publicReferral(registration) {
  return {
    id: registration._id.toString(),
    registrationId: registration.registrationId,
    participantName: participantDisplayName(registration.name),
    packageCode: registration.packageCode,
    packageName: registration.packageName,
    promoCode: registration.promoCode,
    status: registration.status,
    createdAt: registration.createdAt,
  };
}

async function statusCounts(Model, ambassadorId) {
  return Model.aggregate([
    { $match: { ambassadorId } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
}

export async function getAmbassadorDashboardData(ambassador) {
  const [promo, taskRows, referralRows] = await Promise.all([
    PromoCode.findOne({ ambassadorId: ambassador._id, isPrimary: true }).lean(),
    statusCounts(Task, ambassador._id),
    statusCounts(Registration, ambassador._id),
  ]);

  return {
    ambassador: publicAmbassador(ambassador),
    promoCode: publicPromoCode(promo),
    taskStats: mapTaskStats(taskRows),
    referralStats: mapReferralStats(referralRows),
  };
}

export async function getAmbassadorPrimaryPromoCode(ambassadorId) {
  const promo = await PromoCode.findOne({ ambassadorId, isPrimary: true }).lean();
  return publicPromoCode(promo);
}

export async function listAmbassadorTasks({ ambassadorId, page, limit, status }) {
  const filter = { ambassadorId };
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort({ assignedAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Task.countDocuments(filter),
  ]);

  return {
    tasks: tasks.map(publicTask),
    pagination: {
      page,
      limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      hasNextPage: skip + tasks.length < total,
      hasPreviousPage: page > 1,
    },
  };
}

export async function getAmbassadorTask({ ambassadorId, taskId }) {
  const task = await Task.findOne({ ambassadorId, taskId }).lean();
  if (!task) {
    throw new ApiError(404, "Task was not found", "TASK_NOT_FOUND");
  }
  return publicTask(task);
}

export function assertTaskStatusTransition(currentStatus, nextStatus) {
  if (currentStatus === nextStatus) return;
  if (!TASK_TRANSITIONS[currentStatus]?.has(nextStatus)) {
    throw new ApiError(
      409,
      `Task status cannot change from ${currentStatus} to ${nextStatus}`,
      "INVALID_TASK_STATUS_TRANSITION",
    );
  }
}

export async function updateAmbassadorTaskStatus({ ambassadorId, taskId, status }) {
  const task = await Task.findOne({ ambassadorId, taskId });
  if (!task) {
    throw new ApiError(404, "Task was not found", "TASK_NOT_FOUND");
  }

  assertTaskStatusTransition(task.status, status);
  if (task.status === status) return publicTask(task);

  const now = new Date();
  task.status = status;

  if (status === TASK_STATUS.IN_PROGRESS && !task.startedAt) {
    task.startedAt = now;
  }

  if (status === TASK_STATUS.COMPLETED) {
    if (!task.startedAt) task.startedAt = now;
    if (!task.completedAt) task.completedAt = now;
  }

  await task.save();
  return publicTask(task);
}

export async function updateAmbassadorTaskDetails({
  ambassadorId,
  taskId,
  remarks,
  completionDetails,
}) {
  const update = {};
  if (remarks !== undefined) update.remarks = remarks;
  if (completionDetails !== undefined) update.completionDetails = completionDetails;

  const task = await Task.findOneAndUpdate(
    { ambassadorId, taskId },
    { $set: update },
    { new: true, runValidators: true },
  );

  if (!task) {
    throw new ApiError(404, "Task was not found", "TASK_NOT_FOUND");
  }

  return publicTask(task);
}

export async function listAmbassadorReferrals({ ambassadorId, page, limit, status }) {
  const filter = { ambassadorId };
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const [registrations, total, referralRows] = await Promise.all([
    Registration.find(filter)
      .select("registrationId name packageCode packageName promoCode status createdAt")
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Registration.countDocuments(filter),
    statusCounts(Registration, ambassadorId),
  ]);

  return {
    referrals: registrations.map(publicReferral),
    stats: mapReferralStats(referralRows),
    pagination: {
      page,
      limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      hasNextPage: skip + registrations.length < total,
      hasPreviousPage: page > 1,
    },
  };
}
