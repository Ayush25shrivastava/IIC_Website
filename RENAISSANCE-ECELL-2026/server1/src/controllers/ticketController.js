import Ticket from '../models/ticketModel.js';
import { randomBytes } from 'node:crypto';

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
    ticketType: ticket.ticketType,
    accommodationDays: ticket.accommodationDays,
    amountPaid: ticket.amountPaid,
    status: ticket.status,
    stageScans: ticket.stageScans.map(({ stage, scannedAt }) => ({ stage, scannedAt })),
  };
}

export const purchaseTicket = async (req, res) => {
  try {
    const {
      name, email, phone, college, city, ticketType,
      checkInDate, checkOutDate, accommodationPreferences, transactionId, amountPaid,
      accommodationDays = 0,
    } = req.body;

    // Validate required fields
    const requiredText = [name, email, phone, college, city, ticketType, transactionId];
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
        ticketType: ticket.ticketType,
        accommodationDays: ticket.accommodationDays,
        amountPaid: ticket.amountPaid,
        stageScans: ticket.stageScans.map(({ stage, scannedAt }) => ({ stage, scannedAt })),
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
    const stage = Number(req.body.stage);
    if (typeof ticketId !== 'string' || !ticketId.trim() || !Number.isInteger(stage) || stage < 1 || stage > 3) {
      return res.status(400).json({ success: false, message: 'A valid ticket ID and stage (1–3) are required' });
    }

    const ticket = await Ticket.findOneAndUpdate(
      { ticketId: ticketId.trim().toUpperCase(), status: 'Verified', 'stageScans.stage': { $ne: stage } },
      { $push: { stageScans: { stage, scannedBy: req.admin._id, scannedAt: new Date() } } },
      { new: true },
    );

    if (ticket) {
      return res.status(200).json({ success: true, alreadyScanned: false, ticket: publicTicket(ticket) });
    }

    const existing = await Ticket.findOne({ ticketId: ticketId.trim().toUpperCase() });
    if (!existing) return res.status(404).json({ success: false, message: 'Ticket not found' });
    if (existing.status !== 'Verified') {
      return res.status(409).json({ success: false, message: `Ticket is ${existing.status.toLowerCase()} and cannot be scanned` });
    }
    if (existing.stageScans.some((scan) => scan.stage === stage)) {
      return res.status(200).json({ success: true, alreadyScanned: true, ticket: publicTicket(existing) });
    }
    return res.status(409).json({ success: false, message: 'Ticket could not be scanned. Please retry.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
