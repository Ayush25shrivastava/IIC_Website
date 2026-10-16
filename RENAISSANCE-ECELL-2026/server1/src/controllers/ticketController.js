import Ticket from '../models/ticketModel.js';
import { TicketStageConfig } from '../models/index.js';
import { randomBytes } from 'node:crypto';

const ticketTypes = [
  'event-standard', 'event-premium', 'event-elite',
  'accom-standard', 'accom-premium', 'accom-elite',
];
const DEFAULT_STAGES = [1, 2, 3].map((number) => ({ stageId: `stage-${number}`, name: `Stage ${number}` }));
const MAX_STAGES_PER_PASS = 20;

async function getOrCreateStageConfig(ticketType) {
  try {
    return await TicketStageConfig.findOneAndUpdate(
      { ticketType },
      { $setOnInsert: { ticketType, stages: DEFAULT_STAGES } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  } catch (error) {
    if (error.code !== 11000) throw error;
    return TicketStageConfig.findOne({ ticketType });
  }
}

const ticketPrices = {
  'event-standard': 499,
  'event-premium': 699,
  'event-elite': 1099,
  'accom-standard': 899,
  'accom-premium': 1099,
  'accom-elite': 1499,
};

function publicTicket(ticket) {
  return {
    ticketId: ticket.ticketId,
    name: ticket.name,
    teamName: ticket.teamName,
    college: ticket.college,
    city: ticket.city,
    ticketType: ticket.ticketType,
    accommodationDays: ticket.accommodationDays,
    amountPaid: ticket.amountPaid,
    status: ticket.status,
    stageScans: ticket.stageScans.map(({ stageId, stageName, stage, scannedAt }) => ({ stageId, stageName, stage, scannedAt })),
  };
}

export const purchaseTicket = async (req, res) => {
  try {
    const {
      name, email, phone, college, city, ticketType,
      checkInDate, checkOutDate, accommodationPreferences, transactionId, amountPaid,
      accommodationDays = 0,
      teamName,
    } = req.body;

    // Validate required fields
    const requiredText = [name, email, phone, college, city, ticketType, transactionId, teamName];
    if (!requiredText.every((value) => typeof value === 'string' && value.trim()) || amountPaid === undefined || amountPaid === null || String(amountPaid).trim() === '') {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const normalizedTransactionId = transactionId.trim().toUpperCase();

    const baseAmount = ticketPrices[ticketType];
    if (!baseAmount) {
      return res.status(400).json({ success: false, message: 'Invalid ticket type' });
    }

    const isAccommodation = ticketType.startsWith('accom-');
    const days = Number(accommodationDays);
    if (!Number.isInteger(days) || (isAccommodation ? days < 1 || days > 4 : days !== 0)) {
      return res.status(400).json({ success: false, message: 'Invalid accommodation duration' });
    }
    const amount = baseAmount + (isAccommodation ? (days - 1) * 500 : 0);
    if (!Number.isFinite(Number(amountPaid)) || Number(amountPaid) !== amount) {
      return res.status(400).json({ success: false, message: `Amount paid must match the selected pass total of ₹${amount}` });
    }

    // Check if transaction ID is already used
    const existingTicket = await Ticket.findOne({ transactionId: normalizedTransactionId });
    if (existingTicket) {
      return res.status(400).json({ success: false, message: 'Transaction ID already exists' });
    }

    const ticket = new Ticket({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      college: college.trim(),
      city: city.trim(),
      teamName: teamName.trim(),
      ticketType,
      accommodationDays: days,
      checkInDate: checkInDate || null,
      checkOutDate: checkOutDate || null,
      accommodationPreferences: accommodationPreferences || '',
      transactionId: normalizedTransactionId,
      ticketId: `REN-${randomBytes(6).toString('hex').toUpperCase()}`,
      amount,
      amountPaid: Number(amountPaid)
    });

    await ticket.save();

    res.status(201).json({
      success: true,
      message: 'Ticket purchase submitted successfully. It will be verified by admins.',
      ticket: { ticketId: ticket.ticketId, status: ticket.status }
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.transactionId) {
      return res.status(409).json({ success: false, message: 'Transaction ID already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tickets.length, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTicketStageConfigs = async (_req, res) => {
  try {
    const configs = await Promise.all(ticketTypes.map((ticketType) => getOrCreateStageConfig(ticketType)));
    res.status(200).json({
      success: true,
      configs: configs.map(({ ticketType, stages }) => ({ ticketType, stages })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addTicketStage = async (req, res) => {
  try {
    const { ticketType } = req.params;
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    if (!ticketTypes.includes(ticketType)) return res.status(400).json({ success: false, message: 'Invalid pass type' });
    if (name.length < 2 || name.length > 50) return res.status(400).json({ success: false, message: 'Stage name must be 2–50 characters' });

    const config = await getOrCreateStageConfig(ticketType);
    if (config.stages.length >= MAX_STAGES_PER_PASS) {
      return res.status(400).json({ success: false, message: `A pass can have at most ${MAX_STAGES_PER_PASS} stages` });
    }
    if (config.stages.some((stage) => stage.name.toLowerCase() === name.toLowerCase())) {
      return res.status(409).json({ success: false, message: 'A stage with that name already exists for this pass' });
    }

    const stage = { stageId: `custom-${randomBytes(8).toString('hex')}`, name, createdAt: new Date() };
    const updated = await TicketStageConfig.findOneAndUpdate(
      { _id: config._id, 'stages.stageId': { $ne: stage.stageId } },
      { $push: { stages: stage } },
      { new: true, runValidators: true },
    );
    if (!updated) return res.status(409).json({ success: false, message: 'Stage list changed; refresh and try again' });
    res.status(201).json({ success: true, ticketType, stages: updated.stages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTicketStage = async (req, res) => {
  try {
    const { ticketType, stageId } = req.params;
    if (!ticketTypes.includes(ticketType)) return res.status(400).json({ success: false, message: 'Invalid pass type' });
    const updated = await TicketStageConfig.findOneAndUpdate(
      { ticketType, 'stages.stageId': stageId },
      { $pull: { stages: { stageId } } },
      { new: true },
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Stage not found for this pass' });
    res.status(200).json({ success: true, ticketType, stages: updated.stages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body; // status should be 'Verified' or 'Rejected'

    if (!['Verified', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    ticket.status = status;
    ticket.verifiedBy = req.admin._id;
    if (remarks) {
      ticket.verificationRemarks = remarks;
    }

    await ticket.save();

    res.status(200).json({
      success: true,
      message: `Ticket marked as ${status}`,
      ticket
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;

    if (!ticketId) {
      return res.status(400).json({ success: false, message: 'Ticket ID is required' });
    }

    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const result = {
      ticketId: ticket.ticketId,
      status: ticket.status,
    };
    if (ticket.status === 'Verified') {
      Object.assign(result, {
        name: ticket.name,
        teamName: ticket.teamName,
        college: ticket.college,
        city: ticket.city,
        ticketType: ticket.ticketType,
        accommodationDays: ticket.accommodationDays,
        amountPaid: ticket.amountPaid,
        stageScans: ticket.stageScans.map(({ stageId, stageName, stage, scannedAt }) => ({ stageId, stageName, stage, scannedAt })),
      });
    }

    res.status(200).json({
      success: true,
      ticket: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const scanTicket = async (req, res) => {
  try {
    const { ticketId } = req.body;
    if (typeof ticketId !== 'string' || !ticketId.trim()) {
      return res.status(400).json({ success: false, message: 'A valid ticket ID is required' });
    }

    const normalizedTicketId = ticketId.trim().toUpperCase();
    const existing = await Ticket.findOne({ ticketId: normalizedTicketId });
    if (!existing) return res.status(404).json({ success: false, message: 'Ticket not found' });
    if (existing.status !== 'Verified') {
      return res.status(409).json({ success: false, message: `Ticket is ${existing.status.toLowerCase()} and cannot be scanned` });
    }
    if (req.body.ticketType && req.body.ticketType !== existing.ticketType) {
      return res.status(409).json({ success: false, message: 'Selected pass type does not match this ticket' });
    }

    const config = await getOrCreateStageConfig(existing.ticketType);
    const requestedStageId = typeof req.body.stageId === 'string' ? req.body.stageId : '';
    // Support old scanner clients by translating their numeric stage selection through this pass's stage list.
    const legacyStage = Number(req.body.stage);
    const selectedStage = requestedStageId
      ? config.stages.find((stage) => stage.stageId === requestedStageId)
      : Number.isInteger(legacyStage) && legacyStage > 0 ? config.stages[legacyStage - 1] : null;
    if (!selectedStage) return res.status(400).json({ success: false, message: 'Select a stage configured for this pass type' });
    const legacyStageNumber = selectedStage.stageId.match(/^stage-([1-3])$/)
      ? Number(selectedStage.stageId.slice('stage-'.length))
      : null;
    const matchingScans = [{ stageId: selectedStage.stageId }];
    if (legacyStageNumber) matchingScans.push({ stage: legacyStageNumber });

    const ticket = await Ticket.findOneAndUpdate(
      {
        _id: existing._id,
        status: 'Verified',
        stageScans: { $not: { $elemMatch: { $or: matchingScans } } },
      },
      {
        $push: {
          stageScans: {
            stageId: selectedStage.stageId,
            stageName: selectedStage.name,
            ...(legacyStageNumber ? { stage: legacyStageNumber } : {}),
            ...(req.admin?._id ? { scannedBy: req.admin._id, scannedByRole: 'ADMIN' } : {
              scannedByRole: 'VOLUNTEER_SCANNER',
              scannedByEmail: req.volunteerScanner?.email,
            }),
            scannedAt: new Date(),
          }
        }
      },
      { new: true },
    );

    if (ticket) {
      return res.status(200).json({ success: true, alreadyScanned: false, selectedStage: { stageId: selectedStage.stageId, name: selectedStage.name }, ticket: publicTicket(ticket) });
    }

    const latest = await Ticket.findById(existing._id);
    if (latest.stageScans.some((scan) => scan.stageId === selectedStage.stageId || (legacyStageNumber && scan.stage === legacyStageNumber))) {
      return res.status(200).json({ success: true, alreadyScanned: true, selectedStage: { stageId: selectedStage.stageId, name: selectedStage.name }, ticket: publicTicket(latest) });
    }
    return res.status(409).json({ success: false, message: 'Ticket could not be scanned. Please retry.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
