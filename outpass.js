/* =========================================================
   SMART HOSTEL 360 — STUDENT OUTPASS MODULE
   Vanilla JS: navigation, live clock, data rendering,
   form handling, QR/barcode generation, toasts, filters
   ========================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------
     MOCK DATA
     In production this would come from the backend API.
  --------------------------------------------------------- */
  const outpassRecords = [
    { id: 'OP-88541', date: '30 Jul 2026', out: '05:10 PM', ret: '09:15 PM', reason: 'Grocery shopping',      dest: 'City Mall',        approvedBy: 'R. Vignesh', status: 'Approved',   remarks: 'Returned on time' },
    { id: 'OP-88539', date: '28 Jul 2026', out: '10:00 AM', ret: '01:00 PM', reason: 'Bank work',              dest: 'SBI Main Branch',  approvedBy: 'R. Vignesh', status: 'Approved',   remarks: '—' },
    { id: 'OP-88532', date: '25 Jul 2026', out: '04:30 PM', ret: '08:00 PM', reason: 'Doctor appointment',     dest: 'City Hospital',    approvedBy: 'S. Meena',  status: 'Late Return', remarks: 'Returned 40 min late' },
    { id: 'OP-88521', date: '22 Jul 2026', out: '06:00 PM', ret: '08:30 PM', reason: 'Family visit',           dest: 'Race Course',      approvedBy: 'R. Vignesh', status: 'Rejected',   remarks: 'Insufficient reason' },
    { id: 'OP-88510', date: '19 Jul 2026', out: '09:00 AM', ret: '06:00 PM', reason: 'College fest',           dest: 'PSG Tech',         approvedBy: 'S. Meena',  status: 'Approved',   remarks: '—' },
    { id: 'OP-88502', date: '14 Jul 2026', out: '05:30 PM', ret: '07:45 PM', reason: 'Haircut & essentials',   dest: 'RS Puram',         approvedBy: 'R. Vignesh', status: 'Approved',   remarks: '—' },
    { id: 'OP-88495', date: '10 Jul 2026', out: '11:00 AM', ret: '02:00 PM', reason: 'Sim card renewal',       dest: 'Airtel Store',     approvedBy: '—',         status: 'Pending',    remarks: 'Awaiting warden review' },
    { id: 'OP-88488', date: '05 Jul 2026', out: '04:00 PM', ret: '07:00 PM', reason: 'Library reference book', dest: 'Central Library',  approvedBy: 'R. Vignesh', status: 'Approved',   remarks: '—' },
  ];

  const notifications = [
    { icon: 'fa-check', type: 'approved', title: 'Outpass Approved', text: 'Your request OP-88541 to City Mall has been approved.', time: '2h ago', unread: true },
    { icon: 'fa-bell', type: 'reminder', title: 'Return Reminder', text: 'Remember to return before 08:00 PM today.', time: '4h ago', unread: true },
    { icon: 'fa-qrcode', type: 'gate', title: 'Gate Scan Successful', text: 'Your QR pass was scanned at the Main Gate.', time: 'Yesterday', unread: true },
    { icon: 'fa-triangle-exclamation', type: 'warning', title: 'Late Return Warning', text: 'You returned 40 minutes after the approved time on 25 Jul.', time: '3 days ago', unread: false },
    { icon: 'fa-xmark', type: 'rejected', title: 'Outpass Rejected', text: 'Your request OP-88521 was rejected by the warden.', time: '5 days ago', unread: false },
  ];

  /* ---------------------------------------------------------
     NAVIGATION — switch pages, keep sidebar state in sync
  --------------------------------------------------------- */
  const navItems = document.querySelectorAll('.nav-item[data-page]');
  const pages = document.querySelectorAll('.page');
  const DEFAULT_PAGE = 'outpass-dashboard';
  let currentPageId = DEFAULT_PAGE;
  let pageHistory = [];

  function goToPage(pageId, trackHistory = true) {
    if (trackHistory && pageId !== currentPageId) {
      pageHistory.push(currentPageId);
    }
    currentPageId = pageId;
    pages.forEach(p => p.classList.toggle('active', p.id === `page-${pageId}`));
    navItems.forEach(n => n.classList.toggle('active', n.dataset.page === pageId));
    document.querySelector('.content').scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeSidebarOnMobile();
  }

  // Back button — returns to the previous page in this session, or the Dashboard
  function goBack() {
    const prev = pageHistory.pop() || DEFAULT_PAGE;
    goToPage(prev, false);
  }

  document.querySelectorAll('[data-back]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      goBack();
    });
  });

  navItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      goToPage(item.dataset.page);
    });
  });

  // Any element with data-goto also navigates (buttons, links, dropdown link)
  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      goToPage(el.dataset.goto);
    });
  });

  // Scroll-to helpers used on the Outpass Dashboard quick actions
  document.getElementById('emergencyScrollBtn')?.addEventListener('click', () => {
    document.getElementById('emergencyCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.getElementById('rulesScrollBtn')?.addEventListener('click', () => {
    document.getElementById('rulesCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------------------------------------------------------
     SIDEBAR TOGGLE (mobile hamburger + overlay)
  --------------------------------------------------------- */
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const hamburgerBtn = document.getElementById('hamburgerBtn');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  }
  function closeSidebarOnMobile() {
    if (window.innerWidth <= 768) closeSidebar();
  }

  hamburgerBtn.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  overlay.addEventListener('click', closeSidebar);
  window.addEventListener('resize', () => { if (window.innerWidth > 768) closeSidebar(); });

  /* ---------------------------------------------------------
     PROFILE DROPDOWN
  --------------------------------------------------------- */
  const topbarProfile = document.getElementById('topbarProfile');
  topbarProfile.addEventListener('click', e => {
    e.stopPropagation();
    topbarProfile.classList.toggle('open');
  });
  document.addEventListener('click', () => topbarProfile.classList.remove('open'));

  /* ---------------------------------------------------------
     LIVE DATE & TIME
  --------------------------------------------------------- */
  const clockTime = document.getElementById('clockTime');
  const clockDate = document.getElementById('clockDate');
  const welcomeTime = document.getElementById('welcomeTime');

  function tickClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    if (clockTime) clockTime.textContent = timeStr;
    if (clockDate) clockDate.textContent = dateStr;
    if (welcomeTime) welcomeTime.textContent = timeStr;
  }
  tickClock();
  setInterval(tickClock, 1000);

  /* ---------------------------------------------------------
     STATUS BADGE HELPER
  --------------------------------------------------------- */
  function statusBadge(status) {
    const map = {
      'Approved':    'badge--approved',
      'Pending':     'badge--pending',
      'Rejected':    'badge--rejected',
      'Late Return': 'badge--late',
    };
    return `<span class="badge ${map[status] || ''}">${status}</span>`;
  }

  /* ---------------------------------------------------------
     RENDER: Recent Requests (Outpass Dashboard) — latest 5
  --------------------------------------------------------- */
  function renderRecentRequests() {
    const tbody = document.querySelector('#recentRequestsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = outpassRecords.slice(0, 5).map(r => `
      <tr>
        <td>${r.id}</td>
        <td>${r.date}</td>
        <td>${r.out}</td>
        <td>${r.ret}</td>
        <td>${r.reason}</td>
        <td>${r.dest}</td>
        <td>${r.approvedBy}</td>
        <td>${statusBadge(r.status)}</td>
        <td>
          <button class="table-action-btn" title="View"><i class="fa-solid fa-eye"></i></button>
          <button class="table-action-btn" title="Download"><i class="fa-solid fa-download"></i></button>
        </td>
      </tr>
    `).join('');
  }

  /* ---------------------------------------------------------
     RENDER: Outpass History (with search + filters)
  --------------------------------------------------------- */
  const historyTbody = document.querySelector('#historyTable tbody');
  const historyEmptyState = document.getElementById('historyEmptyState');
  const historySearch = document.getElementById('historySearch');
  const historyStatusFilter = document.getElementById('historyStatusFilter');
  const historyDateFilter = document.getElementById('historyDateFilter');

  function renderHistory() {
    if (!historyTbody) return;
    const q = (historySearch.value || '').toLowerCase().trim();
    const statusVal = historyStatusFilter.value;

    const filtered = outpassRecords.filter(r => {
      const matchesQ = !q || [r.id, r.dest, r.reason].some(f => f.toLowerCase().includes(q));
      const matchesStatus = !statusVal || r.status === statusVal;
      return matchesQ && matchesStatus;
    });

    historyTbody.innerHTML = filtered.map(r => `
      <tr>
        <td>${r.id}</td>
        <td>${r.date}</td>
        <td>${r.reason}</td>
        <td>${r.dest}</td>
        <td>${r.out}</td>
        <td>${r.ret}</td>
        <td>${statusBadge(r.status)}</td>
        <td>${r.approvedBy}</td>
        <td>${r.remarks}</td>
      </tr>
    `).join('');

    historyEmptyState.style.display = filtered.length ? 'none' : 'block';
  }

  historySearch?.addEventListener('input', renderHistory);
  historyStatusFilter?.addEventListener('change', renderHistory);
  historyDateFilter?.addEventListener('change', renderHistory);

  document.getElementById('exportPdfBtn')?.addEventListener('click', () => showToast('Preparing PDF export…', 'success', 'fa-file-pdf'));
  document.getElementById('exportExcelBtn')?.addEventListener('click', () => showToast('Preparing Excel export…', 'success', 'fa-file-excel'));

  /* ---------------------------------------------------------
     RENDER: Notifications
  --------------------------------------------------------- */
  function renderNotifications() {
    const list = document.getElementById('notifList');
    if (!list) return;
    const iconClassMap = {
      approved: 'notif-icon--approved',
      rejected: 'notif-icon--rejected',
      reminder: 'notif-icon--reminder',
      gate: 'notif-icon--gate',
      warning: 'notif-icon--warning',
    };
    list.innerHTML = notifications.map(n => `
      <div class="notif-item ${n.unread ? 'unread' : ''}">
        <div class="notif-icon ${iconClassMap[n.type]}"><i class="fa-solid ${n.icon}"></i></div>
        <div class="notif-body">
          <strong>${n.title}</strong>
          <p>${n.text}</p>
        </div>
        <span class="notif-time">${n.time}</span>
      </div>
    `).join('');
  }

  document.getElementById('markAllReadBtn')?.addEventListener('click', () => {
    notifications.forEach(n => n.unread = false);
    renderNotifications();
    document.getElementById('sidebarNotifBadge').style.display = 'none';
    showToast('All notifications marked as read', 'success', 'fa-check-double');
  });

  document.getElementById('notifBellBtn')?.addEventListener('click', () => goToPage('notifications'));

  /* ---------------------------------------------------------
     APPLY OUTPASS FORM
  --------------------------------------------------------- */
  const outpassForm = document.getElementById('outpassForm');
  const fileInput = document.getElementById('fileInput');
  const fileDropText = document.getElementById('fileDropText');

  fileInput?.addEventListener('change', () => {
    fileDropText.textContent = fileInput.files.length
      ? `Selected: ${fileInput.files[0].name}`
      : 'Click to upload or drag a file here (PDF, JPG, PNG)';
  });

  outpassForm?.addEventListener('submit', e => {
    e.preventDefault();
    if (!outpassForm.checkValidity()) {
      outpassForm.reportValidity();
      return;
    }
    showToast('Outpass request submitted for approval!', 'success', 'fa-paper-plane');
    outpassForm.reset();
    fileDropText.textContent = 'Click to upload or drag a file here (PDF, JPG, PNG)';
    setTimeout(() => goToPage('outpass-dashboard'), 900);
  });

  document.getElementById('cancelFormBtn')?.addEventListener('click', () => {
    outpassForm.reset();
    goToPage('outpass-dashboard');
  });

  /* ---------------------------------------------------------
     DOWNLOAD PASS shortcuts (dashboard quick actions)
  --------------------------------------------------------- */
  ['downloadPassBtnDash', 'downloadPassBtnOD'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => goToPage('qr-pass'));
  });

  document.getElementById('downloadQrBtn')?.addEventListener('click', () => {
    showToast('Downloading your digital outpass…', 'success', 'fa-download');
  });
  document.getElementById('printQrBtn')?.addEventListener('click', () => {
    window.print();
  });

  /* ---------------------------------------------------------
     LOGOUT
  --------------------------------------------------------- */
  document.getElementById('logoutBtn')?.addEventListener('click', e => {
    e.preventDefault();
    showToast('Logging you out…', 'success', 'fa-right-from-bracket');
  });

  /* ---------------------------------------------------------
     TOAST NOTIFICATIONS
  --------------------------------------------------------- */
  function showToast(message, type = 'success', icon = 'fa-circle-check') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('hide');
      toast.addEventListener('animationend', () => toast.remove());
    }, 3200);
  }

  /* ---------------------------------------------------------
     INIT
  --------------------------------------------------------- */
  renderRecentRequests();
  renderHistory();
  renderNotifications();

})();
