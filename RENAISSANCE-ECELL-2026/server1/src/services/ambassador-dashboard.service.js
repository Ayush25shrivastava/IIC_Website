import {
  REGISTRATION_STATUS,
  TASK_STATUS,
} from "../constants/domain.js";
import {
  PromoCode,
  Registration,
  Ticket,
  Task,
} from "../models/index.js";
import { randomBytes } from "node:crypto";
import { CampusAmbassador } from "../models/index.js";
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

async function getOrAssignPrimaryPromoCode(ambassadorId) {
  let promo = await PromoCode.findOne({ ambassadorId, isPrimary: true }).lean();
  if (promo) return promo;
  const ambassador = await CampusAmbassador.findById(ambassadorId).select("ambassadorId").lean();
  if (!ambassador) return null;
  const suffix = randomBytes(5).toString("hex").toUpperCase();
  try {
    promo = await PromoCode.findOneAndUpdate(
      { ambassadorId, isPrimary: true },
      { $setOnInsert: { code: `RNX-${suffix}`, ambassadorId, isPrimary: true, discountType: "NONE", discountValue: 0 } },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true },
    ).lean();
  } catch (error) {
    if (error.code !== 11000) throw error;
    promo = await PromoCode.findOne({ ambassadorId, isPrimary: true }).lean();
  }
  return promo;
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
    dueAt: task.dueAt ?? null,
    status: task.status,
    reviewStatus: task.reviewStatus || (task.status === "COMPLETED" ? "PENDING" : "NONE"),
    reviewFeedback: task.reviewFeedback || "",
    reviewedAt: task.reviewedAt ?? null,
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

function combineReferralRows(registrationRows, ticketRows) {
  const statusMap = { Pending: REGISTRATION_STATUS.PENDING_VERIFICATION, Verified: REGISTRATION_STATUS.VERIFIED, Rejected: REGISTRATION_STATUS.REJECTED };
  const counts = new Map(registrationRows.map((row) => [row._id, row.count]));
  for (const row of ticketRows) {
    const status = statusMap[row._id];
    if (status) counts.set(status, (counts.get(status) || 0) + row.count);
  }
  return [...counts].map(([_id, count]) => ({ _id, count }));
}

function publicTicketReferral(ticket) {
  return {
    id: ticket._id.toString(), registrationId: ticket.ticketId,
    participantName: participantDisplayName(ticket.name),
    packageCode: ticket.ticketType, packageName: ticket.ticketType,
    promoCode: ticket.promoCode, status: ({ Pending: REGISTRATION_STATUS.PENDING_VERIFICATION, Verified: REGISTRATION_STATUS.VERIFIED, Rejected: REGISTRATION_STATUS.REJECTED })[ticket.status] || ticket.status.toUpperCase(),
    createdAt: ticket.createdAt, recordType: "TICKET",
  };
}

export async function getAmbassadorDashboardData(ambassador) {
  const [promo, taskRows, referralRows, ticketRows] = await Promise.all([
    getOrAssignPrimaryPromoCode(ambassador._id),
    statusCounts(Task, ambassador._id),
    statusCounts(Registration, ambassador._id),
    statusCounts(Ticket, ambassador._id),
  ]);

  return {
    ambassador: publicAmbassador(ambassador),
    promoCode: promo ? {
      ...publicPromoCode(promo),
      registrationCount: await Registration.countDocuments({ ambassadorId: ambassador._id, promoCodeId: promo._id }) + await Ticket.countDocuments({ ambassadorId: ambassador._id, promoCodeId: promo._id }),
    } : null,
    taskStats: mapTaskStats(taskRows),
    referralStats: mapReferralStats(combineReferralRows(referralRows, ticketRows)),
  };
}

export async function getAmbassadorPrimaryPromoCode(ambassadorId) {
  const promo = await getOrAssignPrimaryPromoCode(ambassadorId);
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

export async function updateAmbassadorTask({ ambassadorId, taskId, status, remarks, completionDetails }) {
  const task = await Task.findOne({ ambassadorId, taskId }).lean();
  if (!task) throw new ApiError(404, "Task was not found", "TASK_NOT_FOUND");
  if (task.status === TASK_STATUS.COMPLETED && (remarks !== undefined || completionDetails !== undefined)) {
    throw new ApiError(409, "Submitted tasks are locked until an admin requests changes", "TASK_SUBMITTED");
  }
  const update = {};
  if (status === TASK_STATUS.COMPLETED && task.status !== TASK_STATUS.COMPLETED) {
    update.reviewStatus = "PENDING";
    update.reviewedAt = null;
    update.reviewedByAdminId = null;
  }
  if (status !== undefined) {
    assertTaskStatusTransition(task.status, status);
    update.status = status;
    if (status !== TASK_STATUS.ASSIGNED && !task.startedAt) update.startedAt = new Date();
    if (status === TASK_STATUS.COMPLETED && !task.completedAt) update.completedAt = new Date();
  }
  if (remarks !== undefined) update.remarks = remarks;
  if (completionDetails !== undefined) update.completionDetails = completionDetails;
  const saved = await Task.findOneAndUpdate(
    { ambassadorId, taskId, status: task.status, updatedAt: task.updatedAt },
    { $set: update }, { new: true, runValidators: true },
  );
  if (!saved) throw new ApiError(409, "Task changed. Refresh and try again.", "TASK_CHANGED");
  return publicTask(saved);
}

export const updateAmbassadorTaskStatus = updateAmbassadorTask;
export const updateAmbassadorTaskDetails = updateAmbassadorTask;

export async function listAmbassadorReferrals({ ambassadorId, page, limit, status }) {
  const skip = (page - 1) * limit;
  const filter = { ambassadorId };
  const ticketStatus = status === REGISTRATION_STATUS.PENDING_VERIFICATION ? "Pending" : status === REGISTRATION_STATUS.VERIFIED ? "Verified" : status === REGISTRATION_STATUS.REJECTED ? "Rejected" : undefined;
  const registrationFilter = { ...filter, ...(status ? { status } : {}) };
  const ticketFilter = { ...filter, ...(ticketStatus ? { status: ticketStatus } : {}) };
  const [registrations, tickets, registrationTotal, ticketTotal, registrationRows, ticketRows] = await Promise.all([
    Registration.find(registrationFilter)
      .select("registrationId name packageCode packageName promoCode status createdAt")
      .sort({ createdAt: -1, _id: -1 }).limit(skip + limit)
      .lean(),
    Ticket.find(ticketFilter).select("ticketId name ticketType promoCode status createdAt")
      .sort({ createdAt: -1, _id: -1 }).limit(skip + limit).lean(),
    Registration.countDocuments(registrationFilter), Ticket.countDocuments(ticketFilter),
    statusCounts(Registration, ambassadorId),
    statusCounts(Ticket, ambassadorId),
  ]);
  const merged = [...registrations.map(publicReferral), ...tickets.map(publicTicketReferral)]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt) || b.id.localeCompare(a.id));
  const total = registrationTotal + ticketTotal;

  return {
    referrals: merged.slice(skip, skip + limit),
    stats: mapReferralStats(combineReferralRows(registrationRows, ticketRows)),
    pagination: {
      page,
      limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      hasNextPage: skip + limit < total,
      hasPreviousPage: page > 1,
    },
  };
}
