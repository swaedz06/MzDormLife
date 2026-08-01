/* ==========================================================================
   notifications.js
   Handles slide-in notification panel content + open/close behaviour
   ========================================================================== */

const NOTIFICATIONS_DATA = [
  {
    id: 1,
    title: "Complaint Submitted",
    message: "Your complaint HC-1042 (Electrical) has been received.",
    time: "5 min ago",
    unread: true,
    icon: "submitted",
  },
  {
    id: 2,
    title: "Complaint Assigned",
    message: "HC-1038 (Plumbing) has been assigned to staff member Ravi Kumar.",
    time: "2 hours ago",
    unread: true,
    icon: "assigned",
  },
  {
    id: 3,
    title: "Complaint Completed",
    message: "HC-1021 (Furniture) has been marked as completed.",
    time: "Yesterday",
    unread: true,
    icon: "completed",
  },
  {
    id: 4,
    title: "Student Verification Required",
    message: "Please verify the resolution for HC-1015 (Water Supply).",
    time: "2 days ago",
    unread: false,
    icon: "verify",
  },
];

const NOTIF_ICONS = {
  submitted:
    '<svg viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
  assigned:
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
  completed:
    '<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  verify:
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


/* ==========================================================================
   complaints.js
   Complaint data, table rendering, search/filter, modal, form handling
   ========================================================================== */

/* ---------- Sample data ---------- */
let COMPLAINTS_DATA = [
  {
    id: "HC-1042",
    category: "Electrical",
    priority: "High",
    status: "Pending",
    date: "2026-07-28",
    staff: "Unassigned",
    description: "The ceiling fan in the room makes a loud grinding noise and stops randomly.",
    image: null,
    step: "submitted",
  },
  {
    id: "HC-1038",
    category: "Plumbing",
    priority: "Medium",
    status: "Assigned",
    date: "2026-07-26",
    staff: "Ravi Kumar",
    description: "Bathroom tap is leaking continuously, wasting water overnight.",
    image: null,
    step: "assigned",
  },
  {
    id: "HC-1030",
    category: "Internet",
    priority: "Low",
    status: "In Progress",
    date: "2026-07-24",
    staff: "Suresh Babu",
    description: "Wi-Fi signal is very weak on the third floor corridor and rooms.",
    image: null,
    step: "progress",
  },
  {
    id: "HC-1021",
    category: "Furniture",
    priority: "Low",
    status: "Completed",
    date: "2026-07-18",
    staff: "Muthu Raj",
    description: "Study table drawer handle is broken and needs replacement.",
    image: null,
    step: "completed",
  },
  {
    id: "HC-1015",
    category: "Water Supply",
    priority: "Medium",
    status: "Closed",
    date: "2026-07-10",
    staff: "Ravi Kumar",
    description: "No hot water supply in the common bathroom during mornings.",
    image: null,
    step: "verified",
  },
  {
    id: "HC-1044",
    category: "Security",
    priority: "High",
    status: "Assigned",
    date: "2026-07-29",
    staff: "Security Desk",
    description: "Main door lock of the room is broken and does not latch properly.",
    image: null,
    step: "assigned",
  },
];

const STATUS_CLASS_MAP = {
  Pending: "status-pending",
  Assigned: "status-assigned",
  "In Progress": "status-inprogress",
  Completed: "status-completed",
  Closed: "status-closed",
};

const PRIORITY_CLASS_MAP = {
  Low: "priority-low",
  Medium: "priority-medium",
  High: "priority-high",
};

const STEP_ORDER = ["submitted", "assigned", "progress", "completed", "verified"];

/* ---------- Rendering ---------- */
function formatDate(isoDate) {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function renderComplaintsTable(data) {
  const tbody = document.getElementById("complaintsTbody");
  const emptyState = document.getElementById("emptyState");
  const tableWrap = document.querySelector(".table-wrap");

  if (!data.length) {
    tbody.innerHTML = "";
    tableWrap.style.display = "none";
    emptyState.hidden = false;
    return;
  }

  tableWrap.style.display = "block";
  emptyState.hidden = true;

  tbody.innerHTML = data
    .map(
      (c, i) => `
    <tr style="animation: slideUp 320ms ease both; animation-delay:${i * 40}ms">
      <td><strong>${c.id}</strong></td>
      <td>${c.category}</td>
      <td><span class="badge ${PRIORITY_CLASS_MAP[c.priority]}">${c.priority}</span></td>
      <td><span class="badge ${STATUS_CLASS_MAP[c.status]}">${c.status}</span></td>
      <td>${formatDate(c.date)}</td>
      <td>${c.staff}</td>
      <td><button class="action-btn" data-view-id="${c.id}">View</button></td>
    </tr>`
    )
    .join("");

  tbody.querySelectorAll("[data-view-id]").forEach((btn) => {
    btn.addEventListener("click", () => openComplaintModal(btn.getAttribute("data-view-id")));
  });
}

/* ---------- Search + Filter ---------- */
function getFilteredComplaints() {
  const searchTerm = (document.getElementById("globalSearch").value || "").toLowerCase().trim();
  const statusFilter = document.getElementById("filterStatus").value;
  const categoryFilter = document.getElementById("filterCategory").value;
  const priorityFilter = document.getElementById("filterPriority").value;
  const dateFilter = document.getElementById("filterDate").value;

  return COMPLAINTS_DATA.filter((c) => {
    const matchesSearch =
      !searchTerm ||
      c.id.toLowerCase().includes(searchTerm) ||
      c.category.toLowerCase().includes(searchTerm) ||
      c.description.toLowerCase().includes(searchTerm);

    const matchesStatus = !statusFilter || c.status === statusFilter;
    const matchesCategory = !categoryFilter || c.category === categoryFilter;
    const matchesPriority = !priorityFilter || c.priority === priorityFilter;
    const matchesDate = !dateFilter || c.date === dateFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesDate;
  });
}

function refreshTable() {
  renderComplaintsTable(getFilteredComplaints());
}

/* ---------- Modal ---------- */
function openComplaintModal(id) {
  const complaint = COMPLAINTS_DATA.find((c) => c.id === id);
  if (!complaint) return;

  document.getElementById("modalComplaintId").textContent = `Complaint #${complaint.id}`;
  const priorityBadge = document.getElementById("modalPriorityBadge");
  priorityBadge.textContent = complaint.priority;
  priorityBadge.className = `badge priority-badge ${PRIORITY_CLASS_MAP[complaint.priority]}`;

  document.getElementById("modalCategory").textContent = complaint.category;
  document.getElementById("modalStatus").textContent = complaint.status;
  document.getElementById("modalStaff").textContent = complaint.staff;
  document.getElementById("modalDescription").textContent = complaint.description;

  const imageWrap = document.getElementById("modalImageWrap");
  imageWrap.innerHTML = complaint.image ? `<img src="${complaint.image}" alt="Complaint photo">` : "";

  // Timeline
  const currentIndex = STEP_ORDER.indexOf(complaint.step);
  document.querySelectorAll(".timeline-step").forEach((stepEl) => {
    const stepName = stepEl.getAttribute("data-step");
    const stepIndex = STEP_ORDER.indexOf(stepName);
    stepEl.classList.remove("done", "current");
    if (stepIndex < currentIndex) stepEl.classList.add("done");
    else if (stepIndex === currentIndex) stepEl.classList.add("done", "current");
  });

  document.getElementById("modalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeComplaintModal() {
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

function handleComplaintFormSubmit(e) {
  e.preventDefault();

  const category = document.getElementById("fCategory");
  const priority = document.getElementById("fPriority");
  const description = document.getElementById("fDescription");

  const validCategory = validateField(category, category.value !== "");
  const validPriority = validateField(priority, priority.value !== "");
  const validDescription = validateField(description, description.value.trim().length >= 10);

  if (!validCategory || !validPriority || !validDescription) {
    if (window.showToast) window.showToast("Please fix the highlighted fields");
    return;
  }

  const newId = `HC-${1050 + COMPLAINTS_DATA.length}`;
  const imagePreviewImg = document.querySelector("#imagePreviewWrap img");

  COMPLAINTS_DATA.unshift({
    id: newId,
    category: category.value,
    priority: priority.value,
    status: "Pending",
    date: new Date().toISOString().slice(0, 10),
    staff: "Unassigned",
    description: description.value.trim(),
    image: imagePreviewImg ? imagePreviewImg.src : null,
    step: "submitted",
  });

  refreshTable();
  animateStatUpdate("pending");

  e.target.reset();
  document.getElementById("imagePreviewWrap").innerHTML = "";
  document.getElementById("imageUploadLabel").textContent = "Click to upload image";
  document.getElementById("videoUploadLabel").textContent = "Click to upload video (optional)";
  document.querySelectorAll(".form-field.error").forEach((f) => f.classList.remove("error"));

  if (window.showToast) window.showToast(`Complaint ${newId} submitted successfully`);

  document.getElementById("myComplaintsSection").scrollIntoView({ behavior: "smooth", block: "start" });
}

function animateStatUpdate(kind) {
  const labels = {
    pending: "Pending Complaints",
    progress: "In Progress",
  };
  document.querySelectorAll(".stat-card").forEach((card) => {
    const label = card.querySelector(".stat-label").textContent;
    if (label === labels[kind]) {
      const numEl = card.querySelector(".stat-number");
      numEl.textContent = parseInt(numEl.textContent, 10) + 1;
      card.style.transform = "scale(1.04)";
      setTimeout(() => (card.style.transform = ""), 220);
    }
  });
}

function handleImagePreview(inputEl, labelId, wrapId, isVideo) {
  const file = inputEl.files[0];
  const label = document.getElementById(labelId);

  if (!file) {
    label.textContent = isVideo ? "Click to upload video (optional)" : "Click to upload image";
    return;
  }

  label.textContent = file.name;

  if (!isVideo) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const wrap = document.getElementById(wrapId);
      wrap.innerHTML = `<img src="${ev.target.result}" alt="Preview of ${file.name}">`;
    };
    reader.readAsDataURL(file);
  }
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  refreshTable();
  animateCounters();

  // Search + filters
  document.getElementById("globalSearch").addEventListener("input", refreshTable);
  document.getElementById("filterStatus").addEventListener("change", refreshTable);
  document.getElementById("filterCategory").addEventListener("change", refreshTable);
  document.getElementById("filterPriority").addEventListener("change", refreshTable);
  document.getElementById("filterDate").addEventListener("change", refreshTable);

  // Modal
  document.getElementById("modalCloseBtn").addEventListener("click", closeComplaintModal);
  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") closeComplaintModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeComplaintModal();
  });

  // Form
  document.getElementById("complaintForm").addEventListener("submit", handleComplaintFormSubmit);
  document.getElementById("resetFormBtn").addEventListener("click", () => {
    document.getElementById("imagePreviewWrap").innerHTML = "";
    document.getElementById("imageUploadLabel").textContent = "Click to upload image";
    document.getElementById("videoUploadLabel").textContent = "Click to upload video (optional)";
    document.querySelectorAll(".form-field.error").forEach((f) => f.classList.remove("error"));
  });

  document.getElementById("fImage").addEventListener("change", function () {
    handleImagePreview(this, "imageUploadLabel", "imagePreviewWrap", false);
  });
  document.getElementById("fVideo").addEventListener("change", function () {
    handleImagePreview(this, "videoUploadLabel", null, true);
  });

  document.getElementById("emptyStateRaiseBtn")?.addEventListener("click", () => {
    document.getElementById("raiseComplaintSection").scrollIntoView({ behavior: "smooth", block: "start" });
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
    sidebar.classList.add("open");
    scrim.classList.add("open");
  }
  function closeSidebar() {
    sidebar.classList.remove("open");
    scrim.classList.remove("open");
  }
  hamburgerBtn.addEventListener("click", () => {
    sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
  });
  scrim.addEventListener("click", closeSidebar);

  // Close mobile sidebar automatically when a link is tapped
  document.querySelectorAll(".sidebar-item a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 1024) closeSidebar();
    });
  });

  /* ---------- Quick action buttons: smooth scroll ---------- */
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  document.getElementById("qaRaiseComplaint").addEventListener("click", () => scrollTo("raiseComplaintSection"));
  document.getElementById("qaMyComplaints").addEventListener("click", () => scrollTo("myComplaintsSection"));
  document.getElementById("qaHistory").addEventListener("click", () => {
    scrollTo("myComplaintsSection");
    showToast("Showing full complaint history");
  });
  document.getElementById("qaFeedback").addEventListener("click", () => {
    showToast("Feedback form coming soon");
  });
});



/* ---------- Complaint analytics chart (additive; matches Attendance-style analytics section) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("complaintsChart");
  if (!ctx || typeof Chart === "undefined") return;

  const counts = {};
  COMPLAINTS_DATA.forEach((c) => {
    counts[c.category] = (counts[c.category] || 0) + 1;
  });

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(counts),
      datasets: [{
        label: "Complaints",
        data: Object.values(counts),
        backgroundColor: "#0056d6",
        borderRadius: 8,
        maxBarThickness: 42,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } },
      },
    },
  });
});

