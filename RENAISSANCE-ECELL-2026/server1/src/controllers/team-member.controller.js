import { TeamMember } from "../models/index.js";
import { ApiError } from "../utils/api-error.js";

const DEFAULT_CATEGORY_LABELS = {
  faculty: "Faculty Incharge",
  final_year: "Our Team (Final Year)",
  pre_final_year: "Our Team (Pre-Final Year)",
  second_year: "Our Team (Second Year)",
  alumni: "Alumni Network",
};

const INITIAL_MEMBERS = [
  {
    name: "Prof. Mukul Shukla",
    category: "faculty",
    categoryLabel: "Faculty Incharge",
    role: "Faculty Incharge",
    sequence: 1,
    imageUrl: "https://res.cloudinary.com/ddjzcyl4d/image/upload/v1774029796/image_1_roojuv.avif",
    linkedin: "https://www.linkedin.com/in/mukul-shukla-329a7121",
    isActive: true,
  },
  {
    name: "Prof. Mayank Pandey",
    category: "faculty",
    categoryLabel: "Faculty Incharge",
    role: "Faculty Incharge",
    sequence: 2,
    imageUrl: "https://res.cloudinary.com/ddjzcyl4d/image/upload/v1774029797/image_wj6szw.avif",
    linkedin: "https://www.linkedin.com/in/mayank-pandey-0b433137/",
    isActive: true,
  },
  {
    name: "Shreyansh Rathi",
    category: "final_year",
    categoryLabel: "Our Team (Final Year)",
    role: "President",
    sequence: 1,
    imageUrl: "",
    linkedin: "https://www.linkedin.com",
    isActive: true,
  },
  {
    name: "Ayush Gupta",
    category: "final_year",
    categoryLabel: "Our Team (Final Year)",
    role: "Vice President",
    sequence: 2,
    imageUrl: "",
    linkedin: "https://www.linkedin.com",
    isActive: true,
  },
  {
    name: "Krishna Raj Agarwal",
    category: "final_year",
    categoryLabel: "Our Team (Final Year)",
    role: "Secretary & Media Lead",
    sequence: 3,
    imageUrl: "",
    linkedin: "https://www.linkedin.com",
    isActive: true,
  },
  {
    name: "Aman Kumar Goyal",
    category: "final_year",
    categoryLabel: "Our Team (Final Year)",
    role: "Joint Secretary",
    sequence: 4,
    imageUrl: "",
    linkedin: "https://www.linkedin.com",
    isActive: true,
  },
  {
    name: "Marketing Lead 1",
    category: "pre_final_year",
    categoryLabel: "Our Team (Pre-Final Year)",
    subTeam: "Marketing Team",
    role: "Marketing Co-Lead",
    sequence: 1,
    imageUrl: "",
    linkedin: "https://www.linkedin.com",
    isActive: true,
  },
  {
    name: "Marketing Member 2",
    category: "pre_final_year",
    categoryLabel: "Our Team (Pre-Final Year)",
    subTeam: "Marketing Team",
    role: "Campaign Strategist",
    sequence: 2,
    imageUrl: "",
    linkedin: "https://www.linkedin.com",
    isActive: true,
  },
  {
    name: "Media Lead 1",
    category: "pre_final_year",
    categoryLabel: "Our Team (Pre-Final Year)",
    subTeam: "Media Team",
    role: "Media Co-Lead",
    sequence: 1,
    imageUrl: "",
    linkedin: "https://www.linkedin.com",
    isActive: true,
  },
  {
    name: "Media Member 2",
    category: "pre_final_year",
    categoryLabel: "Our Team (Pre-Final Year)",
    subTeam: "Media Team",
    role: "Video & Visuals",
    sequence: 2,
    imageUrl: "",
    linkedin: "https://www.linkedin.com",
    isActive: true,
  },
  {
    name: "Event Lead 1",
    category: "pre_final_year",
    categoryLabel: "Our Team (Pre-Final Year)",
    subTeam: "Event Management Team",
    role: "Operations Lead",
    sequence: 1,
    imageUrl: "",
    linkedin: "https://www.linkedin.com",
    isActive: true,
  },
  {
    name: "Event Coordinator 2",
    category: "pre_final_year",
    categoryLabel: "Our Team (Pre-Final Year)",
    subTeam: "Event Management Team",
    role: "Logistics Coordinator",
    sequence: 2,
    imageUrl: "",
    linkedin: "https://www.linkedin.com",
    isActive: true,
  },
  {
    name: "Web Lead 1",
    category: "pre_final_year",
    categoryLabel: "Our Team (Pre-Final Year)",
    subTeam: "Web Team",
    role: "Technical Lead",
    sequence: 1,
    imageUrl: "",
    linkedin: "https://www.linkedin.com",
    isActive: true,
  },
  {
    name: "Frontend Developer 2",
    category: "pre_final_year",
    categoryLabel: "Our Team (Pre-Final Year)",
    subTeam: "Web Team",
    role: "UI/UX Developer",
    sequence: 2,
    imageUrl: "",
    linkedin: "https://www.linkedin.com",
    isActive: true,
  },
];

export async function seedDefaultTeamMembersIfEmpty() {
  const count = await TeamMember.countDocuments();
  if (count === 0) {
    await TeamMember.insertMany(INITIAL_MEMBERS);
  } else {
    const finalYearCount = await TeamMember.countDocuments({ category: "final_year" });
    if (finalYearCount === 0) {
      const nonFaculty = INITIAL_MEMBERS.filter((m) => m.category !== "faculty");
      await TeamMember.insertMany(nonFaculty);
    }
  }
}

async function getCategoryCounts() {
  const counts = {
    faculty: 0,
    final_year: 0,
    pre_final_year: 0,
    second_year: 0,
    alumni: 0,
  };
  const aggregated = await TeamMember.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);
  for (const item of aggregated) {
    if (item._id in counts) {
      counts[item._id] = item.count;
    }
  }
  return counts;
}

// Public: Get all active team members
export async function getTeamMembers(req, res) {
  await seedDefaultTeamMembersIfEmpty();
  const { category } = req.query;
  const filter = { isActive: true };
  if (category) {
    filter.category = category;
  }

  const members = await TeamMember.find(filter).sort({ sequence: 1, createdAt: 1 });
  const counts = await getCategoryCounts();

  res.status(200).json({
    success: true,
    data: {
      members,
      counts,
    },
  });
}

// Admin: List all team members
export async function adminListTeamMembers(req, res) {
  await seedDefaultTeamMembersIfEmpty();
  const { category } = req.query;
  const filter = {};
  if (category) {
    filter.category = category;
  }

  const members = await TeamMember.find(filter).sort({ sequence: 1, createdAt: 1 });
  const counts = await getCategoryCounts();

  res.status(200).json({
    success: true,
    data: {
      members,
      counts,
    },
  });
}

// Admin: Create member or slot
export async function adminCreateTeamMember(req, res) {
  const {
    name,
    category = "second_year",
    categoryLabel,
    subTeam = "",
    role = "",
    registrationNo = "",
    sequence,
    imageUrl = "",
    email = "",
    linkedin = "",
    instagram = "",
  } = req.body;

  if (!name || !name.trim()) {
    throw new ApiError(400, "Name is required", "NAME_REQUIRED");
  }

  let memberSeq = sequence;
  if (!memberSeq) {
    const highest = await TeamMember.findOne({ category }).sort({ sequence: -1 });
    memberSeq = highest ? highest.sequence + 1 : 1;
  }

  const label = categoryLabel || DEFAULT_CATEGORY_LABELS[category] || "Our Team";

  const member = await TeamMember.create({
    name: name.trim(),
    category,
    categoryLabel: label,
    subTeam: subTeam.trim(),
    role: role.trim(),
    registrationNo: registrationNo.trim(),
    sequence: Number(memberSeq) || 1,
    imageUrl,
    email: email.trim(),
    linkedin: linkedin.trim(),
    instagram: instagram.trim(),
    isActive: true,
  });

  res.status(201).json({
    success: true,
    data: { member },
  });
}

// Admin: Update member details / image
export async function adminUpdateTeamMember(req, res) {
  const { id } = req.params;
  const member = await TeamMember.findById(id);
  if (!member) {
    throw new ApiError(404, "Team member not found", "MEMBER_NOT_FOUND");
  }

  const allowedFields = [
    "name",
    "category",
    "categoryLabel",
    "subTeam",
    "role",
    "registrationNo",
    "sequence",
    "imageUrl",
    "email",
    "linkedin",
    "instagram",
    "isActive",
  ];

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      member[field] = req.body[field];
    }
  }

  await member.save();

  res.status(200).json({
    success: true,
    data: { member },
  });
}

// Admin: Delete member or slot
export async function adminDeleteTeamMember(req, res) {
  const { id } = req.params;
  const member = await TeamMember.findByIdAndDelete(id);
  if (!member) {
    throw new ApiError(404, "Team member not found", "MEMBER_NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    message: "Team member deleted successfully",
    data: { id },
  });
}

// Admin: Quick +1 / -1 Slot
export async function adminAdjustSlots(req, res) {
  const { category, action, subTeam } = req.body;
  if (!category || !["add", "remove"].includes(action)) {
    throw new ApiError(400, "Valid category and action ('add' | 'remove') are required", "INVALID_SLOT_ACTION");
  }

  const query = { category };
  if (subTeam && subTeam !== "ALL") {
    query.subTeam = subTeam;
  }

  if (action === "add") {
    const highest = await TeamMember.findOne(query).sort({ sequence: -1 });
    const nextSeq = highest ? highest.sequence + 1 : 1;
    const label = DEFAULT_CATEGORY_LABELS[category] || "Our Team";
    const member = await TeamMember.create({
      name: `Member ${nextSeq}`,
      category,
      categoryLabel: label,
      subTeam: subTeam && subTeam !== "ALL" ? subTeam : (category === "pre_final_year" ? "Marketing Team" : ""),
      role: "",
      sequence: nextSeq,
      imageUrl: "",
      isActive: true,
    });
    return res.status(201).json({ success: true, data: { member, action: "added" } });
  }

  if (action === "remove") {
    const highest = await TeamMember.findOne(query).sort({ sequence: -1 });
    if (!highest) {
      throw new ApiError(400, "No slots left to remove in this category", "NO_SLOTS_TO_REMOVE");
    }
    await TeamMember.findByIdAndDelete(highest._id);
    return res.status(200).json({ success: true, data: { id: highest._id, action: "removed" } });
  }
}
