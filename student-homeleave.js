/* ==========================================================================
   student-homeleave.js
   Smart Hostel 360 - Student Home Leave Module
   Data, table rendering, filters, modal, form handling, app shell behaviour
   ========================================================================== */

/* ---------- Sample data ---------- */
let LEAVE_DATA = [
  {
    id: "HL-2041",
    type: "Weekend Leave",
    from: "2026-07-21",
    to: "2026-07-22",
    appliedDate: "2026-07-19",
    returnDate: "2026-07-22",
    status: "Approved",
    remarks: "Approved. Carry your ID card.",
    approvedBy: "Warden - Mr. Ramesh Iyer",
    decisionDate: "2026-07-20",
    address: "12 Lake View Colony, Anna Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600040",
    parentName: "Suresh Krishnan",
    parentMobile: "+91 98400 11223",
    reason: "Weekend visit home to attend a family function.",
    document: null,
  },
  {
    id: "HL-2038",
    type: "Medical Leave",
    from: "2026-07-14",
    to: "2026-07-17",
    appliedDate: "2026-07-12",
    returnDate: "2026-07-17",
    status: "Completed",
    remarks: "Return verified by Warden.",
    approvedBy: "Warden - Mr. Ramesh Iyer",
    decisionDate: "2026-07-12",
    address: "12 Lake View Colony, Anna Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600040",
    parentName: "Suresh Krishnan",
    parentMobile: "+91 98400 11223",
    reason: "Fever and needed to consult the family doctor.",
    document: "medical_certificate.pdf",
  },
  {
    id: "HL-2030",
    type: "Home Leave",
    from: "2026-06-28",
    to: "2026-07-02",
    appliedDate: "2026-06-25",
    returnDate: "2026-07-02",
    status: "Completed",
    remarks: "Return verified by Warden.",
    approvedBy: "Warden - Mr. Ramesh Iyer",
    decisionDate: "2026-06-26",
    address: "12 Lake View Colony, Anna Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600040",
    parentName: "Suresh Krishnan",
    parentMobile: "+91 98400 11223",
    reason: "Semester break, visiting home.",
    document: null,
  },
  {
    id: "HL-2024",
    type: "Emergency Leave",
    from: "2026-06-10",
    to: "2026-06-12",
    appliedDate: "2026-06-10",
    returnDate: "2026-06-12",
    status: "Rejected",
    remarks: "Insufficient supporting document attached. Please reapply with a valid document.",
    approvedBy: "Warden - Mr. Ramesh Iyer",
    decisionDate: "2026-06-10",
    address: "12 Lake View Colony, Anna Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600040",
    parentName: "Suresh Krishnan",
    parentMobile: "+91 98400 11223",
    reason: "Family emergency at home.",
    document: null,
  },
  {
    id: "HL-2018",
    type: "Weekend Leave",
    from: "2026-05-23",
    to: "2026-05-24",
    appliedDate: "2026-05-21",
    returnDate: "2026-05-24",
    status: "Completed",
    remarks: "Return verified by Warden.",
    approvedBy: "Warden - Mr. Ramesh Iyer",
    decisionDate: "2026-05-21",
    address: "12 Lake View Colony, Anna Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600040",
    parentName: "Suresh Krishnan",
    parentMobile: "+91 98400 11223",
    reason: "Cousin's engagement ceremony.",
    document: "permission_letter.pdf",
  },
  {
    id: "HL-2044",
    type: "Home Leave",
    from: "2026-08-08",
    to: "2026-08-11",
    appliedDate: "2026-08-01",
    returnDate: "2026-08-11",
    status: "Pending",
    remarks: "Awaiting Warden approval.",
    approvedBy: "-",
    decisionDate: "-",
    address: "12 Lake View Colony, Anna Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600040",
    parentName: "Suresh Krishnan",
    parentMobile: "+91 98400 11223",
    reason: "Long weekend visit home for a family gathering.",
    document: null,
  },
  {
    id: "HL-2045",
    type: "Medical Leave",
    from: "2026-08-03",
    to: "2026-08-05",
    appliedDate: "2026-08-02",
    returnDate: "2026-08-05",
    status: "Pending",
    remarks: "Awaiting Warden approval.",
    approvedBy: "-",
    decisionDate: "-",
    address: "12 Lake View Colony, Anna Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600040",
    parentName: "Suresh Krishnan",
    parentMobile: "+91 98400 11223",
    reason: "Dental procedure at the family dentist.",
    document: "medical_certificate.pdf",
  },
];

const STATUS_CLASS_MAP = {
  Pending: "status-pending",
  Approved: "status-approved",
  Rejected: "status-rejected",
  Completed: "status-leavecompleted",
};

/* ---------- Helpers ---------- */
function formatDate(isoDate) {
  if (!isoDate || isoDate === "-") return "-";
  const d = new Date(isoDate);
  if (isNaN(d)) return isoDate;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function totalDays(from, to) {
  const start = new Date(from);
  const end = new Date(to);
  if (isNaN(start) || isNaN(end) || end < start) return "-";
  const diff = Math.round((end - start) / 86400000) + 1;
  return diff;
}

/* ---------- Rendering: Leave Request Status table ---------- */
function renderLeaveTable(data) {
  const tbody = document.getElementById("leaveTbody");
  const emptyState = document.getElementById("emptyState");
  const tableWrap = document.querySelector("#leaveStatusSection .table-wrap");

  if (!data.length) {
    tbody.innerHTML = "";
    tableWrap.style.display = "none";
    emptyState.hidden = false;
    return;
  }

  tableWrap.style.display = "block";
  emptyState.hidden = true;

  tbody.innerHTML = data
    .map((r, i) => {
      const days = totalDays(r.from, r.to);
      const downloadBtn =
        r.status === "Approved" || r.status === "Completed"
          ? `<button class="action-btn secondary" data-download-id="${r.id}">Download Letter</button>`
          : "";
      return `
    <tr style="animation: slideUp 320ms ease both; animation-delay:${i * 40}ms">
      <td><strong>${r.id}</strong></td>
      <td>${r.type}</td>
      <td>${formatDate(r.from)}</td>
      <td>${formatDate(r.to)}</td>
      <td>${days}</td>
      <td>${formatDate(r.appliedDate)}</td>
      <td><span class="badge ${STATUS_CLASS_MAP[r.status]}">${r.status}</span></td>
      <td>${r.remarks || "-"}</td>
      <td><button class="action-btn" data-view-id="${r.id}">View Details</button>${downloadBtn}</td>
    </tr>`;
    })
    .join("");

  tbody.querySelectorAll("[data-view-id]").forEach((btn) => {
    btn.addEventListener("click", () => openLeaveModal(btn.getAttribute("data-view-id")));
  });

  tbody.querySelectorAll("[data-download-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (window.showToast) window.showToast(`Approval letter for ${btn.getAttribute("data-download-id")} downloaded`);
    });
  });
}

/* ---------- Filtering: Leave Request Status ---------- */
function getFilteredLeaveData() {
  const searchTerm = (document.getElementById("globalSearch").value || "").toLowerCase().trim();
  const statusFilter = document.getElementById("filterStatus").value;
  const typeFilter = document.getElementById("filterType").value;

  return LEAVE_DATA.filter((r) => {
    const matchesSearch =
      !searchTerm ||
      r.id.toLowerCase().includes(searchTerm) ||
      r.type.toLowerCase().includes(searchTerm) ||
      r.reason.toLowerCase().includes(searchTerm);

    const matchesStatus = !statusFilter || r.status === statusFilter;
    const matchesType = !typeFilter || r.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });
}

function refreshLeaveTable() {
  renderLeaveTable(getFilteredLeaveData());
}

/* ---------- Rendering: Leave History table ---------- */
function renderHistoryTable(data) {
  const tbody = document.getElementById("historyTbody");
  tbody.innerHTML = data
    .map(
      (r, i) => `
    <tr style="animation: slideUp 320ms ease both; animation-delay:${i * 40}ms">
      <td><strong>${r.type}</strong></td>
      <td>${formatDate(r.from)} - ${formatDate(r.to)}</td>
      <td><span class="badge ${STATUS_CLASS_MAP[r.status]}">${r.status}</span></td>
      <td>${r.approvedBy}</td>
      <td>${formatDate(r.returnDate)}</td>
    </tr>`
    )
    .join("");
}

function getFilteredHistoryData() {
  const dateFilter = document.getElementById("historyDateFilter").value;
  const typeFilter = document.getElementById("historyTypeFilter").value;
  const statusFilter = document.getElementById("historyStatusFilter").value;

  return LEAVE_DATA.filter((r) => {
    if (r.status === "Pending") return false;
    const matchesDate = !dateFilter || r.from === dateFilter || r.to === dateFilter;
    const matchesType = !typeFilter || r.type === typeFilter;
    const matchesStatus = !statusFilter || r.status === statusFilter;
    return matchesDate && matchesType && matchesStatus;
  });
}

function refreshHistoryTable() {
  renderHistoryTable(getFilteredHistoryData());
}

/* ---------- Modal ---------- */
function openLeaveModal(id) {
  const r = LEAVE_DATA.find((x) => x.id === id);
  if (!r) return;

  document.getElementById("modalLeaveId").textContent = `Leave Request #${r.id}`;
  const statusBadge = document.getElementById("modalStatusBadge");
  statusBadge.textContent = r.status;
  statusBadge.className = `badge ${STATUS_CLASS_MAP[r.status]}`;

  document.getElementById("modalStudentName").textContent = "Aarav Krishnan";
  document.getElementById("modalRegNo").textContent = "21CS0142";
  document.getElementById("modalDept").textContent = "Computer Science";
  document.getElementById("modalYear").textContent = "3rd Year";
  document.getElementById("modalRoom").textContent = "B-214";

  document.getElementById("modalLeaveType").textContent = r.type;
  document.getElementById("modalFromDate").textContent = formatDate(r.from);
  document.getElementById("modalToDate").textContent = formatDate(r.to);
  document.getElementById("modalReturnDate").textContent = formatDate(r.returnDate);
  document.getElementById("modalParentContact").textContent = `${r.parentName} - ${r.parentMobile}`;
  document.getElementById("modalAddress").textContent = `${r.address}, ${r.city}, ${r.state} - ${r.pincode}`;
  document.getElementById("modalReason").textContent = r.reason;

  const docWrap = document.getElementById("modalDocWrap");
  docWrap.innerHTML = r.document
    ? `<div class="preview-wrap"><span class="file-chip"><i class="fa-solid fa-file"></i> ${r.document}</span></div>`
    : "";

  document.getElementById("modalApprovedBy").textContent = r.approvedBy;
  document.getElementById("modalDecisionDate").textContent = formatDate(r.decisionDate);
  document.getElementById("modalDecisionStatus").textContent = r.status;
  document.getElementById("modalRemarks").textContent = r.remarks || "-";

  document.getElementById("modalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLeaveModal() {
  document.getElementById("modalOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

/* ---------- Animated counters ---------- */
function animateCounters() {
  document.querySelectorAll(".stat-number").forEach((el) => {
    const target = parseInt(el.getAttribute("data-target"), 10) || 0;
    let current = 0;
    const duration = 1000;
    const stepTime = Math.max(Math.floor(duration / Math.max(target, 1)), 20);

    const timer = setInterval(() => {
      current += 1;
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, stepTime);
  });
}

/* ---------- Auto-calculate total leave days ---------- */
function updateTotalDays() {
  const from = document.getElementById("fFromDate").value;
  const to = document.getElementById("fToDate").value;
  const totalField = document.getElementById("fTotalDays");
  const days = totalDays(from, to);
  totalField.value = typeof days === "number" ? `${days} day${days > 1 ? "s" : ""}` : "";
}

/* ---------- Form validation + submission ---------- */
function validateField(field, condition) {
  const wrapper = field.closest(".form-field");
  if (condition) {
    wrapper.classList.remove("error");
  } else {
    wrapper.classList.add("error");
  }
  return condition;
}

function resetFormState() {
  document.getElementById("documentPreviewWrap").innerHTML = "";
  document.getElementById("documentUploadLabel").textContent = "Click to upload document";
  document.getElementById("fTotalDays").value = "";
  document.querySelectorAll("#leaveForm .form-field.error").forEach((f) => f.classList.remove("error"));
}

function handleLeaveFormSubmit(e) {
  e.preventDefault();

  const leaveType = document.getElementById("fLeaveType");
  const fromDate = document.getElementById("fFromDate");
  const toDate = document.getElementById("fToDate");
  const departureTime = document.getElementById("fDepartureTime");
  const returnDate = document.getElementById("fReturnDate");
  const returnTime = document.getElementById("fReturnTime");
  const address = document.getElementById("fAddress");
  const city = document.getElementById("fCity");
  const state = document.getElementById("fState");
  const pincode = document.getElementById("fPincode");
  const parentName = document.getElementById("fParentName");
  const parentMobile = document.getElementById("fParentMobile");
  const reason = document.getElementById("fReason");
  const declaration = document.getElementById("fDeclaration");

  const checks = [
    validateField(leaveType, leaveType.value !== ""),
    validateField(fromDate, fromDate.value !== ""),
    validateField(toDate, toDate.value !== "" && toDate.value >= fromDate.value),
    validateField(departureTime, departureTime.value !== ""),
    validateField(returnDate, returnDate.value !== ""),
    validateField(returnTime, returnTime.value !== ""),
    validateField(address, address.value.trim() !== ""),
    validateField(city, city.value.trim() !== ""),
    validateField(state, state.value.trim() !== ""),
    validateField(pincode, /^\d{6}$/.test(pincode.value.trim())),
    validateField(parentName, parentName.value.trim() !== ""),
    validateField(parentMobile, /^[\d+\s-]{7,}$/.test(parentMobile.value.trim())),
    validateField(reason, reason.value.trim().length >= 10),
  ];

  if (!declaration.checked) {
    if (window.showToast) window.showToast("Please accept the declaration to continue");
    declaration.closest(".declaration-field").style.outline = "2px solid #e74c3c";
    setTimeout(() => (declaration.closest(".declaration-field").style.outline = ""), 1600);
    return;
  }

  if (checks.includes(false)) {
    if (window.showToast) window.showToast("Please fix the highlighted fields");
    return;
  }

  const newId = `HL-${2050 + LEAVE_DATA.length}`;
  const docChip = document.querySelector("#documentPreviewWrap .file-chip");

  LEAVE_DATA.unshift({
    id: newId,
    type: leaveType.value,
    from: fromDate.value,
    to: toDate.value,
    appliedDate: new Date().toISOString().slice(0, 10),
    returnDate: returnDate.value,
    status: "Pending",
    remarks: "Awaiting Warden approval.",
    approvedBy: "-",
    decisionDate: "-",
    address: address.value.trim(),
    city: city.value.trim(),
    state: state.value.trim(),
    pincode: pincode.value.trim(),
    parentName: parentName.value.trim(),
    parentMobile: parentMobile.value.trim(),
    reason: reason.value.trim(),
    document: docChip ? docChip.getAttribute("data-filename") : null,
  });

  refreshLeaveTable();
  refreshHistoryTable();
  animateStatUpdate();

  e.target.reset();
  resetFormState();

  if (window.showToast) window.showToast(`Leave request ${newId} submitted successfully`);

  document.getElementById("leaveStatusSection").scrollIntoView({ behavior: "smooth", block: "start" });
}

function animateStatUpdate() {
  document.querySelectorAll(".stat-card").forEach((card) => {
    const label = card.querySelector(".stat-label").textContent;
    if (label === "Total Leave Requests" || label === "Pending Requests") {
      const numEl = card.querySelector(".stat-number");
      numEl.textContent = parseInt(numEl.textContent, 10) + 1;
      card.style.transform = "scale(1.04)";
      setTimeout(() => (card.style.transform = ""), 220);
    }
  });
}

function handleDocumentPreview(inputEl) {
  const file = inputEl.files[0];
  const label = document.getElementById("documentUploadLabel");
  const wrap = document.getElementById("documentPreviewWrap");

  if (!file) {
    label.textContent = "Click to upload document";
    wrap.innerHTML = "";
    return;
  }

  label.textContent = file.name;

  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      wrap.innerHTML = `<img src="${ev.target.result}" alt="Preview of ${file.name}"><div class="file-chip" data-filename="${file.name}"><i class="fa-solid fa-file-image"></i> ${file.name}</div>`;
    };
    reader.readAsDataURL(file);
  } else {
    wrap.innerHTML = `<div class="file-chip" data-filename="${file.name}"><i class="fa-solid fa-file"></i> ${file.name}</div>`;
  }
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  refreshLeaveTable();
  refreshHistoryTable();
  animateCounters();

  // Search + filters (Leave Request Status)
  document.getElementById("globalSearch").addEventListener("input", refreshLeaveTable);
  document.getElementById("filterStatus").addEventListener("change", refreshLeaveTable);
  document.getElementById("filterType").addEventListener("change", refreshLeaveTable);

  // Filters (Leave History)
  document.getElementById("historyDateFilter").addEventListener("change", refreshHistoryTable);
  document.getElementById("historyTypeFilter").addEventListener("change", refreshHistoryTable);
  document.getElementById("historyStatusFilter").addEventListener("change", refreshHistoryTable);

  // Modal
  document.getElementById("modalCloseBtn").addEventListener("click", closeLeaveModal);
  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") closeLeaveModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLeaveModal();
  });

  // Auto-calculate total leave days
  document.getElementById("fFromDate").addEventListener("change", updateTotalDays);
  document.getElementById("fToDate").addEventListener("change", updateTotalDays);

  // Form
  document.getElementById("leaveForm").addEventListener("submit", handleLeaveFormSubmit);
  document.getElementById("resetFormBtn").addEventListener("click", resetFormState);
  document.getElementById("cancelFormBtn").addEventListener("click", () => {
    document.getElementById("leaveForm").reset();
    resetFormState();
    if (window.showToast) window.showToast("Leave application cancelled");
    document.getElementById("homeleave").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.getElementById("fDocument").addEventListener("change", function () {
    handleDocumentPreview(this);
  });

  document.getElementById("emptyStateApplyBtn")?.addEventListener("click", () => {
    document.getElementById("applyLeaveSection").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});


/* ==========================================================================
   app.js
   General app shell behaviour: loader, sidebar, quick actions, toast
   ========================================================================== */

/* ---------- Toast ---------- */
let toastTimer = null;
window.showToast = function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
};

/* ---------- Loader ---------- */
window.addEventListener("load", () => {
  const overlay = document.getElementById("loaderOverlay");
  setTimeout(() => overlay.classList.add("hidden"), 500);
});

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Sidebar collapse / mobile menu ---------- */
  const sidebar = document.getElementById("sidebar");
  const scrim = document.getElementById("sidebarScrim");
  const hamburgerBtn = document.getElementById("hamburgerBtn");

  function openSidebar() {
    sidebar.classList.add("active");
    scrim.classList.add("active");
  }
  function closeSidebar() {
    sidebar.classList.remove("active");
    scrim.classList.remove("active");
  }
  hamburgerBtn.addEventListener("click", () => {
    sidebar.classList.contains("active") ? closeSidebar() : openSidebar();
  });
  scrim.addEventListener("click", closeSidebar);

  // Close mobile sidebar automatically when a link is tapped
  document.querySelectorAll(".sidebar-item a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 992) closeSidebar();
    });
  });

  /* ---------- Quick action buttons: smooth scroll ---------- */
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  document.getElementById("qaApplyLeave").addEventListener("click", () => scrollTo("applyLeaveSection"));
  document.getElementById("qaLeaveStatus").addEventListener("click", () => scrollTo("leaveStatusSection"));
  document.getElementById("qaLeaveHistory").addEventListener("click", () => scrollTo("leaveHistorySection"));
  document.getElementById("qaHostelRules").addEventListener("click", () => scrollTo("hostelRulesSection"));
});


/* ==========================================================================
   notifications.js
   Handles slide-in notification panel content + open/close behaviour
   ========================================================================== */

const NOTIFICATIONS_DATA = [
  {
    id: 1,
    title: "Leave Request Submitted",
    message: "Your leave request HL-2045 (Medical Leave) has been received.",
    time: "1 hour ago",
    unread: true,
    icon: "submitted",
  },
  {
    id: 2,
    title: "Leave Approved",
    message: "Your leave request HL-2041 (Weekend Leave) has been approved.",
    time: "3 days ago",
    unread: true,
    icon: "approved",
  },
  {
    id: 3,
    title: "Leave Rejected",
    message: "HL-2024 (Emergency Leave) was rejected. See admin remarks for details.",
    time: "1 week ago",
    unread: false,
    icon: "rejected",
  },
  {
    id: 4,
    title: "Return Reminder",
    message: "Reminder: your approved leave HL-2038 return date is tomorrow.",
    time: "2 weeks ago",
    unread: false,
    icon: "reminder",
  },
];

const NOTIF_ICONS = {
  submitted:
    '<svg viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
  approved:
    '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  rejected:
    '<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  reminder:
    '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linejoin="round"/></svg>',
};

function renderNotifications() {
  const list = document.getElementById("notifList");
  if (!list) return;

  if (NOTIFICATIONS_DATA.length === 0) {
    list.innerHTML = `<div class="empty-state"><p>You're all caught up!</p></div>`;
    return;
  }

  list.innerHTML = NOTIFICATIONS_DATA.map(
    (n, i) => `
    <div class="notif-item ${n.unread ? "unread" : ""}" style="animation-delay:${i * 60}ms" data-id="${n.id}">
      <span class="notif-icon">${NOTIF_ICONS[n.icon] || ""}</span>
      <div class="notif-content">
        <strong>${n.title}</strong>
        <span>${n.message}</span>
        <span style="display:block;margin-top:4px;opacity:0.7;">${n.time}</span>
      </div>
    </div>`
  ).join("");

  updateNotifCount();
}

function updateNotifCount() {
  const countEl = document.getElementById("notifCount");
  const unreadCount = NOTIFICATIONS_DATA.filter((n) => n.unread).length;
  if (!countEl) return;
  if (unreadCount > 0) {
    countEl.textContent = unreadCount;
    countEl.style.display = "flex";
  } else {
    countEl.style.display = "none";
  }
}

function openNotifPanel() {
  document.getElementById("notifPanel").classList.add("open");
  document.getElementById("notifOverlay").style.display = "block";

  // Mark all as read after a short delay (simulates read receipt)
  setTimeout(() => {
    NOTIFICATIONS_DATA.forEach((n) => (n.unread = false));
    document.querySelectorAll(".notif-item.unread").forEach((el) => el.classList.remove("unread"));
    updateNotifCount();
  }, 900);
}

function closeNotifPanel() {
  document.getElementById("notifPanel").classList.remove("open");
  document.getElementById("notifOverlay").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  renderNotifications();

  document.getElementById("notifBellBtn").addEventListener("click", openNotifPanel);
  document.getElementById("notifCloseBtn").addEventListener("click", closeNotifPanel);
  document.getElementById("notifOverlay").addEventListener("click", closeNotifPanel);

  const sidebarNotifLink = document.getElementById("sidebarNotifLink");
  if (sidebarNotifLink) {
    sidebarNotifLink.addEventListener("click", (e) => {
      e.preventDefault();
      openNotifPanel();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNotifPanel();
  });
});
