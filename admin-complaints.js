/* ==========================================================================
   Smart Hostel 360 — Admin Complaint Management
   Dummy-data driven admin dashboard logic
   ========================================================================== */

const $ = (id) => document.getElementById(id);

function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomFrom(arr) { return arr[randomInt(0, arr.length - 1)]; }

function formatDate(d) {
  if (!d) return "-";
  const date = (d instanceof Date) ? d : new Date(d);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDateTime(d) {
  if (!d) return "-";
  const date = (d instanceof Date) ? d : new Date(d);
  let h = date.getHours(), m = date.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  m = m < 10 ? "0" + m : m;
  return `${formatDate(date)}, ${h}:${m} ${ampm}`;
}

function toISODate(d) {
  const date = (d instanceof Date) ? d : new Date(d);
  return date.toISOString().slice(0, 10);
}

/* ---------------------------------------------------------------
   DUMMY DATA GENERATION
---------------------------------------------------------------- */

const NOW = new Date();

const FIRST_NAMES = ["Aarav","Vikram","Rahul","Arjun","Karthik","Suresh","Naveen","Praveen","Dinesh","Manoj",
  "Ajay","Vishal","Sanjay","Rohit","Kiran","Aditya","Yogesh","Ganesh","Bharath","Deepak",
  "Priya","Sneha","Divya","Kavya","Meera","Anjali","Pooja","Swathi","Lakshmi","Nisha"];

const LAST_NAMES = ["Krishnan","Nair","Menon","Kumar","Raj","Pillai","Iyer","Reddy","Sharma","Varma"];

const DEPT_CODES = ["CS","EC","ME","CE","IT","EEE"];

const BLOCKS = ["Block A - Shiva","Block B - Nandhi","Block C - Ganga","Block D - Saraswati"];

const CATEGORIES = ["Electrical","Bathroom","Furniture","Plumbing","Cleaning","Internet",
  "Mess Food","Security","Water Supply","Pest Control","Other"];

const CATEGORY_TITLES = {
  "Electrical": ["Frequent power fluctuation in room","Ceiling fan not working","Room light flickering","Switch board sparking"],
  "Bathroom": ["Bathroom tap leaking continuously","Clogged bathroom drain","Broken bathroom door lock","Shower not working"],
  "Furniture": ["Broken study table","Wardrobe door hinge broken","Bed frame damaged","Chair leg broken"],
  "Plumbing": ["Water pipe leakage in washroom","Low water pressure in tap","Sink drain blocked","Geyser not heating water"],
  "Cleaning": ["Corridor not cleaned regularly","Garbage not collected","Washroom cleanliness issue","Room not cleaned after request"],
  "Internet": ["Wi-Fi not working in room","Slow internet speed","LAN port not functioning","Frequent Wi-Fi disconnection"],
  "Mess Food": ["Food quality complaint","Unhygienic food served","Mess timing issue","Insufficient food quantity"],
  "Security": ["Main gate security lapse","CCTV not working in corridor","Unauthorized visitor entry","Missing item from room"],
  "Water Supply": ["No water supply in block","Irregular water timing","Contaminated water supply","Low water pressure"],
  "Pest Control": ["Cockroach infestation in room","Mosquito menace in block","Rodent problem in mess","Bed bugs in mattress"],
  "Other": ["General maintenance request","Noise disturbance complaint","AC not cooling properly","Request for room change"]
};

const STAFF_LIST = ["Warden - Mr. Suresh Nair","Warden - Mrs. Latha Menon","Electrician - Mr. Ravi Kumar",
  "Electrician - Mr. Anand Babu","Plumber - Mr. Joseph Mathew","Plumber - Mr. Selvam Raj",
  "Carpenter - Mr. Dinesh Kumar","Housekeeping - Mrs. Meena Devi","Security - Mr. Arun Prakash","IT Support - Mr. Vignesh S"];

const STATUS_ORDER = ["Pending","Assigned","In Progress","Waiting for Student","Resolved","Closed"];

const STATUS_WEIGHTED = ["Pending","Pending","Pending","Pending",
  "Assigned","Assigned","Assigned",
  "In Progress","In Progress","In Progress","In Progress",
  "Waiting for Student",
  "Resolved","Resolved","Resolved","Resolved","Resolved",
  "Closed","Closed","Closed","Closed","Closed","Closed",
  "Reopened"];

const PRIORITY_WEIGHTED = ["Low","Low","Low","Medium","Medium","Medium","Medium","Medium","High","High"];

function stepNote(label) {
  const notes = {
    "Pending": "Complaint received and logged",
    "Assigned": "Staff member assigned to the issue",
    "In Progress": "Work has started on the complaint",
    "Waiting for Student": "Awaiting confirmation from student",
    "Resolved": "Issue has been resolved by staff",
    "Closed": "Complaint closed by admin",
    "Reopened": "Student reported the issue persists"
  };
  return notes[label] || "";
}

function buildTimeline(status, dateSubmitted, lastUpdated) {
  const idx = status === "Reopened" ? STATUS_ORDER.length - 1 : Math.max(0, STATUS_ORDER.indexOf(status));
  const totalMs = Math.max(0, lastUpdated.getTime() - dateSubmitted.getTime());
  const steps = [];
  for (let i = 0; i <= idx; i++) {
    const t = idx === 0 ? dateSubmitted : new Date(dateSubmitted.getTime() + (totalMs * (i / idx)));
    steps.push({ label: STATUS_ORDER[i], date: t, note: stepNote(STATUS_ORDER[i]) });
  }
  if (status === "Reopened") {
    steps.push({ label: "Reopened", date: lastUpdated, note: stepNote("Reopened") });
  }
  return steps;
}

function generateComplaints(count) {
  const list = [];
  for (let i = 0; i < count; i++) {
    const id = "HC-" + (1000 + i);
    const first = randomFrom(FIRST_NAMES);
    const last = randomFrom(LAST_NAMES);
    const studentName = `${first} ${last}`;
    const dept = randomFrom(DEPT_CODES);
    const regNo = `2${randomInt(0,3)}${dept}0${randomInt(100,999)}`;
    const block = randomFrom(BLOCKS);
    const blockLetter = block.charAt(6);
    const room = `${blockLetter}-${randomInt(100,320)}`;
    const category = randomFrom(CATEGORIES);
    const title = randomFrom(CATEGORY_TITLES[category]);
    const priority = randomFrom(PRIORITY_WEIGHTED);
    let status = randomFrom(STATUS_WEIGHTED);

    // ensure a couple of "today" complaints for the Today stat
    const daysAgo = i < 2 ? 0 : randomInt(0, 29);
    const dateSubmitted = new Date(NOW);
    dateSubmitted.setDate(NOW.getDate() - daysAgo);
    dateSubmitted.setHours(randomInt(7,22), randomInt(0,59), 0, 0);

    if (daysAgo === 0 && status !== "Pending" && Math.random() < 0.6) status = "Pending";

    let lastUpdated;
    if (status === "Pending") {
      lastUpdated = dateSubmitted;
    } else {
      const maxUpdateDaysAgo = Math.max(0, daysAgo - 1);
      const updateDaysAgo = randomInt(0, maxUpdateDaysAgo);
      lastUpdated = new Date(NOW);
      lastUpdated.setDate(NOW.getDate() - updateDaysAgo);
      lastUpdated.setHours(randomInt(7,22), randomInt(0,59), 0, 0);
      if (lastUpdated < dateSubmitted) lastUpdated = new Date(dateSubmitted.getTime() + 3600000);
    }

    const expectedCompletion = new Date(dateSubmitted.getTime() + randomInt(2,6) * 86400000);

    const assignedStaff = status === "Pending" ? "Not Assigned" : randomFrom(STAFF_LIST);

    const hasImage = Math.random() < 0.5;

    const adminNotesPool = ["Contacted student for more details.","Parts ordered, ETA 2 days.",
      "Verified issue on-site, awaiting spare part.","Follow-up scheduled with block warden.","-"];
    const adminNotes = status === "Pending" ? "-" : randomFrom(adminNotesPool);

    const description = `${title}. This issue has been affecting the student's daily routine and requires prompt attention from the maintenance team. Reported by resident of ${block}, room ${room}.`;

    list.push({
      id, studentName, regNo, room, block, category, title, description,
      priority, status, assignedStaff, dateSubmitted, lastUpdated, expectedCompletion,
      adminNotes, hasImage,
      timeline: buildTimeline(status, dateSubmitted, lastUpdated)
    });
  }
  return list;
}

let complaints = generateComplaints(30);
let filteredComplaints = complaints.slice();
let currentPage = 1;
const PAGE_SIZE = 10;
let sortField = "dateSubmitted";
let sortDir = -1;

let activityFeed = [
  { icon: "fa-user-plus", color: "#7c3aed", title: "Complaint Assigned", detail: "HC-1004 assigned to Electrician - Mr. Ravi Kumar", time: "10 min ago" },
  { icon: "fa-pen", color: "#00b894", title: "Complaint Updated", detail: "HC-1011 marked as In Progress", time: "45 min ago" },
  { icon: "fa-box-archive", color: "#636e72", title: "Complaint Closed", detail: "HC-1002 closed after student confirmation", time: "1 hour ago" },
  { icon: "fa-circle-plus", color: "#0056d6", title: "New Complaint Received", detail: "HC-1029 raised by a student in Block C - Ganga", time: "2 hours ago" },
  { icon: "fa-triangle-exclamation", color: "#e74c3c", title: "Complaint Escalated", detail: "HC-1017 reopened by student", time: "3 hours ago" },
  { icon: "fa-user-plus", color: "#7c3aed", title: "Complaint Assigned", detail: "HC-1008 assigned to Plumber - Mr. Joseph Mathew", time: "5 hours ago" },
  { icon: "fa-pen", color: "#00b894", title: "Complaint Updated", detail: "HC-1021 status changed to Waiting for Student", time: "Yesterday" },
  { icon: "fa-box-archive", color: "#636e72", title: "Complaint Closed", detail: "HC-1009 closed and archived", time: "Yesterday" }
];

/* ---------------------------------------------------------------
   BADGE / CLASS HELPERS
---------------------------------------------------------------- */

function priorityClass(p) {
  return p === "Low" ? "priority-low" : p === "High" ? "priority-high" : "priority-medium";
}

function statusClass(s) {
  const map = {
    "Pending": "status-pending",
    "Assigned": "status-assigned",
    "In Progress": "status-inprogress",
    "Waiting for Student": "status-waiting",
    "Resolved": "status-completed",
    "Closed": "status-closed",
    "Reopened": "status-reopened"
  };
  return map[s] || "status-pending";
}

/* ---------------------------------------------------------------
   STATS
---------------------------------------------------------------- */

function computeStats() {
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "Pending").length;
  const assigned = complaints.filter(c => c.status === "Assigned").length;
  const inProgress = complaints.filter(c => c.status === "In Progress").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;
  const closed = complaints.filter(c => c.status === "Closed").length;
  const highPriority = complaints.filter(c => c.priority === "High").length;
  const todayStr = toISODate(NOW);
  const today = complaints.filter(c => toISODate(c.dateSubmitted) === todayStr).length;

  $("statTotal").setAttribute("data-target", total);
  $("statPending").setAttribute("data-target", pending);
  $("statAssigned").setAttribute("data-target", assigned);
  $("statProgress").setAttribute("data-target", inProgress);
  $("statResolved").setAttribute("data-target", resolved);
  $("statClosed").setAttribute("data-target", closed);
  $("statHighPriority").setAttribute("data-target", highPriority);
  $("statToday").setAttribute("data-target", today);
}

function animateCounters() {
  document.querySelectorAll(".stat-number").forEach((el) => {
    const target = parseInt(el.getAttribute("data-target") || "0", 10);
    const duration = 900;
    const start = performance.now();
    function step(now) {
      const progress = Math.min(1, (now - start) / duration);
      const value = Math.floor(progress * target);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  });
}

/* ---------------------------------------------------------------
   FILTERING / SORTING / PAGINATION
---------------------------------------------------------------- */

function populateStaffFilter() {
  const select = $("filterStaff");
  const staffNames = [...new Set(complaints.filter(c => c.assignedStaff !== "Not Assigned").map(c => c.assignedStaff))].sort();
  staffNames.forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });
}

function getFilteredComplaints() {
  const searchComplaint = $("searchComplaint").value.trim().toLowerCase();
  const searchStudent = $("searchStudent").value.trim().toLowerCase();
  const statusVal = $("filterStatus").value;
  const priorityVal = $("filterPriority").value;
  const categoryVal = $("filterCategory").value;
  const blockVal = $("filterBlock").value;
  const staffVal = $("filterStaff").value;
  const dateFrom = $("filterDateFrom").value;
  const dateTo = $("filterDateTo").value;

  return complaints.filter((c) => {
    if (searchComplaint && !(c.id.toLowerCase().includes(searchComplaint) || c.title.toLowerCase().includes(searchComplaint))) return false;
    if (searchStudent && !c.studentName.toLowerCase().includes(searchStudent)) return false;
    if (statusVal && c.status !== statusVal) return false;
    if (priorityVal && c.priority !== priorityVal) return false;
    if (categoryVal && c.category !== categoryVal) return false;
    if (blockVal && c.block !== blockVal) return false;
    if (staffVal && c.assignedStaff !== staffVal) return false;
    const submittedISO = toISODate(c.dateSubmitted);
    if (dateFrom && submittedISO < dateFrom) return false;
    if (dateTo && submittedISO > dateTo) return false;
    return true;
  });
}

function sortComplaints(list) {
  if (!sortField) return list;
  return list.slice().sort((a, b) => {
    let av = a[sortField], bv = b[sortField];
    if (av instanceof Date) { av = av.getTime(); bv = bv.getTime(); }
    else if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
    if (av < bv) return -1 * sortDir;
    if (av > bv) return 1 * sortDir;
    return 0;
  });
}

function refresh(resetPage) {
  filteredComplaints = sortComplaints(getFilteredComplaints());
  if (resetPage) currentPage = 1;
  const totalPages = Math.max(1, Math.ceil(filteredComplaints.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;
  renderTablePage();
  renderPagination();
  computeStats();
  animateCounters();
  renderCharts();
}

function renderTablePage() {
  const tbody = $("complaintsTbody");
  const emptyState = $("emptyState");
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filteredComplaints.slice(start, start + PAGE_SIZE);

  if (pageItems.length === 0) {
    tbody.innerHTML = "";
    emptyState.hidden = false;
    $("paginationWrap").style.display = "none";
    return;
  }
  emptyState.hidden = true;
  $("paginationWrap").style.display = "flex";

  tbody.innerHTML = pageItems.map((c) => `
    <tr>
      <td>${c.id}</td>
      <td>${c.studentName}</td>
      <td>${c.regNo}</td>
      <td>${c.room}</td>
      <td>${c.block}</td>
      <td>${c.category}</td>
      <td>${c.title}</td>
      <td><span class="badge ${priorityClass(c.priority)}">${c.priority}</span></td>
      <td>${c.assignedStaff}</td>
      <td><span class="badge ${statusClass(c.status)}">${c.status}</span></td>
      <td>${formatDate(c.dateSubmitted)}</td>
      <td>${formatDate(c.lastUpdated)}</td>
      <td>
        <button class="icon-btn view" data-id="${c.id}" title="View"><i class="fa-solid fa-eye"></i></button>
        <button class="icon-btn assign" data-id="${c.id}" title="Assign"><i class="fa-solid fa-user-plus"></i></button>
        <button class="icon-btn status" data-id="${c.id}" title="Update Status"><i class="fa-solid fa-arrows-rotate"></i></button>
        <button class="icon-btn edit" data-id="${c.id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
        <button class="icon-btn delete" data-id="${c.id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `).join("");
}

function renderPagination() {
  const total = filteredComplaints.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(total, currentPage * PAGE_SIZE);
  $("paginationInfo").textContent = `Showing ${start}-${end} of ${total} complaints`;

  const controls = $("paginationControls");
  let html = `<button class="page-btn" id="prevPageBtn" ${currentPage === 1 ? "disabled" : ""}><i class="fa-solid fa-chevron-left"></i></button>`;

  let pages = [];
  const windowSize = 2;
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= currentPage - windowSize && p <= currentPage + windowSize)) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }
  pages.forEach((p) => {
    if (p === "...") html += `<span class="page-btn" style="border:none;cursor:default;">…</span>`;
    else html += `<button class="page-btn ${p === currentPage ? "active" : ""}" data-page="${p}">${p}</button>`;
  });

  html += `<button class="page-btn" id="nextPageBtn" ${currentPage === totalPages ? "disabled" : ""}><i class="fa-solid fa-chevron-right"></i></button>`;
  controls.innerHTML = html;

  $("prevPageBtn").addEventListener("click", () => { if (currentPage > 1) { currentPage--; renderTablePage(); renderPagination(); } });
  $("nextPageBtn").addEventListener("click", () => { if (currentPage < totalPages) { currentPage++; renderTablePage(); renderPagination(); } });
  controls.querySelectorAll("[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => { currentPage = parseInt(btn.getAttribute("data-page"), 10); renderTablePage(); renderPagination(); });
  });
}

/* ---------------------------------------------------------------
   CHARTS
---------------------------------------------------------------- */

let monthlyChartInst, categoryChartInst, priorityChartInst, resolutionChartInst, workloadChartInst;

function renderCharts() {
  const palette = ["#0056d6","#00b894","#f39c12","#e74c3c","#7c3aed","#0984e3","#00b8a9","#636e72","#2d7eff","#c2540c","#009966"];

  // Monthly Complaints (last 6 months)
  const monthLabels = [];
  const monthCounts = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(NOW.getFullYear(), NOW.getMonth() - i, 1);
    const label = d.toLocaleString("default", { month: "short" });
    monthLabels.push(label);
    const count = complaints.filter(c => c.dateSubmitted.getFullYear() === d.getFullYear() && c.dateSubmitted.getMonth() === d.getMonth()).length;
    monthCounts.push(count);
  }
  if (monthlyChartInst) monthlyChartInst.destroy();
  monthlyChartInst = new Chart($("monthlyChart"), {
    type: "line",
    data: { labels: monthLabels, datasets: [{ label: "Complaints", data: monthCounts, borderColor: "#0056d6", backgroundColor: "rgba(0,86,214,.12)", tension: .35, fill: true, pointRadius: 4 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
  });

  // Complaints by Category
  const catCounts = CATEGORIES.map(cat => complaints.filter(c => c.category === cat).length);
  if (categoryChartInst) categoryChartInst.destroy();
  categoryChartInst = new Chart($("categoryChart"), {
    type: "doughnut",
    data: { labels: CATEGORIES, datasets: [{ data: catCounts, backgroundColor: palette }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "right", labels: { boxWidth: 12, font: { size: 10 } } } } }
  });

  // Priority Distribution
  const priorities = ["Low","Medium","High"];
  const priorityCounts = priorities.map(p => complaints.filter(c => c.priority === p).length);
  if (priorityChartInst) priorityChartInst.destroy();
  priorityChartInst = new Chart($("priorityChart"), {
    type: "pie",
    data: { labels: priorities, datasets: [{ data: priorityCounts, backgroundColor: ["#00b894","#f39c12","#e74c3c"] }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }
  });

  // Resolution Rate
  const resolvedClosed = complaints.filter(c => c.status === "Resolved" || c.status === "Closed").length;
  const others = complaints.length - resolvedClosed;
  const rate = complaints.length ? Math.round((resolvedClosed / complaints.length) * 100) : 0;
  if (resolutionChartInst) resolutionChartInst.destroy();
  resolutionChartInst = new Chart($("resolutionChart"), {
    type: "doughnut",
    data: { labels: [`Resolved/Closed (${rate}%)`, "Open"], datasets: [{ data: [resolvedClosed, others], backgroundColor: ["#00b894","#dfe8ff"] }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: "70%", plugins: { legend: { position: "bottom" } } }
  });

  // Staff Workload
  const staffCounts = {};
  complaints.forEach(c => { if (c.assignedStaff !== "Not Assigned") staffCounts[c.assignedStaff] = (staffCounts[c.assignedStaff] || 0) + 1; });
  const staffNames = Object.keys(staffCounts);
  const staffValues = staffNames.map(n => staffCounts[n]);
  if (workloadChartInst) workloadChartInst.destroy();
  workloadChartInst = new Chart($("workloadChart"), {
    type: "bar",
    data: { labels: staffNames, datasets: [{ label: "Assigned Complaints", data: staffValues, backgroundColor: "#0056d6", borderRadius: 6 }] },
    options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } } }
  });
}

/* ---------------------------------------------------------------
   ACTIVITY FEED
---------------------------------------------------------------- */

function renderActivity() {
  const list = $("activityList");
  list.innerHTML = activityFeed.slice(0, 8).map(a => `
    <div class="activity-item">
      <div class="activity-icon" style="background:${a.color}"><i class="fa-solid ${a.icon}"></i></div>
      <div class="activity-content">
        <strong>${a.title}</strong>
        <p>${a.detail}</p>
        <span>${a.time}</span>
      </div>
    </div>
  `).join("");
}

function addActivity(title, detail, icon, color) {
  activityFeed.unshift({ icon: icon || "fa-pen", color: color || "#0056d6", title, detail, time: "Just now" });
  renderActivity();
}

/* ---------------------------------------------------------------
   NOTIFICATIONS PANEL
---------------------------------------------------------------- */

const NOTIFICATIONS_DATA = [
  { title: "New Complaints", message: "3 new complaints were raised in the last hour.", time: "12 min ago", type: "new", icon: "fa-circle-plus" },
  { title: "Urgent Complaint", message: "HC-1014 (High priority) is still unassigned.", time: "30 min ago", type: "urgent", icon: "fa-triangle-exclamation" },
  { title: "Escalated Complaint", message: "HC-1017 was reopened by the student.", time: "1 hour ago", type: "escalated", icon: "fa-arrow-up" },
  { title: "Overdue Complaint", message: "HC-1006 has been open for more than 48 hours.", time: "2 hours ago", type: "overdue", icon: "fa-clock" },
  { title: "Staff Update", message: "Electrician Ravi Kumar completed 3 assigned tasks today.", time: "3 hours ago", type: "staff", icon: "fa-helmet-safety" },
  { title: "New Complaints", message: "Block C - Ganga reported a water supply issue.", time: "5 hours ago", type: "new", icon: "fa-circle-plus" },
  { title: "Overdue Complaint", message: "HC-1009 is pending staff assignment for 2 days.", time: "Yesterday", type: "overdue", icon: "fa-clock" }
];

function renderNotifications() {
  const list = $("notifList");
  list.innerHTML = NOTIFICATIONS_DATA.map((n, i) => `
    <div class="notif-item ${n.type === "urgent" ? "urgent" : ""} ${i < 3 ? "unread" : ""}">
      <div class="notif-icon ${n.type}"><i class="fa-solid ${n.icon}"></i></div>
      <div class="notif-content">
        <strong>${n.title}</strong>
        <span>${n.message}</span>
        <span>${n.time}</span>
      </div>
    </div>
  `).join("");
}

function openNotifPanel() {
  $("notifPanel").classList.add("open");
  $("notifOverlay").style.display = "block";
}
function closeNotifPanel() {
  $("notifPanel").classList.remove("open");
  $("notifOverlay").style.display = "none";
}

/* ---------------------------------------------------------------
   MODAL HELPERS
---------------------------------------------------------------- */

function openModal(id) { $(id).classList.add("open"); }
function closeModalEl(id) { $(id).classList.remove("open"); }

function setupModalClose(overlayId, closeBtnId) {
  $(closeBtnId).addEventListener("click", () => closeModalEl(overlayId));
  $(overlayId).addEventListener("click", (e) => { if (e.target === $(overlayId)) closeModalEl(overlayId); });
}

/* ---------------------------------------------------------------
   VIEW MODAL
---------------------------------------------------------------- */

function openViewModal(id) {
  const c = complaints.find(x => x.id === id);
  if (!c) return;
  $("viewComplaintId").textContent = `Complaint #${c.id}`;
  const badge = $("viewPriorityBadge");
  badge.textContent = c.priority + " Priority";
  badge.className = `badge priority-badge ${priorityClass(c.priority)}`;
  $("viewStudentName").textContent = c.studentName;
  $("viewRegNo").textContent = c.regNo;
  $("viewRoom").textContent = c.room;
  $("viewBlock").textContent = c.block;
  $("viewCategory").textContent = c.category;
  $("viewStatus").innerHTML = `<span class="badge ${statusClass(c.status)}">${c.status}</span>`;
  $("viewCreatedDate").textContent = formatDate(c.dateSubmitted);
  $("viewExpectedDate").textContent = formatDate(c.expectedCompletion);
  $("viewStaff").textContent = c.assignedStaff;
  $("viewTitle").textContent = c.title;
  $("viewDescription").textContent = c.description;
  $("viewAdminNotes").textContent = c.adminNotes || "-";

  $("viewImageWrap").innerHTML = c.hasImage
    ? `<div class="info-box"><i class="fa-solid fa-image"></i>&nbsp; Image attached by student (preview available in full ERP system).</div>`
    : `<div class="info-box" style="background:#f4f7fb;border-left-color:#94a3b8;"><i class="fa-solid fa-image-slash"></i>&nbsp; No image was attached to this complaint.</div>`;

  $("viewTimeline").innerHTML = c.timeline.map((step, i) => `
    <li class="timeline-step done ${i === c.timeline.length - 1 ? "current" : ""}">
      <span class="tl-dot"><svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      <div><strong>${step.label}</strong><span>${formatDateTime(step.date)} — ${step.note}</span></div>
    </li>
  `).join("");

  openModal("viewModalOverlay");
}

/* ---------------------------------------------------------------
   ASSIGN MODAL
---------------------------------------------------------------- */

let assignTargetId = null;

function openAssignModal(id) {
  const c = complaints.find(x => x.id === id);
  if (!c) return;
  assignTargetId = id;
  $("assignComplaintId").textContent = `— #${c.id}`;
  $("assignStaffSelect").value = c.assignedStaff !== "Not Assigned" ? c.assignedStaff : "";
  $("assignExpectedDate").value = toISODate(c.expectedCompletion);
  $("assignRemarks").value = "";
  openModal("assignModalOverlay");
}

$("assignForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const c = complaints.find(x => x.id === assignTargetId);
  if (!c) return;
  const staff = $("assignStaffSelect").value;
  const expected = $("assignExpectedDate").value;
  const remarks = $("assignRemarks").value.trim();

  c.assignedStaff = staff;
  c.expectedCompletion = new Date(expected);
  if (c.status === "Pending") c.status = "Assigned";
  c.lastUpdated = new Date();
  if (remarks) c.adminNotes = remarks;
  c.timeline.push({ label: "Assigned", date: c.lastUpdated, note: `Assigned to ${staff}` });

  addActivity("Complaint Assigned", `${c.id} assigned to ${staff}`, "fa-user-plus", "#7c3aed");
  closeModalEl("assignModalOverlay");
  populateStaffFilter();
  refresh(false);
  showToast(`Staff assigned to ${c.id}`);
});

$("assignCancelBtn").addEventListener("click", () => closeModalEl("assignModalOverlay"));

/* ---------------------------------------------------------------
   STATUS MODAL
---------------------------------------------------------------- */

let statusTargetId = null;

function openStatusModal(id) {
  const c = complaints.find(x => x.id === id);
  if (!c) return;
  statusTargetId = id;
  $("statusComplaintId").textContent = `— #${c.id}`;
  $("statusSelect").value = c.status === "Reopened" ? "Reopened" : c.status;
  $("statusRemarks").value = "";
  openModal("statusModalOverlay");
}

$("statusForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const c = complaints.find(x => x.id === statusTargetId);
  if (!c) return;
  const newStatus = $("statusSelect").value;
  const remarks = $("statusRemarks").value.trim();

  c.status = newStatus;
  c.lastUpdated = new Date();
  c.timeline.push({ label: newStatus, date: c.lastUpdated, note: remarks || stepNote(newStatus) });
  if (remarks) c.adminNotes = remarks;

  const activityTitle = newStatus === "Closed" ? "Complaint Closed" : newStatus === "Reopened" ? "Complaint Escalated" : "Complaint Updated";
  const activityIcon = newStatus === "Closed" ? "fa-box-archive" : newStatus === "Reopened" ? "fa-triangle-exclamation" : "fa-pen";
  const activityColor = newStatus === "Closed" ? "#636e72" : newStatus === "Reopened" ? "#e74c3c" : "#00b894";
  addActivity(activityTitle, `${c.id} status changed to ${newStatus}`, activityIcon, activityColor);

  closeModalEl("statusModalOverlay");
  refresh(false);
  showToast(`Status updated for ${c.id}`);
});

$("statusCancelBtn").addEventListener("click", () => closeModalEl("statusModalOverlay"));

/* ---------------------------------------------------------------
   EDIT MODAL
---------------------------------------------------------------- */

let editTargetId = null;

function openEditModal(id) {
  const c = complaints.find(x => x.id === id);
  if (!c) return;
  editTargetId = id;
  $("editComplaintId").textContent = `— #${c.id}`;
  $("editTitle").value = c.title;
  $("editCategory").value = c.category;
  $("editPriority").value = c.priority;
  $("editDescription").value = c.description;
  openModal("editModalOverlay");
}

$("editForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const c = complaints.find(x => x.id === editTargetId);
  if (!c) return;
  c.title = $("editTitle").value.trim();
  c.category = $("editCategory").value;
  c.priority = $("editPriority").value;
  c.description = $("editDescription").value.trim();
  c.lastUpdated = new Date();

  closeModalEl("editModalOverlay");
  refresh(false);
  showToast(`Complaint ${c.id} updated`);
});

$("editCancelBtn").addEventListener("click", () => closeModalEl("editModalOverlay"));

/* ---------------------------------------------------------------
   DELETE MODAL
---------------------------------------------------------------- */

let deleteTargetId = null;

function openDeleteModal(id) {
  deleteTargetId = id;
  $("deleteComplaintId").textContent = id;
  openModal("deleteModalOverlay");
}

$("deleteConfirmBtn").addEventListener("click", () => {
  complaints = complaints.filter(c => c.id !== deleteTargetId);
  addActivity("Complaint Updated", `${deleteTargetId} was deleted by admin`, "fa-trash", "#e74c3c");
  closeModalEl("deleteModalOverlay");
  populateStaffFilter();
  refresh(false);
  showToast(`Complaint ${deleteTargetId} deleted`);
});

$("deleteCancelBtn").addEventListener("click", () => closeModalEl("deleteModalOverlay"));

/* ---------------------------------------------------------------
   EXPORTS (CSV / Excel / PDF / Print)
---------------------------------------------------------------- */

function downloadBlob(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function buildCSV() {
  const headers = ["Complaint ID","Student Name","Register No","Room","Block","Category","Title","Priority","Assigned Staff","Status","Date Submitted","Last Updated"];
  const rows = filteredComplaints.map(c => [
    c.id, c.studentName, c.regNo, c.room, c.block, c.category, c.title, c.priority,
    c.assignedStaff, c.status, formatDate(c.dateSubmitted), formatDate(c.lastUpdated)
  ]);
  const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
  return [headers, ...rows].map(r => r.map(escape).join(",")).join("\n");
}

function exportCSV() {
  downloadBlob(buildCSV(), `complaints_export_${toISODate(NOW)}.csv`, "text/csv;charset=utf-8;");
  showToast("CSV export downloaded");
}

function exportExcel() {
  downloadBlob(buildCSV(), `complaints_export_${toISODate(NOW)}.xls`, "application/vnd.ms-excel");
  showToast("Excel export downloaded");
}

function exportPDF() {
  showToast("Preparing PDF — use the print dialog to save as PDF");
  setTimeout(() => window.print(), 400);
}

function printReport() {
  showToast("Opening print dialog...");
  setTimeout(() => window.print(), 300);
}

/* ---------------------------------------------------------------
   TOAST
---------------------------------------------------------------- */

let toastTimer = null;
window.showToast = function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
};

/* ---------------------------------------------------------------
   INIT
---------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  populateStaffFilter();
  renderActivity();
  renderNotifications();
  updateNotifBadge();
  refresh(true);

  // ---- Notification panel ----
  $("notifBellBtn").addEventListener("click", openNotifPanel);
  $("notifCloseBtn").addEventListener("click", closeNotifPanel);
  $("notifOverlay").addEventListener("click", closeNotifPanel);
  const sidebarNotifLink = $("sidebarNotifLink");
  if (sidebarNotifLink) {
    sidebarNotifLink.addEventListener("click", (e) => { e.preventDefault(); openNotifPanel(); });
  }

  // ---- Modal close bindings ----
  setupModalClose("viewModalOverlay", "viewModalCloseBtn");
  setupModalClose("assignModalOverlay", "assignModalCloseBtn");
  setupModalClose("statusModalOverlay", "statusModalCloseBtn");
  setupModalClose("editModalOverlay", "editModalCloseBtn");
  setupModalClose("deleteModalOverlay", "deleteModalCloseBtn");

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay.open").forEach(m => m.classList.remove("open"));
      closeNotifPanel();
    }
  });

  // ---- Table action delegation ----
  $("complaintsTbody").addEventListener("click", (e) => {
    const btn = e.target.closest("button.icon-btn");
    if (!btn) return;
    const id = btn.getAttribute("data-id");
    if (btn.classList.contains("view")) openViewModal(id);
    else if (btn.classList.contains("assign")) openAssignModal(id);
    else if (btn.classList.contains("status")) openStatusModal(id);
    else if (btn.classList.contains("edit")) openEditModal(id);
    else if (btn.classList.contains("delete")) openDeleteModal(id);
  });

  // ---- Sorting ----
  document.querySelectorAll("th.sortable").forEach((th) => {
    th.addEventListener("click", () => {
      const field = th.getAttribute("data-sort");
      if (sortField === field) sortDir *= -1;
      else { sortField = field; sortDir = 1; }
      document.querySelectorAll("th.sortable i").forEach(i => i.className = "fa-solid fa-sort");
      const icon = th.querySelector("i");
      icon.className = sortDir === 1 ? "fa-solid fa-sort-up" : "fa-solid fa-sort-down";
      refresh(true);
    });
  });

  // ---- Filters ----
  ["searchComplaint","searchStudent"].forEach(id => $(id).addEventListener("input", () => refresh(true)));
  ["filterStatus","filterPriority","filterCategory","filterBlock","filterStaff","filterDateFrom","filterDateTo"].forEach(id => $(id).addEventListener("change", () => refresh(true)));

  function resetFilters() {
    $("searchComplaint").value = "";
    $("searchStudent").value = "";
    $("filterStatus").value = "";
    $("filterPriority").value = "";
    $("filterCategory").value = "";
    $("filterBlock").value = "";
    $("filterStaff").value = "";
    $("filterDateFrom").value = "";
    $("filterDateTo").value = "";
    refresh(true);
  }
  $("resetFiltersBtn").addEventListener("click", resetFilters);
  $("emptyStateResetBtn").addEventListener("click", resetFilters);

  // ---- Exports ----
  $("csvExportBtn").addEventListener("click", exportCSV);

  // ---- Quick actions ----
  const scrollTo = (id) => $(id).scrollIntoView({ behavior: "smooth", block: "start" });

  $("qaViewAll").addEventListener("click", () => { resetFilters(); scrollTo("allComplaintsSection"); });
  $("qaPending").addEventListener("click", () => { resetFilters(); $("filterStatus").value = "Pending"; refresh(true); scrollTo("allComplaintsSection"); });
  $("qaAssignStaff").addEventListener("click", () => {
    const pending = complaints.find(c => c.status === "Pending");
    if (pending) { openAssignModal(pending.id); }
    else { showToast("No pending complaints need staff assignment right now"); scrollTo("allComplaintsSection"); }
  });
  $("qaHighPriority").addEventListener("click", () => { resetFilters(); $("filterPriority").value = "High"; refresh(true); scrollTo("allComplaintsSection"); });
  $("qaGenerateReport").addEventListener("click", printReport);
  $("qaExportPDF").addEventListener("click", exportPDF);
  $("qaExportExcel").addEventListener("click", exportExcel);
  $("qaSendNotification").addEventListener("click", () => {
    showToast("Notification sent to all students with pending complaints");
    addActivity("Complaint Updated", "Bulk notification sent to students with pending complaints", "fa-paper-plane", "#0056d6");
  });
  $("qaAnalytics").addEventListener("click", () => scrollTo("complaints"));

  // ---- Sidebar mobile toggle ----
  const hamburgerBtn = $("hamburgerBtn");
  const sidebar = $("sidebar");
  const scrim = $("sidebarScrim");

  function openSidebar() { sidebar.classList.add("active"); scrim.classList.add("active"); }
  function closeSidebar() { sidebar.classList.remove("active"); scrim.classList.remove("active"); }

  hamburgerBtn.addEventListener("click", () => {
    sidebar.classList.contains("active") ? closeSidebar() : openSidebar();
  });
  scrim.addEventListener("click", closeSidebar);

  document.querySelectorAll(".sidebar-item a").forEach((link) => {
    link.addEventListener("click", () => { if (window.innerWidth <= 992) closeSidebar(); });
  });

  // ---- Global search (topbar) mirrors complaint search ----
  $("globalSearch").addEventListener("input", (e) => {
    $("searchComplaint").value = e.target.value;
    refresh(true);
  });

});

function updateNotifBadge() {
  $("notifCount").textContent = NOTIFICATIONS_DATA.length;
}

window.addEventListener("load", () => {
  setTimeout(() => $("loaderOverlay").classList.add("hidden"), 600);
});
