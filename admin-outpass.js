/*==========================================
        SMART HOSTEL 360
        ADMIN OUTPASS MODULE — LOGIC
===========================================*/

(function () {

  /* ---------------------------------------------------------
     DATE / TIME HELPERS
  --------------------------------------------------------- */
  const DAY = 24 * 60 * 60 * 1000;
  const now = new Date();

  function atTime(dateObj, hh, mm) {
    const d = new Date(dateObj);
    d.setHours(hh, mm, 0, 0);
    return d;
  }
  function addDays(dateObj, n) {
    return new Date(dateObj.getTime() + n * DAY);
  }
  function fmtDate(d) {
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  function fmtTime(d) {
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  }
  function initialsOf(name) {
    return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  /* ---------------------------------------------------------
     MOCK DATA
  --------------------------------------------------------- */
  const departments = ['Computer Science', 'Electronics & Comm.', 'Mechanical', 'Civil', 'Electrical', 'Information Tech.'];
  const blocks = ['Block A', 'Block B', 'Block C'];

  let requestSeq = 1042;
  function nextId() { return 'OP-' + (requestSeq++); }

  const raw = [
    // [name, regNo, dept, year, room, block, purpose, destination, outOffsetDays, outHH, outMM, retOffsetDays, retHH, retMM, status, returnedOffsetDays(null=not returned), mobile, parentName, parentMobile, hasDoc]
    ['Ananya Sharma', '21CS114', departments[0], '3rd Year', 'A-214', blocks[0], 'Visiting home', 'Chennai', 0, 9, 0, 0, 20, 0, 'Approved', null, '9840011223', 'Mr. Ramesh Sharma', '9840099887', false],
    ['Rohit Verma', '21EC088', departments[1], '2nd Year', 'B-108', blocks[1], 'Medical appointment', 'City Hospital', 0, 8, 30, 0, 10, 30, 'Approved', null, '9940022334', 'Mrs. Sunita Verma', '9940088776', true],
    ['Divya Krishnan', '20ME045', departments[2], '4th Year', 'C-302', blocks[2], 'Family function', 'Coimbatore', -1, 7, 0, -1, 19, 0, 'Approved', -1, '9944033445', 'Mr. Krishnan Iyer', '9944077665', false],
    ['Aravind Kumar', '22CV021', departments[3], '1st Year', 'A-110', blocks[0], 'Shopping', 'Brookefields Mall', 0, 14, 0, 1, 20, 0, 'Pending', null, '9843044556', 'Mrs. Lalitha Kumar', '9843066554', false],
    ['Sneha Reddy', '21EE067', departments[4], '3rd Year', 'B-215', blocks[1], 'Bank work', 'SBI Main Branch', 0, 10, 0, 0, 13, 0, 'Pending', null, '9845055667', 'Mr. Reddy Prasad', '9845055443', false],
    ['Karthik Raj', '21IT032', departments[5], '2nd Year', 'C-118', blocks[2], 'Personal work', 'Home Town', -2, 9, 0, -2, 18, 0, 'Rejected', null, '9842066778', 'Mrs. Meena Raj', '9842044332', false],
    ['Priya Nair', '20CS156', departments[0], '4th Year', 'A-305', blocks[0], 'Sister\'s wedding', 'Trivandrum', -3, 6, 0, -1, 20, 0, 'Approved', -1, '9846077889', 'Mr. Nair Suresh', '9846033221', true],
    ['Vishal Menon', '22EC009', departments[1], '1st Year', 'B-102', blocks[1], 'Doctor visit', 'Apollo Clinic', 0, 11, 0, -0.02, 15, 0, 'Approved', null, '9847088990', 'Mrs. Menon Radha', '9847022110', true],
    ['Meera Iyer', '21ME099', departments[2], '3rd Year', 'C-210', blocks[2], 'Weekend home visit', 'Madurai', -4, 9, 0, -3, 19, 0, 'Completed', -3, '9848099001', 'Mr. Iyer Gopal', '9848011009', false],
    ['Suresh Babu', '22CV054', departments[3], '1st Year', 'A-117', blocks[0], 'Sports event', 'District Stadium', 1, 8, 0, 1, 18, 0, 'Pending', null, '9849000112', 'Mrs. Babu Kamala', '9849099008', false],
    ['Nandini Rao', '20EE023', departments[4], '4th Year', 'B-301', blocks[1], 'Interview', 'Tech Park', 0, 8, 0, -0.04, 17, 0, 'Approved', null, '9830011223', 'Mr. Rao Venkat', '9830088007', true],
    ['Arjun Pillai', '21IT077', departments[5], '2nd Year', 'C-119', blocks[2], 'Family emergency', 'Trichy', -5, 6, 0, -4, 21, 0, 'Rejected', null, '9831022334', 'Mrs. Pillai Devi', '9831077006', false],
    ['Kavya Sundaram', '21CS201', departments[0], '3rd Year', 'A-220', blocks[0], 'Cultural fest', 'Chennai Trade Centre', -6, 7, 0, -5, 22, 0, 'Completed', -5, '9832033445', 'Mr. Sundaram Raj', '9832066005', false],
    ['Yash Malhotra', '22EC061', departments[1], '1st Year', 'B-115', blocks[1], 'Personal work', 'City Centre', 0, 13, 0, 0, 19, 0, 'Pending', null, '9833044556', 'Mrs. Malhotra Neha', '9833055004', false],
    ['Pooja Das', '20ME112', departments[2], '4th Year', 'C-306', blocks[2], 'Home visit', 'Salem', -8, 8, 0, -6, 20, 0, 'Completed', -6, '9834055667', 'Mr. Das Bikash', '9834044003', true],
    ['Harish Chandran', '21CV088', departments[3], '2nd Year', 'A-128', blocks[0], 'Vehicle service', 'Local Garage', 0, 9, 30, 0, 12, 0, 'Approved', null, '9835066778', 'Mrs. Chandran Latha', '9835033002', false],
  ];

  const outpassRecords = raw.map((r, i) => {
    const [name, regNo, dept, year, room, block, purpose, destination,
      outOff, outHH, outMM, retOff, retHH, retMM, status, returnedOff,
      mobile, parentName, parentMobile, hasDoc] = r;

    const outDT = atTime(addDays(now, outOff), outHH, outMM);
    const retDT = atTime(addDays(now, retOff), retHH, retMM);
    const returnedDT = returnedOff === null ? null : atTime(addDays(now, returnedOff), retHH, Math.min(retMM + 15, 59));

    return {
      id: nextId(),
      name, regNo, dept, year, room, block, purpose, destination,
      initials: initialsOf(name),
      outDT, retDT, returnedDT,
      status,
      remarks: status === 'Rejected' ? 'Reason not sufficiently justified as per hostel policy.' :
               status === 'Completed' ? 'Returned to hostel and verified at the gate.' :
               status === 'Approved' ? 'Approved. Please carry your ID card.' : '',
      approvedBy: status === 'Pending' ? '—' : 'Mrs. Kavitha Rao',
      mobile, parentName, parentMobile, hasDoc,
      studentRemarks: 'Kindly approve at the earliest, thank you.',
      requestedAt: addDays(outDT, -0.3),
    };
  });

  /* ---------------------------------------------------------
     DERIVED STATE HELPERS
  --------------------------------------------------------- */
  function isOutside(r) {
    return r.status === 'Approved' && !r.returnedDT;
  }
  function isOverdue(r) {
    return isOutside(r) && new Date() > r.retDT;
  }
  function outsideSubStatus(r) {
    if (!isOutside(r)) return null;
    return isOverdue(r) ? 'Overdue' : 'Outside';
  }
  function returnedToday(r) {
    if (!r.returnedDT) return false;
    const t = new Date();
    return r.returnedDT.toDateString() === t.toDateString();
  }

  /* ---------------------------------------------------------
     NOTIFICATIONS STATE
  --------------------------------------------------------- */
  const notifications = [
    { icon: 'fa-clipboard-list', type: 'new', title: 'New outpass request', text: 'Aravind Kumar submitted a new outpass request.', time: '10 min ago', unread: true },
    { icon: 'fa-triangle-exclamation', type: 'warning', title: 'Student overdue', text: 'Vishal Menon has not returned by the expected time.', time: '25 min ago', unread: true },
    { icon: 'fa-door-open', type: 'return', title: 'Student returned', text: 'Divya Krishnan has returned and been marked complete.', time: '1 hr ago', unread: true },
    { icon: 'fa-circle-check', type: 'approved', title: 'Request approved', text: 'Rohit Verma\'s outpass request was approved.', time: '2 hr ago', unread: false },
    { icon: 'fa-circle-xmark', type: 'rejected', title: 'Request rejected', text: 'Karthik Raj\'s outpass request was rejected.', time: '5 hr ago', unread: false },
  ];

  function pushNotification(n) {
    notifications.unshift(Object.assign({ time: 'Just now', unread: true }, n));
    renderNotifications();
  }

  /* ---------------------------------------------------------
     TOAST
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
     BADGES
  --------------------------------------------------------- */
  function statusBadge(status) {
    const map = {
      Approved: 'badge--approved',
      Pending: 'badge--pending',
      Rejected: 'badge--rejected',
      Completed: 'badge--completed',
    };
    return `<span class="badge ${map[status] || ''}">${status}</span>`;
  }
  function outsideBadge(sub) {
    const map = { Outside: 'badge--outside', Overdue: 'badge--overdue', Returned: 'badge--returned' };
    return `<span class="badge ${map[sub] || ''}">${sub}</span>`;
  }

  /* ---------------------------------------------------------
     STAT COUNTER ANIMATION
  --------------------------------------------------------- */
  function animateCounter(el, target) {
    const start = parseInt(el.textContent, 10) || 0;
    if (start === target) { el.textContent = target; return; }
    const duration = 600;
    const startTime = performance.now();
    function step(t) {
      const progress = Math.min((t - startTime) / duration, 1);
      el.textContent = Math.round(start + (target - start) * progress);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------------------------------------------------------
     CHART
  --------------------------------------------------------- */
  let statusChart = null;
  function renderChart(counts) {
    const ctx = document.getElementById('statusChart');
    if (!ctx || typeof Chart === 'undefined') return;
    const data = {
      labels: ['Pending', 'Approved', 'Rejected', 'Completed'],
      datasets: [{
        data: [counts.pending, counts.approved, counts.rejected, counts.completed],
        backgroundColor: ['#f39c12', '#00b894', '#e74c3c', '#0056d6'],
        borderWidth: 0,
        hoverOffset: 6,
      }],
    };
    if (statusChart) {
      statusChart.data = data;
      statusChart.update();
      return;
    }
    statusChart = new Chart(ctx, {
      type: 'doughnut',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'bottom', labels: { font: { family: 'Poppins', size: 12 }, padding: 16 } },
        },
        cutout: '65%',
      },
    });
  }

  /* ---------------------------------------------------------
     RENDER: STATS + DASHBOARD WIDGETS
  --------------------------------------------------------- */
  function renderStats() {
    const total = outpassRecords.length;
    const pending = outpassRecords.filter(r => r.status === 'Pending').length;
    const approved = outpassRecords.filter(r => r.status === 'Approved').length;
    const rejected = outpassRecords.filter(r => r.status === 'Rejected').length;
    const completed = outpassRecords.filter(r => r.status === 'Completed').length;
    const outside = outpassRecords.filter(isOutside).length;
    const overdue = outpassRecords.filter(isOverdue).length;
    const returnedTodayCount = outpassRecords.filter(returnedToday).length;

    animateCounter(document.querySelector('[data-counter="total"]'), total);
    animateCounter(document.querySelector('[data-counter="pending"]'), pending);
    animateCounter(document.querySelector('[data-counter="approved"]'), approved);
    animateCounter(document.querySelector('[data-counter="rejected"]'), rejected);
    animateCounter(document.querySelector('[data-counter="outside"]'), outside);
    animateCounter(document.querySelector('[data-counter="returnedToday"]'), returnedTodayCount);

    document.getElementById('welcomeOverdue').textContent = overdue;
    document.getElementById('navPendingBadge').textContent = pending;
    document.getElementById('navOutsideBadge').textContent = outside;
    document.getElementById('overdueCountBadge').textContent = `${overdue} Overdue`;

    renderChart({ pending, approved, rejected, completed });
  }

  function renderDashOutsideList() {
    const list = document.getElementById('dashOutsideList');
    const items = outpassRecords.filter(isOutside).slice(0, 5);
    if (!items.length) {
      list.innerHTML = `<li style="color:#666;font-size:13px;border:none;padding:0;">No students are currently outside.</li>`;
      return;
    }
    list.innerHTML = items.map(r => `
      <li>
        <span>${r.name} · ${r.room}</span>
        ${outsideBadge(outsideSubStatus(r))}
      </li>
    `).join('');
  }

  function renderRecentRequests() {
    const tbody = document.querySelector('#recentRequestsTable tbody');
    const items = [...outpassRecords].sort((a, b) => b.requestedAt - a.requestedAt).slice(0, 5);
    tbody.innerHTML = items.map(r => `
      <tr>
        <td>${r.id}</td>
        <td>${r.name}</td>
        <td>${r.regNo}</td>
        <td>${r.dept}</td>
        <td>${r.destination}</td>
        <td>${fmtDate(r.outDT)}</td>
        <td>${statusBadge(r.status)}</td>
        <td><button class="table-action-btn" title="View Details" data-view="${r.id}"><i class="fa-solid fa-eye"></i></button></td>
      </tr>
    `).join('');
  }

  /* ---------------------------------------------------------
     REQUESTS PAGE: FILTERS + PAGINATION
  --------------------------------------------------------- */
  const reqState = { page: 1, pageSize: 6 };

  function populateFilterOptions() {
    const deptSel = document.getElementById('reqDeptFilter');
    departments.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d; opt.textContent = d;
      deptSel.appendChild(opt);
    });
    const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
    const yearSel = document.getElementById('reqYearFilter');
    years.forEach(y => {
      const opt = document.createElement('option');
      opt.value = y; opt.textContent = y;
      yearSel.appendChild(opt);
    });
  }

  function getFilteredRequests() {
    const q = (document.getElementById('reqSearch').value || '').toLowerCase().trim();
    const dept = document.getElementById('reqDeptFilter').value;
    const year = document.getElementById('reqYearFilter').value;
    const status = document.getElementById('reqStatusFilter').value;
    const dateVal = document.getElementById('reqDateFilter').value;
    const sort = document.getElementById('reqSort').value;

    let list = outpassRecords.filter(r => {
      const matchesQ = !q || r.name.toLowerCase().includes(q) || r.regNo.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
      const matchesDept = !dept || r.dept === dept;
      const matchesYear = !year || r.year === year;
      const matchesStatus = !status || r.status === status;
      const matchesDate = !dateVal || r.outDT.toISOString().slice(0, 10) === dateVal;
      return matchesQ && matchesDept && matchesYear && matchesStatus && matchesDate;
    });

    if (sort === 'latest') list.sort((a, b) => b.requestedAt - a.requestedAt);
    else if (sort === 'oldest') list.sort((a, b) => a.requestedAt - b.requestedAt);
    else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }

  function renderRequestsTable() {
    const tbody = document.getElementById('requestsTbody');
    const emptyState = document.getElementById('requestsEmptyState');
    const filtered = getFilteredRequests();

    const totalPages = Math.max(1, Math.ceil(filtered.length / reqState.pageSize));
    reqState.page = Math.min(reqState.page, totalPages);
    const startIdx = (reqState.page - 1) * reqState.pageSize;
    const pageItems = filtered.slice(startIdx, startIdx + reqState.pageSize);

    tbody.innerHTML = pageItems.map(r => `
      <tr>
        <td>${r.id}</td>
        <td><div class="table-photo avatar-initials">${r.initials}</div></td>
        <td>${r.name}</td>
        <td>${r.regNo}</td>
        <td>${r.dept}</td>
        <td>${r.year}</td>
        <td>${r.room}</td>
        <td>${r.block}</td>
        <td>${r.purpose}</td>
        <td>${r.destination}</td>
        <td>${fmtDate(r.outDT)}</td>
        <td>${fmtTime(r.outDT)}</td>
        <td>${fmtDate(r.retDT)}</td>
        <td>${fmtTime(r.retDT)}</td>
        <td>${r.parentMobile}</td>
        <td>${statusBadge(r.status)}</td>
        <td><button class="table-action-btn" title="View Details" data-view="${r.id}"><i class="fa-solid fa-eye"></i></button></td>
      </tr>
    `).join('');

    emptyState.style.display = filtered.length ? 'none' : 'block';

    document.getElementById('reqPaginationInfo').textContent =
      filtered.length ? `Showing ${startIdx + 1}–${Math.min(startIdx + reqState.pageSize, filtered.length)} of ${filtered.length}` : 'Showing 0 of 0';

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    const controls = document.getElementById('reqPaginationControls');
    let html = `<button class="page-btn" id="prevPageBtn" ${reqState.page === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>`;
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="page-btn ${i === reqState.page ? 'active' : ''}" data-page-num="${i}">${i}</button>`;
    }
    html += `<button class="page-btn" id="nextPageBtn" ${reqState.page === totalPages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>`;
    controls.innerHTML = html;

    document.getElementById('prevPageBtn')?.addEventListener('click', () => { reqState.page--; renderRequestsTable(); });
    document.getElementById('nextPageBtn')?.addEventListener('click', () => { reqState.page++; renderRequestsTable(); });
    controls.querySelectorAll('[data-page-num]').forEach(btn => {
      btn.addEventListener('click', () => { reqState.page = parseInt(btn.dataset.pageNum, 10); renderRequestsTable(); });
    });
  }

  ['reqSearch', 'reqDeptFilter', 'reqYearFilter', 'reqStatusFilter', 'reqDateFilter', 'reqSort'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => { reqState.page = 1; renderRequestsTable(); });
    document.getElementById(id).addEventListener('change', () => { reqState.page = 1; renderRequestsTable(); });
  });

  /* ---------------------------------------------------------
     OUTSIDE PAGE
  --------------------------------------------------------- */
  function renderOutsideTable() {
    const tbody = document.getElementById('outsideTbody');
    const emptyState = document.getElementById('outsideEmptyState');
    const items = outpassRecords.filter(isOutside);

    tbody.innerHTML = items.map(r => {
      const sub = outsideSubStatus(r);
      return `
      <tr class="${sub === 'Overdue' ? 'row-overdue' : ''}">
        <td>${r.name}</td>
        <td>${r.dept}</td>
        <td>${r.year}</td>
        <td>${r.room}</td>
        <td>${fmtTime(r.outDT)}</td>
        <td>${fmtDate(r.retDT)}, ${fmtTime(r.retDT)}</td>
        <td>${outsideBadge(sub)}</td>
        <td>
          <button class="table-action-btn" title="View Details" data-view="${r.id}"><i class="fa-solid fa-eye"></i></button>
          <button class="table-action-btn act--return" title="Mark Returned" data-return="${r.id}"><i class="fa-solid fa-door-open"></i></button>
        </td>
      </tr>`;
    }).join('');

    emptyState.style.display = items.length ? 'none' : 'block';
  }

  function markReturned(id) {
    const r = outpassRecords.find(x => x.id === id);
    if (!r) return;
    r.status = 'Completed';
    r.returnedDT = new Date();
    r.remarks = (r.remarks ? r.remarks + ' ' : '') + 'Returned to hostel and verified at the gate.';
    showToast(`${r.name} marked as returned.`, 'success', 'fa-door-open');
    pushNotification({
      icon: 'fa-door-open', type: 'return',
      title: 'Student returned',
      text: `${r.name}'s outpass has been closed after verifying their return.`,
    });
    renderAll();
  }

  /* ---------------------------------------------------------
     HISTORY PAGE
  --------------------------------------------------------- */
  function renderHistory() {
    const tbody = document.getElementById('historyTbody');
    const emptyState = document.getElementById('historyEmptyState');
    const q = (document.getElementById('historySearch').value || '').toLowerCase().trim();
    const statusVal = document.getElementById('historyStatusFilter').value;
    const dateVal = document.getElementById('historyDateFilter').value;

    const filtered = outpassRecords.filter(r => {
      const matchesQ = !q || [r.name, r.regNo, r.purpose].some(f => f.toLowerCase().includes(q));
      const matchesStatus = !statusVal || r.status === statusVal;
      const matchesDate = !dateVal || r.outDT.toISOString().slice(0, 10) === dateVal;
      return matchesQ && matchesStatus && matchesDate;
    }).sort((a, b) => b.requestedAt - a.requestedAt);

    tbody.innerHTML = filtered.map(r => {
      const returnStatus = r.status === 'Completed' ? `Returned ${fmtDate(r.returnedDT)}` :
                            isOverdue(r) ? 'Overdue' :
                            isOutside(r) ? 'Still Outside' :
                            r.status === 'Rejected' ? '—' : 'Not yet due';
      return `
      <tr>
        <td>${r.id}</td>
        <td>${r.name} (${r.regNo})</td>
        <td>${fmtDate(r.outDT)}</td>
        <td>${r.purpose}</td>
        <td>${statusBadge(r.status)}</td>
        <td>${r.approvedBy}</td>
        <td>${returnStatus}</td>
        <td>${r.remarks || '—'}</td>
      </tr>`;
    }).join('');

    emptyState.style.display = filtered.length ? 'none' : 'block';
  }

  document.getElementById('historySearch').addEventListener('input', renderHistory);
  document.getElementById('historyStatusFilter').addEventListener('change', renderHistory);
  document.getElementById('historyDateFilter').addEventListener('change', renderHistory);

  document.getElementById('exportPdfBtn').addEventListener('click', () => showToast('Preparing PDF export…', 'success', 'fa-file-pdf'));
  document.getElementById('exportExcelBtn').addEventListener('click', () => showToast('Preparing Excel export…', 'success', 'fa-file-excel'));
  document.getElementById('exportCsvBtn').addEventListener('click', () => showToast('Preparing CSV export…', 'success', 'fa-file-csv'));

  /* ---------------------------------------------------------
     REPORTS PAGE
  --------------------------------------------------------- */
  document.querySelectorAll('.report-generate-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast(`Generating ${btn.dataset.report} Outpass Report…`, 'success', 'fa-chart-column');
    });
  });
  ['reportsExportPdf', 'reportsExportExcel', 'reportsExportCsv'].forEach(id => {
    document.getElementById(id).addEventListener('click', () => showToast('Preparing export…', 'success', 'fa-download'));
  });

  /* ---------------------------------------------------------
     NOTIFICATIONS PAGE
  --------------------------------------------------------- */
  function renderNotifications() {
    const list = document.getElementById('notifList');
    const iconClassMap = {
      approved: 'notif-icon--approved',
      rejected: 'notif-icon--rejected',
      reminder: 'notif-icon--reminder',
      new: 'notif-icon--new',
      warning: 'notif-icon--warning',
      return: 'notif-icon--return',
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

    const unreadCount = notifications.filter(n => n.unread).length;
    const navBadge = document.getElementById('navNotifBadge');
    navBadge.textContent = unreadCount;
    navBadge.style.display = unreadCount ? 'inline-flex' : 'none';
    document.getElementById('bellDot').style.display = unreadCount ? 'block' : 'none';
  }

  document.getElementById('markAllReadBtn').addEventListener('click', () => {
    notifications.forEach(n => n.unread = false);
    renderNotifications();
    showToast('All notifications marked as read', 'success', 'fa-check-double');
  });

  document.getElementById('notifBellBtn').addEventListener('click', () => goToPage('notifications'));

  /* ---------------------------------------------------------
     VIEW / APPROVAL MODAL
  --------------------------------------------------------- */
  const modal = document.getElementById('viewModal');
  let activeRecordId = null;

  function openModal(id) {
    const r = outpassRecords.find(x => x.id === id);
    if (!r) return;
    activeRecordId = id;

    document.getElementById('modalPhoto').textContent = r.initials;
    document.getElementById('modalName').textContent = r.name;
    document.getElementById('modalMeta').textContent = `${r.id} · ${r.regNo} · ${r.dept}, ${r.year}`;
    document.getElementById('modalStatusBadge').innerHTML = statusBadge(r.status).replace(/^<span class="badge[^"]*">|<\/span>$/g, '');
    document.getElementById('modalStatusBadge').className = 'badge ' + (
      { Approved: 'badge--approved', Pending: 'badge--pending', Rejected: 'badge--rejected', Completed: 'badge--completed' }[r.status] || ''
    );

    document.getElementById('dRegNo').textContent = r.regNo;
    document.getElementById('dDept').textContent = r.dept;
    document.getElementById('dYear').textContent = r.year;
    document.getElementById('dRoom').textContent = r.room;
    document.getElementById('dBlock').textContent = r.block;
    document.getElementById('dMobile').textContent = r.mobile;
    document.getElementById('dParentName').textContent = r.parentName;
    document.getElementById('dParentMobile').textContent = r.parentMobile;

    document.getElementById('dPurpose').textContent = r.purpose;
    document.getElementById('dDestination').textContent = r.destination;
    document.getElementById('dOut').textContent = `${fmtDate(r.outDT)}, ${fmtTime(r.outDT)}`;
    document.getElementById('dReturn').textContent = `${fmtDate(r.retDT)}, ${fmtTime(r.retDT)}`;
    document.getElementById('dStudentRemarks').textContent = r.studentRemarks || '—';
    document.getElementById('dDocument').textContent = r.hasDoc ? 'Supporting document attached (medical_note.pdf)' : 'No supporting document uploaded.';

    document.getElementById('adminRemarkInput').value = r.status === 'Pending' ? '' : r.remarks || '';

    modal.classList.add('show');
  }

  function closeModal() {
    modal.classList.remove('show');
    activeRecordId = null;
  }

  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  function actOnRequest(newStatus, verb) {
    const r = outpassRecords.find(x => x.id === activeRecordId);
    if (!r) return;
    const remark = document.getElementById('adminRemarkInput').value.trim();
    r.status = newStatus;
    r.approvedBy = 'Mrs. Kavitha Rao';
    r.remarks = remark || (
      newStatus === 'Approved' ? 'Approved. Please carry your ID card.' :
      newStatus === 'Rejected' ? 'Request rejected by hostel administration.' :
      'Request is currently under review.'
    );

    const notifText = {
      Approved: 'Your Outpass Request has been approved by the Hostel Administration.',
      Rejected: 'Your Outpass Request has been rejected. Please check the remarks provided by the Admin.',
      Pending: 'Your Outpass Request is currently under review.',
    }[newStatus];

    pushNotification({
      icon: newStatus === 'Approved' ? 'fa-circle-check' : newStatus === 'Rejected' ? 'fa-circle-xmark' : 'fa-hourglass-half',
      type: newStatus === 'Approved' ? 'approved' : newStatus === 'Rejected' ? 'rejected' : 'reminder',
      title: `Request ${verb}`,
      text: `${r.name}: ${notifText}`,
    });

    showToast(`Outpass ${verb} for ${r.name}. Student notified.`, newStatus === 'Rejected' ? 'error' : 'success',
      newStatus === 'Approved' ? 'fa-circle-check' : newStatus === 'Rejected' ? 'fa-circle-xmark' : 'fa-hourglass-half');

    closeModal();
    renderAll();
  }

  document.getElementById('approveBtn').addEventListener('click', () => actOnRequest('Approved', 'approved'));
  document.getElementById('rejectBtn').addEventListener('click', () => actOnRequest('Rejected', 'rejected'));
  document.getElementById('pendingBtn').addEventListener('click', () => actOnRequest('Pending', 'kept pending'));

  /* Delegate all [data-view] / [data-return] clicks anywhere in the document */
  document.addEventListener('click', e => {
    const viewBtn = e.target.closest('[data-view]');
    if (viewBtn) { openModal(viewBtn.dataset.view); return; }
    const returnBtn = e.target.closest('[data-return]');
    if (returnBtn) { markReturned(returnBtn.dataset.return); return; }
  });

  /* ---------------------------------------------------------
     GLOBAL SEARCH (topbar) -> jumps to Requests page
  --------------------------------------------------------- */
  document.getElementById('globalSearch').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = e.target.value;
      goToPage('requests');
      document.getElementById('reqSearch').value = val;
      reqState.page = 1;
      renderRequestsTable();
    }
  });

  /* ---------------------------------------------------------
     SPA NAVIGATION
  --------------------------------------------------------- */
  function goToPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${pageId}`)?.classList.add('active');
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
      item.classList.toggle('active', item.dataset.page === pageId);
    });
    closeSidebarOnMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  window.goToPage = goToPage;

  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      goToPage(item.dataset.page);
    });
  });

  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', () => {
      goToPage(el.dataset.goto);
      if (el.dataset.filterStatus) {
        document.getElementById('reqStatusFilter').value = el.dataset.filterStatus;
        reqState.page = 1;
        renderRequestsTable();
      }
    });
  });

  /* ---------------------------------------------------------
     SIDEBAR TOGGLE (mobile hamburger + overlay)
  --------------------------------------------------------- */
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const hamburgerBtn = document.getElementById('hamburgerBtn');

  function openSidebar() { sidebar.classList.add('open'); overlay.classList.add('show'); }
  function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('show'); }
  function closeSidebarOnMobile() { if (window.innerWidth <= 992) closeSidebar(); }

  hamburgerBtn.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  overlay.addEventListener('click', closeSidebar);
  window.addEventListener('resize', () => { if (window.innerWidth > 992) closeSidebar(); });

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
     LOGOUT
  --------------------------------------------------------- */
  ['logoutBtn', 'dropdownLogout'].forEach(id => {
    document.getElementById(id).addEventListener('click', e => {
      e.preventDefault();
      showToast('Logging you out…', 'success', 'fa-right-from-bracket');
    });
  });

  /* ---------------------------------------------------------
     LIVE DATE & TIME
  --------------------------------------------------------- */
  const clockTime = document.getElementById('clockTime');
  const clockDate = document.getElementById('clockDate');
  const welcomeTime = document.getElementById('welcomeTime');

  function tickClock() {
    const t = new Date();
    const timeStr = t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const dateStr = t.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    clockTime.textContent = timeStr;
    clockDate.textContent = dateStr;
    welcomeTime.textContent = timeStr;
  }
  tickClock();
  setInterval(tickClock, 1000);

  /* Re-check overdue status every 30s so rows/badges update live */
  setInterval(renderAll, 30000);

  /* ---------------------------------------------------------
     RENDER ALL
  --------------------------------------------------------- */
  function renderAll() {
    renderStats();
    renderDashOutsideList();
    renderRecentRequests();
    renderRequestsTable();
    renderOutsideTable();
    renderHistory();
  }

  /* ---------------------------------------------------------
     INIT
  --------------------------------------------------------- */
  populateFilterOptions();
  renderAll();
  renderNotifications();

})();
