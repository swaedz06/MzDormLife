/* ==========================================================================
   student-profile.js
   Smart Hostel 360 — Student My Profile page
   App shell behaviour (loader, sidebar, notifications, toast) mirrors the
   Complaint Module 1:1, plus profile-specific interactivity.
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

/* ---------- Animated counters ---------- */
function animateCounters() {
  document.querySelectorAll(".stat-number").forEach((el) => {
    const target = parseFloat(el.getAttribute("data-target")) || 0;
    const isDecimal = el.getAttribute("data-target").includes(".");
    let current = 0;
    const duration = 900;
    const steps = 40;
    const increment = target / steps;
    const stepTime = Math.max(Math.floor(duration / steps), 15);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = isDecimal ? current.toFixed(1) : Math.round(current);
    }, stepTime);
  });
}

/* ---------- Notification data ---------- */
const NOTIFICATIONS_DATA = [
  { icon: "fa-circle-check", title: "Fee Payment Received", text: "Your hostel fee payment has been confirmed.", unread: true },
  { icon: "fa-person-walking", title: "Outpass Approved", text: "Your outpass request for this weekend was approved.", unread: true },
  { icon: "fa-shirt", title: "Laundry Ready", text: "Your laundry batch is ready for pickup at Block B.", unread: true },
  { icon: "fa-calendar-check", title: "Attendance Updated", text: "Today's attendance has been marked present.", unread: false },
  { icon: "fa-circle-exclamation", title: "Complaint Update", text: "Your complaint HC-1042 status changed to In Progress.", unread: false },
];

function renderNotifications() {
  const list = document.getElementById("notifList");
  if (!list) return;
  list.innerHTML = NOTIFICATIONS_DATA.map((n) => `
    <div class="notif-item ${n.unread ? "unread" : ""}">
      <div class="notif-icon"><i class="fa-solid ${n.icon}"></i></div>
      <div class="notif-content">
        <strong>${n.title}</strong>
        <span>${n.text}</span>
      </div>
    </div>
  `).join("");
}

/* ---------- Recent activity timeline data ---------- */
const ACTIVITY_DATA = [
  { icon: "fa-money-bill-wave", title: "Fee Paid", date: "28 Jul 2026", time: "10:12 AM", status: "success", statusText: "Completed" },
  { icon: "fa-circle-exclamation", title: "Complaint Submitted", date: "26 Jul 2026", time: "6:45 PM", status: "pending", statusText: "Pending" },
  { icon: "fa-shirt", title: "Laundry Submitted", date: "25 Jul 2026", time: "9:00 AM", status: "success", statusText: "Completed" },
  { icon: "fa-person-walking", title: "Outpass Approved", date: "22 Jul 2026", time: "4:30 PM", status: "success", statusText: "Approved" },
  { icon: "fa-house-user", title: "Home Leave Requested", date: "18 Jul 2026", time: "11:20 AM", status: "pending", statusText: "Awaiting Approval" },
  { icon: "fa-calendar-check", title: "Attendance Updated", date: "18 Jul 2026", time: "8:05 PM", status: "success", statusText: "Present" },
  { icon: "fa-user-pen", title: "Profile Updated", date: "12 Jul 2026", time: "1:15 PM", status: "success", statusText: "Saved" },
];

function renderActivityTimeline() {
  const list = document.getElementById("activityTimeline");
  if (!list) return;
  list.innerHTML = ACTIVITY_DATA.map((a) => `
    <li class="timeline-step">
      <span class="tl-dot"><i class="fa-solid ${a.icon}"></i></span>
      <div class="timeline-step-body">
        <div>
          <strong>${a.title}</strong>
          <span class="tl-time">${a.date} &bull; ${a.time}</span>
        </div>
        <span class="${a.status}">${a.statusText}</span>
      </div>
    </li>
  `).join("");
}

/* ---------- Attendance chart ---------- */
function renderAttendanceChart() {
  const ctx = document.getElementById("attendanceChart");
  if (!ctx || typeof Chart === "undefined") return;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [{
        label: "Attendance %",
        data: [92, 88, 95, 90, 97, 94],
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
        y: { beginAtZero: true, max: 100, ticks: { precision: 0 } },
      },
    },
  });
}

/* ---------- Profile picture change (live preview) ---------- */
function handleAvatarChange(inputEl) {
  const file = inputEl.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    document.getElementById("profileAvatarImg").src = ev.target.result;
    showToast("Profile picture updated");
  };
  reader.readAsDataURL(file);
}

/* ---------- Edit Profile: scroll + flash ---------- */
function flashSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  el.classList.remove("flash-highlight");
  void el.offsetWidth;
  el.classList.add("flash-highlight");
}

/* ---------- Security settings form ---------- */
function validateField(field, condition) {
  const wrapper = field.closest(".form-field");
  if (condition) {
    wrapper.classList.remove("error");
  } else {
    wrapper.classList.add("error");
  }
  return condition;
}

function handleSecurityFormSubmit(e) {
  e.preventDefault();

  const currentPwd = document.getElementById("currentPassword");
  const newPwd = document.getElementById("newPassword");
  const confirmPwd = document.getElementById("confirmPassword");

  const validCurrent = validateField(currentPwd, currentPwd.value.trim().length > 0);
  const validNew = validateField(newPwd, newPwd.value.trim().length >= 8);
  const validConfirm = validateField(confirmPwd, confirmPwd.value === newPwd.value && confirmPwd.value.trim().length > 0);

  if (!validCurrent || !validNew || !validConfirm) {
    showToast("Please fix the highlighted fields");
    return;
  }

  showToast("Security settings saved successfully");
  e.target.reset();
  document.querySelectorAll("#securityForm .form-field.error").forEach((f) => f.classList.remove("error"));
}

function handleSecurityFormReset() {
  document.querySelectorAll("#securityForm .form-field.error").forEach((f) => f.classList.remove("error"));
  showToast("Changes discarded");
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderNotifications();
  renderActivityTimeline();
  renderAttendanceChart();
  animateCounters();

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
  document.getElementById("sidebarCloseBtn").addEventListener("click", closeSidebar);

  document.querySelectorAll(".sidebar-item a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 992) closeSidebar();
    });
  });

  /* ---------- Notification panel ---------- */
  const notifPanel = document.getElementById("notifPanel");
  const notifOverlay = document.getElementById("notifOverlay");

  function openNotifPanel() {
    notifPanel.classList.add("open");
    notifOverlay.style.display = "block";
  }
  function closeNotifPanel() {
    notifPanel.classList.remove("open");
    notifOverlay.style.display = "none";
  }

  document.getElementById("notifBellBtn").addEventListener("click", openNotifPanel);
  document.getElementById("notifCloseBtn").addEventListener("click", closeNotifPanel);
  notifOverlay.addEventListener("click", closeNotifPanel);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNotifPanel();
  });

  /* ---------- Profile header actions ---------- */
  document.getElementById("editProfileBtn").addEventListener("click", () => {
    flashSection("personalInfoSection");
    showToast("Update your details below and contact the hostel office to confirm changes");
  });

  document.getElementById("changePhotoBtn").addEventListener("click", () => {
    document.getElementById("avatarFileInput").click();
  });

  document.getElementById("avatarFileInput").addEventListener("change", function () {
    handleAvatarChange(this);
  });

  document.getElementById("changePasswordBtn").addEventListener("click", () => {
    flashSection("securitySection");
    document.getElementById("currentPassword").focus();
  });

  /* ---------- Fee actions ---------- */
  document.getElementById("viewPaymentHistoryBtn").addEventListener("click", () => {
    showToast("Opening payment history...");
  });

  document.getElementById("downloadReceiptBtn").addEventListener("click", () => {
    showToast("Downloading latest receipt...");
  });

  /* ---------- Security form ---------- */
  document.getElementById("securityForm").addEventListener("submit", handleSecurityFormSubmit);
  document.getElementById("cancelSecurityBtn").addEventListener("click", handleSecurityFormReset);
});
