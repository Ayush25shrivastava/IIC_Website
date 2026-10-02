import Ticket from '../models/ticketModel.js';

export const purchaseTicket = async (req, res) => {
  try {
    const { 
      name, email, phone, college, city, ticketType, 
      checkInDate, checkOutDate, accommodationPreferences, transactionId, amountPaid 
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !college || !city || !ticketType || !transactionId || !amountPaid) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const ticketPrices = {
      'event-only': 900,
      '1-day': 1750,
      '2-day': 2450
    };
    
    const amount = ticketPrices[ticketType];
    if (!amount) {
      return res.status(400).json({ success: false, message: 'Invalid ticket type' });
    }

    // Check if transaction ID is already used
    const existingTicket = await Ticket.findOne({ transactionId });
    if (existingTicket) {
      return res.status(400).json({ success: false, message: 'Transaction ID already exists' });
    }

    const generateTicketId = () => {
      return 'REN-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    const ticket = new Ticket({
      name,
      email,
      phone,
      college,
      city,
      ticketType,
      checkInDate: checkInDate || null,
      checkOutDate: checkOutDate || null,
      accommodationPreferences: accommodationPreferences || '',
      transactionId,
      ticketId: generateTicketId(),
      amount,
      amountPaid: Number(amountPaid)
    });

    await ticket.save();

    res.status(201).json({
      success: true,
      message: 'Ticket purchase submitted successfully. It will be verified by admins.',
      ticket
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    // Only admins should hit this route. Will add middleware for that.
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
    ticket.verifiedBy = req.user._id; // Assuming auth middleware sets req.user
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

    res.status(200).json({
      success: true,
      ticket: {
        name: ticket.name,
        amountPaid: ticket.amountPaid,
        status: ticket.status
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
