/* ==========================================================================
   admin-outpass.js
   Smart Hostel 360 — Admin Outpass Management
   ========================================================================== */

/* ---------- Sample data ---------- */
const AVATAR = (seed) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0056d6&textColor=ffffff`;

let OUTPASS_DATA = [
  {
    id: "OP-1042",
    name: "Aarav Krishnan",
    regNo: "21CS0142",
    dept: "Computer Science",
    year: "3rd Year",
    section: "A",
    room: "B-214",
    block: "Block B - Nandhi",
    mobile: "+91 98765 43210",
    parentName: "Suresh Krishnan",
    parentPhone: "+91 98765 11111",
    purpose: "Home Visit",
    destination: "Coimbatore",
    outDate: "2026-08-01",
    outTime: "09:00",
    returnDate: "2026-08-03",
    returnTime: "18:00",
    reason: "Attending a family function over the weekend.",
    document: null,
    status: "pending",
  },
  {
    id: "OP-1041",
    name: "Meera Suresh",
    regNo: "21EC0087",
    dept: "Electronics & Comm.",
    year: "2nd Year",
    section: "B",
    room: "A-108",
    block: "Block A - Ganga",
    mobile: "+91 98765 43211",
    parentName: "Suresh Kumar",
    parentPhone: "+91 98765 22222",
    purpose: "Medical",
    destination: "Kovai Medical Center",
    outDate: "2026-07-31",
    outTime: "10:30",
    returnDate: "2026-07-31",
    returnTime: "16:00",
    reason: "Follow-up dental appointment.",
    document: "Medical appointment slip",
    status: "approved",
    approvedBy: "Warden R. Nithya",
    approvalDate: "2026-07-31",
    approvalTime: "08:45",
  },
  {
    id: "OP-1040",
    name: "Karthik Raja",
    regNo: "22ME0119",
    dept: "Mechanical",
    year: "1st Year",
    section: "C",
    room: "C-302",
    block: "Block C - Kaveri",
    mobile: "+91 98765 43212",
    parentName: "Raja Mohan",
    parentPhone: "+91 98765 33333",
    purpose: "Personal Work",
    destination: "RS Puram",
    outDate: "2026-07-30",
    outTime: "14:00",
    returnDate: "2026-07-30",
    returnTime: "19:00",
    reason: "Bank work — Aadhaar update.",
    document: null,
    status: "rejected",
    rejectReason: "Insufficient notice period",
    rejectRemarks: "Please submit outpass requests at least 24 hours in advance next time.",
  },
  {
    id: "OP-1039",
    name: "Divya Prakash",
    regNo: "21IT0056",
    dept: "Information Tech.",
    year: "3rd Year",
    section: "A",
    room: "A-215",
    block: "Block A - Ganga",
    mobile: "+91 98765 43213",
    parentName: "Prakash Iyer",
    parentPhone: "+91 98765 44444",
    purpose: "Home Visit",
    destination: "Erode",
    outDate: "2026-07-29",
    outTime: "09:00",
    returnDate: "2026-07-29",
    returnTime: "20:00",
    reason: "Grandmother's birthday celebration.",
    document: null,
    status: "outside",
    approvedBy: "Warden R. Nithya",
    approvalDate: "2026-07-29",
    approvalTime: "08:10",
  },
  {
    id: "OP-1038",
    name: "Rohit Balan",
    regNo: "20CS0033",
    dept: "Computer Science",
    year: "4th Year",
    section: "B",
    room: "B-101",
    block: "Block B - Nandhi",
    mobile: "+91 98765 43214",
    parentName: "Balan Nair",
    parentPhone: "+91 98765 55555",
    purpose: "Interview",
    destination: "Tidel Park, Coimbatore",
    outDate: "2026-08-01",
    outTime: "08:00",
    returnDate: "2026-08-01",
    returnTime: "14:00",
    reason: "Placement interview with a hiring company.",
    document: "Interview call letter",
    status: "outside",
    approvedBy: "Chief Warden S. Bala",
    approvalDate: "2026-08-01",
    approvalTime: "07:30",
  },
  {
    id: "OP-1037",
    name: "Sneha Ramesh",
    regNo: "22EE0071",
    dept: "Electrical",
    year: "1st Year",
    section: "A",
    room: "A-310",
    block: "Block A - Ganga",
    mobile: "+91 98765 43215",
    parentName: "Ramesh Babu",
    parentPhone: "+91 98765 66666",
    purpose: "Shopping",
    destination: "Brookefields Mall",
    outDate: "2026-07-31",
    outTime: "15:00",
    returnDate: "2026-07-31",
    returnTime: "19:00",
    reason: "Buying hostel essentials.",
    document: null,
    status: "returned",
    approvedBy: "Warden R. Nithya",
    approvalDate: "2026-07-31",
    approvalTime: "14:20",
    actualReturnTime: "18:40",
  },
  {
    id: "OP-1036",
    name: "Vignesh Kumar",
    regNo: "21CE0029",
    dept: "Civil",
    year: "3rd Year",
    section: "C",
    room: "C-118",
    block: "Block C - Kaveri",
    mobile: "+91 98765 43216",
    parentName: "Kumar Swamy",
    parentPhone: "+91 98765 77777",
    purpose: "Home Visit",
    destination: "Salem",
    outDate: "2026-07-28",
    outTime: "09:00",
    returnDate: "2026-07-28",
    returnTime: "21:00",
    reason: "Weekend trip home.",
    document: null,
    status: "returned",
    approvedBy: "Chief Warden S. Bala",
    approvalDate: "2026-07-28",
    approvalTime: "08:15",
    actualReturnTime: "20:50",
  },
  {
    id: "OP-1035",
    name: "Priya Dharshini",
    regNo: "22CS0210",
    dept: "Computer Science",
    year: "1st Year",
    section: "D",
    room: "A-402",
    block: "Block A - Ganga",
    mobile: "+91 98765 43217",
    parentName: "Dharshini Rajan",
    parentPhone: "+91 98765 88888",
    purpose: "Personal Work",
    destination: "Gandhipuram",
    outDate: "2026-08-01",
    outTime: "07:00",
    returnDate: "2026-08-01",
    returnTime: "11:00",
    reason: "Passport office visit.",
    document: "Passport appointment confirmation",
    status: "pending",
  },
];

const CURRENT_ADMIN = "Warden R. Nithya";

const STATUS_LABEL = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  outside: "Outside",
  returned: "Returned",
};

const STATUS_CLASS = {
  pending: "status-pending",
  approved: "status-approved",
  rejected: "status-rejected",
  outside: "status-outside",
  returned: "status-returned",
};

let NOTIFICATIONS = [
  { icon: "fa-solid fa-circle-plus", title: "New Outpass Request", text: "Priya Dharshini submitted a new outpass request.", unread: true },
  { icon: "fa-solid fa-triangle-exclamation", title: "Return Overdue", text: "Divya Prakash has not returned by the expected time.", unread: true },
  { icon: "fa-solid fa-circle-check", title: "Student Returned", text: "Sneha Ramesh has returned to the hostel.", unread: false },
];

/* ---------- Helpers ---------- */
function fmtDate(d) {
  if (!d) return "-";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function isOverdue(req) {
  if (req.status !== "outside") return false;
  const expected = new Date(`${req.returnDate}T${req.returnTime}:00`);
  return Date.now() > expected.getTime();
}

function effectiveStatus(req) {
  return isOverdue(req) ? "overdue" : req.status;
}

/* ---------- Stats ---------- */
function computeStats() {
  const today = new Date().toISOString().slice(0, 10);
  return {
    total: OUTPASS_DATA.length,
    pending: OUTPASS_DATA.filter((r) => r.status === "pending").length,
    approved: OUTPASS_DATA.filter((r) => r.status === "approved").length,
    rejected: OUTPASS_DATA.filter((r) => r.status === "rejected").length,
    outside: OUTPASS_DATA.filter((r) => r.status === "outside").length,
    returnedToday: OUTPASS_DATA.filter((r) => r.status === "returned" && r.approvalDate === today).length,
  };
}

function renderStats() {
  const s = computeStats();
  document.querySelector('[data-stat="total"]').setAttribute("data-target", s.total);
  document.querySelector('[data-stat="pending"]').setAttribute("data-target", s.pending);
  document.querySelector('[data-stat="approved"]').setAttribute("data-target", s.approved);
  document.querySelector('[data-stat="rejected"]').setAttribute("data-target", s.rejected);
  document.querySelector('[data-stat="outside"]').setAttribute("data-target", s.outside);
  document.querySelector('[data-stat="returned"]').setAttribute("data-target", s.returnedToday);
}

function animateCounters() {
  document.querySelectorAll(".stat-number").forEach((el) => {
    const target = parseInt(el.getAttribute("data-target"), 10) || 0;
    let current = 0;
    const duration = 900;
    const stepTime = Math.max(Math.floor(duration / Math.max(target, 1)), 20);
    const timer = setInterval(() => {
      current += 1;
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, stepTime);
  });
}

/* ---------- Filters ---------- */
function getFilterValues() {
  return {
    search: document.getElementById("searchName").value.trim().toLowerCase(),
    regNo: document.getElementById("searchReg").value.trim().toLowerCase(),
    dept: document.getElementById("filterDept").value,
    year: document.getElementById("filterYear").value,
    block: document.getElementById("filterBlock").value,
    status: document.getElementById("filterStatus").value,
    date: document.getElementById("filterDate").value,
  };
}

function getFilteredRequests() {
  const f = getFilterValues();
  return OUTPASS_DATA.filter((r) => {
    const matchesSearch = !f.search || r.name.toLowerCase().includes(f.search);
    const matchesReg = !f.regNo || r.regNo.toLowerCase().includes(f.regNo);
    const matchesDept = !f.dept || r.dept === f.dept;
    const matchesYear = !f.year || r.year === f.year;
    const matchesBlock = !f.block || r.block === f.block;
    const matchesStatus = !f.status || effectiveStatus(r) === f.status;
    const matchesDate = !f.date || r.outDate === f.date;
    return matchesSearch && matchesReg && matchesDept && matchesYear && matchesBlock && matchesStatus && matchesDate;
  });
}

function resetFilters() {
  document.getElementById("searchName").value = "";
  document.getElementById("searchReg").value = "";
  document.getElementById("filterDept").value = "";
  document.getElementById("filterYear").value = "";
  document.getElementById("filterBlock").value = "";
  document.getElementById("filterStatus").value = "";
  document.getElementById("filterDate").value = "";
  refreshAll();
}

/* ---------- Table renderers ---------- */
function statusBadge(req) {
  const eff = effectiveStatus(req);
  const label = eff === "overdue" ? "Overdue" : STATUS_LABEL[req.status];
  const cls = eff === "overdue" ? "status-overdue" : STATUS_CLASS[req.status];
  return `<span class="badge ${cls}">${label}</span>`;
}

function rowActionsFor(req) {
  if (req.status === "pending") {
    return `
      <button class="action-btn ghost-btn" onclick="openOutpassModal('${req.id}')"><i class="fa-solid fa-eye"></i> View</button>
      <button class="action-btn approve-btn" onclick="quickApprove('${req.id}')"><i class="fa-solid fa-check"></i> Approve</button>
      <button class="action-btn reject-btn" onclick="openOutpassModal('${req.id}', true)"><i class="fa-solid fa-xmark"></i> Reject</button>
    `;
  }
  if (req.status === "outside") {
    return `
      <button class="action-btn ghost-btn" onclick="openOutpassModal('${req.id}')"><i class="fa-solid fa-eye"></i> View</button>
      <button class="action-btn" onclick="markReturned('${req.id}')"><i class="fa-solid fa-door-open"></i> Mark Returned</button>
    `;
  }
  return `<button class="action-btn ghost-btn" onclick="openOutpassModal('${req.id}')"><i class="fa-solid fa-eye"></i> View</button>`;
}

function renderRequestsTable() {
  const rows = getFilteredRequests();
  const tbody = document.getElementById("requestsTableBody");
  const emptyState = document.getElementById("requestsEmptyState");
  const wrap = document.getElementById("requestsTableWrap");

  if (rows.length === 0) {
    wrap.style.display = "none";
    emptyState.style.display = "block";
    return;
  }
  wrap.style.display = "block";
  emptyState.style.display = "none";

  tbody.innerHTML = rows
    .map(
      (r) => `
    <tr class="${isOverdue(r) ? "overdue-row" : ""}">
      <td>${r.id}</td>
      <td><img class="student-photo" src="${AVATAR(r.name)}" alt="${r.name}"></td>
      <td class="name-cell"><strong>${r.name}</strong><span>${r.section} Section</span></td>
      <td>${r.regNo}</td>
      <td>${r.dept}</td>
      <td>${r.year}</td>
      <td>${r.room}</td>
      <td>${r.block}</td>
      <td>${r.purpose}</td>
      <td>${r.destination}</td>
      <td>${fmtDate(r.outDate)}</td>
      <td>${fmtDate(r.returnDate)}</td>
      <td>${statusBadge(r)}</td>
      <td><div class="row-actions">${rowActionsFor(r)}</div></td>
    </tr>
  `
    )
    .join("");
}

function renderOutsideTable() {
  const rows = OUTPASS_DATA.filter((r) => r.status === "outside");
  const tbody = document.getElementById("outsideTableBody");
  const emptyState = document.getElementById("outsideEmptyState");
  const wrap = document.getElementById("outsideTableWrap");

  if (rows.length === 0) {
    wrap.style.display = "none";
    emptyState.style.display = "block";
    return;
  }
  wrap.style.display = "block";
  emptyState.style.display = "none";

  tbody.innerHTML = rows
    .map((r) => {
      const overdue = isOverdue(r);
      return `
      <tr class="${overdue ? "overdue-row" : ""}">
        <td class="name-cell"><strong>${r.name}</strong><span>${r.regNo}</span></td>
        <td>${r.dept}</td>
        <td>${r.room}</td>
        <td>${r.outTime}</td>
        <td>${r.returnTime} <span style="color:#999;font-size:11px;">(${fmtDate(r.returnDate)})</span></td>
        <td><span class="badge ${overdue ? "status-overdue" : "status-outside"}">${overdue ? "Overdue" : "Outside"}</span></td>
        <td><button class="action-btn" onclick="markReturned('${r.id}')"><i class="fa-solid fa-door-open"></i> Mark Returned</button></td>
      </tr>
    `;
    })
    .join("");
}

function renderHistoryTable() {
  const search = document.getElementById("historySearch").value.trim().toLowerCase();
  const status = document.getElementById("historyStatusFilter").value;

  const rows = OUTPASS_DATA.filter((r) => ["approved", "rejected", "returned"].includes(r.status))
    .filter((r) => !search || r.name.toLowerCase().includes(search) || r.id.toLowerCase().includes(search))
    .filter((r) => !status || r.status === status);

  const tbody = document.getElementById("historyTableBody");
  const emptyState = document.getElementById("historyEmptyState");
  const wrap = document.getElementById("historyTableWrap");

  if (rows.length === 0) {
    wrap.style.display = "none";
    emptyState.style.display = "block";
    return;
  }
  wrap.style.display = "block";
  emptyState.style.display = "none";

  tbody.innerHTML = rows
    .map((r) => {
      const remarks = r.status === "rejected" ? r.rejectRemarks || "-" : "-";
      const approvedBy = r.approvedBy || "-";
      const returnTime = r.actualReturnTime ? `${r.actualReturnTime} (${fmtDate(r.returnDate)})` : "-";
      return `
      <tr>
        <td class="name-cell"><strong>${r.name}</strong><span>${r.regNo}</span></td>
        <td>${fmtDate(r.outDate)}</td>
        <td>${r.purpose}</td>
        <td>${statusBadge(r)}</td>
        <td>${approvedBy}</td>
        <td>${returnTime}</td>
        <td>${remarks}</td>
      </tr>
    `;
    })
    .join("");
}

function refreshAll() {
  renderStats();
  renderRequestsTable();
  renderOutsideTable();
  renderHistoryTable();
}

/* ---------- Modal ---------- */
let activeRequestId = null;

function buildTimelineMeta(req) {
  if (req.status === "rejected") {
    return `<div class="reject-meta"><strong>Rejected</strong><br>Reason: ${req.rejectReason || "-"}<br>Remarks: ${req.rejectRemarks || "-"}</div>`;
  }
  if (["approved", "outside", "returned"].includes(req.status)) {
    const bits = [`Approved by <strong>${req.approvedBy || "-"}</strong>`];
    if (req.approvalDate) bits.push(`on ${fmtDate(req.approvalDate)} at ${req.approvalTime || "-"}`);
    if (req.status === "returned" && req.actualReturnTime) bits.push(`· Returned at ${req.actualReturnTime}`);
    return `<div class="approval-meta">${bits.join(" ")}</div>`;
  }
  return "";
}

function modalActionsFor(req) {
  if (req.status === "pending") {
    return `
      <button class="btn-approve" onclick="quickApprove('${req.id}')"><i class="fa-solid fa-check"></i> Approve</button>
      <button class="btn-reject" onclick="toggleRejectForm(true)"><i class="fa-solid fa-xmark"></i> Reject</button>
      <button class="btn-pending" onclick="keepPending('${req.id}')"><i class="fa-solid fa-hourglass-half"></i> Keep Pending</button>
    `;
  }
  if (req.status === "outside") {
    return `<button class="btn-return" onclick="markReturned('${req.id}'); closeOutpassModal();"><i class="fa-solid fa-door-open"></i> Mark Returned</button>`;
  }
  return "";
}

function openOutpassModal(id, jumpToReject) {
  const req = OUTPASS_DATA.find((r) => r.id === id);
  if (!req) return;
  activeRequestId = id;

  document.getElementById("modalRequestId").textContent = req.id;
  document.getElementById("modalStudentPhoto").src = AVATAR(req.name);
  document.getElementById("modalStudentName").textContent = req.name;
  document.getElementById("modalStudentMeta").textContent = `${req.regNo} · ${req.dept}`;
  document.getElementById("modalStatusBadge").innerHTML = statusBadge(req);

  document.getElementById("modalYear").textContent = req.year;
  document.getElementById("modalSection").textContent = req.section;
  document.getElementById("modalBlock").textContent = req.block;
  document.getElementById("modalRoom").textContent = req.room;
  document.getElementById("modalMobile").textContent = req.mobile;
  document.getElementById("modalParentName").textContent = req.parentName;
  document.getElementById("modalParentPhone").textContent = req.parentPhone;

  document.getElementById("modalPurpose").textContent = req.purpose;
  document.getElementById("modalDestination").textContent = req.destination;
  document.getElementById("modalOutDateTime").textContent = `${fmtDate(req.outDate)}, ${req.outTime}`;
  document.getElementById("modalReturnDateTime").textContent = `${fmtDate(req.returnDate)}, ${req.returnTime}`;
  document.getElementById("modalReason").textContent = req.reason || "-";

  const docWrap = document.getElementById("modalDocWrap");
  docWrap.innerHTML = req.document
    ? `<div class="modal-doc-link"><i class="fa-solid fa-paperclip"></i> ${req.document}</div>`
    : `<span style="color:#999;font-size:13px;">No document uploaded</span>`;

  document.getElementById("modalMeta").innerHTML = buildTimelineMeta(req);
  document.getElementById("modalActions").innerHTML = modalActionsFor(req);
  toggleRejectForm(false);

  document.getElementById("modalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";

  if (jumpToReject) toggleRejectForm(true);
}

function closeOutpassModal() {
  document.getElementById("modalOverlay").classList.remove("open");
  document.body.style.overflow = "";
  activeRequestId = null;
}

function toggleRejectForm(show) {
  const form = document.getElementById("rejectForm");
  form.classList.toggle("open", !!show);
  if (show) {
    document.getElementById("rejectReasonSelect").value = "";
    document.getElementById("rejectRemarksInput").value = "";
  }
}

/* ---------- Admin actions ---------- */
function notify(icon, title, text) {
  NOTIFICATIONS.unshift({ icon, title, text, unread: true });
  renderNotifications();
}

function quickApprove(id) {
  const req = OUTPASS_DATA.find((r) => r.id === id);
  if (!req) return;
  const now = new Date();
  req.status = "approved";
  req.approvedBy = CURRENT_ADMIN;
  req.approvalDate = now.toISOString().slice(0, 10);
  req.approvalTime = now.toTimeString().slice(0, 5);

  refreshAll();
  showToast(`${req.name}'s outpass has been approved`);
  notify("fa-solid fa-circle-check", "Outpass Approved", `${req.name}'s outpass request was approved.`);

  if (document.getElementById("modalOverlay").classList.contains("open") && activeRequestId === id) {
    closeOutpassModal();
  }
}

function keepPending(id) {
  showToast("Request kept pending for further verification");
  closeOutpassModal();
}

function confirmReject() {
  const req = OUTPASS_DATA.find((r) => r.id === activeRequestId);
  if (!req) return;
  const reason = document.getElementById("rejectReasonSelect").value;
  const remarks = document.getElementById("rejectRemarksInput").value.trim();

  if (!reason) {
    document.getElementById("rejectReasonSelect").style.borderColor = "#e74c3c";
    if (window.showToast) showToast("Please select a rejection reason");
    return;
  }

  req.status = "rejected";
  req.rejectReason = reason;
  req.rejectRemarks = remarks || "No additional remarks.";

  refreshAll();
  showToast(`${req.name}'s outpass has been rejected`);
  notify("fa-solid fa-circle-xmark", "Outpass Rejected", `${req.name}'s outpass request was rejected.`);
  closeOutpassModal();
}

function markReturned(id) {
  const req = OUTPASS_DATA.find((r) => r.id === id);
  if (!req) return;
  const now = new Date();
  req.status = "returned";
  req.actualReturnTime = now.toTimeString().slice(0, 5);

  refreshAll();
  showToast(`${req.name} has been marked as returned`);
  notify("fa-solid fa-door-open", "Student Returned", `${req.name} has returned to the hostel.`);
}

/* ---------- Notifications panel ---------- */
function renderNotifications() {
  const list = document.getElementById("notifList");
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;
  document.getElementById("notifCount").textContent = unreadCount;
  document.getElementById("notifCount").style.display = unreadCount ? "flex" : "none";

  list.innerHTML = NOTIFICATIONS.map(
    (n) => `
    <div class="notif-item ${n.unread ? "unread" : ""}">
      <div class="notif-icon"><i class="${n.icon}"></i></div>
      <div class="notif-content">
        <strong>${n.title}</strong>
        <span style="color:#333;font-size:12.5px;">${n.text}</span>
      </div>
    </div>
  `
  ).join("");
}

function openNotifPanel() {
  document.getElementById("notifOverlay").classList.add("open");
  document.getElementById("notifPanel").classList.add("open");
  NOTIFICATIONS.forEach((n) => (n.unread = false));
  setTimeout(renderNotifications, 400);
}

function closeNotifPanel() {
  document.getElementById("notifOverlay").classList.remove("open");
  document.getElementById("notifPanel").classList.remove("open");
}

/* ---------- Toast ---------- */
let toastTimer = null;
window.showToast = function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
};

/* ---------- Reports / Export ---------- */
function buildReportRows(scope) {
  const today = new Date().toISOString().slice(0, 10);
  let rows = OUTPASS_DATA;
  if (scope === "daily") rows = rows.filter((r) => r.outDate === today);
  if (scope === "department") rows = [...rows].sort((a, b) => a.dept.localeCompare(b.dept));
  if (scope === "student") rows = [...rows].sort((a, b) => a.name.localeCompare(b.name));
  return rows;
}

function toCSV(rows) {
  const header = ["Request ID", "Name", "Reg No", "Department", "Year", "Room", "Block", "Purpose", "Destination", "Out Date", "Return Date", "Status"];
  const lines = rows.map((r) =>
    [r.id, r.name, r.regNo, r.dept, r.year, r.room, r.block, r.purpose, r.destination, r.outDate, r.returnDate, STATUS_LABEL[r.status]]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header.join(","), ...lines].join("\n");
}

function downloadBlob(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function exportCSV(scope) {
  const rows = buildReportRows(scope || "all");
  downloadBlob(toCSV(rows), `outpass-report-${scope || "all"}.csv`, "text/csv");
  showToast("CSV report downloaded");
}

function exportPDF() {
  showToast("Preparing PDF report…");
  window.print();
}

function exportExcel(scope) {
  const rows = buildReportRows(scope || "all");
  downloadBlob(toCSV(rows), `outpass-report-${scope || "all"}.xls`, "application/vnd.ms-excel");
  showToast("Excel report downloaded");
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderNotifications();
  refreshAll();
  animateCounters();

  [
    "searchName",
    "searchReg",
    "filterDept",
    "filterYear",
    "filterBlock",
    "filterStatus",
    "filterDate",
  ].forEach((id) => {
    const el = document.getElementById(id);
    el.addEventListener(el.tagName === "SELECT" ? "change" : "input", renderRequestsTable);
  });

  document.getElementById("resetFiltersBtn").addEventListener("click", resetFilters);

  document.getElementById("historySearch").addEventListener("input", renderHistoryTable);
  document.getElementById("historyStatusFilter").addEventListener("change", renderHistoryTable);

  // Modal
  document.getElementById("modalCloseBtn").addEventListener("click", closeOutpassModal);
  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") closeOutpassModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeOutpassModal();
      closeNotifPanel();
    }
  });

  document.getElementById("confirmRejectBtn").addEventListener("click", confirmReject);
  document.getElementById("cancelRejectBtn").addEventListener("click", () => toggleRejectForm(false));

  // Notifications
  document.getElementById("notifBellBtn").addEventListener("click", openNotifPanel);
  document.getElementById("notifCloseBtn").addEventListener("click", closeNotifPanel);
  document.getElementById("notifOverlay").addEventListener("click", closeNotifPanel);

  // Export buttons
  document.getElementById("exportCsvBtn").addEventListener("click", () => exportCSV("all"));
  document.getElementById("exportPdfBtn").addEventListener("click", exportPDF);
  document.getElementById("exportExcelBtn").addEventListener("click", () => exportExcel("all"));

  document.querySelectorAll(".report-card").forEach((card) => {
    card.addEventListener("click", () => {
      const scope = card.getAttribute("data-scope");
      exportCSV(scope);
    });
  });

  // Overdue re-check every 30s so rows flip to "Overdue" live
  setInterval(() => {
    renderRequestsTable();
    renderOutsideTable();
  }, 30000);

  // Sidebar mobile toggle
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
  document.getElementById("sidebarCloseBtn").addEventListener("click", closeSidebar);
});

/* ---------- Loader ---------- */
window.addEventListener("load", () => {
  const overlay = document.getElementById("loaderOverlay");
  setTimeout(() => overlay.classList.add("hidden"), 500);
});
