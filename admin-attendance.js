/* =========================================================
   SMART HOSTEL 360
   ADMIN ATTENDANCE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       SAMPLE ATTENDANCE DATA
       Replace this later with database/API data
    ===================================================== */

    const attendanceData = [

        {
            id: 1,
            name: "Arun Kumar",
            roll: "23CSE101",
            department: "CSE",
            year: "III Year",
            room: "A-204",
            hostel: "Boys Hostel",
            session: "Morning",
            date: "2026-07-31",
            checkIn: "07:52 AM",
            checkOut: "-",
            status: "Present",
            gps: true,
            location: "Hostel Campus",
            distance: "42 m",
            accuracy: "8 m",
            remarks: "Verified successfully"
        },

        {
            id: 2,
            name: "Adhi",
            roll: "23CSE108",
            department: "CSE",
            year: "III Year",
            room: "A-208",
            hostel: "Boys Hostel",
            session: "Morning",
            date: "2026-07-31",
            checkIn: "07:58 AM",
            checkOut: "-",
            status: "Present",
            gps: true,
            location: "Hostel Campus",
            distance: "65 m",
            accuracy: "10 m",
            remarks: "GPS verified"
        },

        {
            id: 3,
            name: "Dinesh Raj",
            roll: "24ECE034",
            department: "ECE",
            year: "II Year",
            room: "B-105",
            hostel: "Boys Hostel",
            session: "Morning",
            date: "2026-07-31",
            checkIn: "08:05 AM",
            checkOut: "-",
            status: "Present",
            gps: true,
            location: "Hostel Campus",
            distance: "91 m",
            accuracy: "12 m",
            remarks: "Late attendance"
        },

        {
            id: 4,
            name: "Karthik S",
            roll: "23ME045",
            department: "MECH",
            year: "III Year",
            room: "C-301",
            hostel: "Boys Hostel",
            session: "Morning",
            date: "2026-07-31",
            checkIn: "-",
            checkOut: "-",
            status: "Absent",
            gps: false,
            location: "Not Available",
            distance: "-",
            accuracy: "-",
            remarks: "Attendance not recorded"
        },

        {
            id: 5,
            name: "Rahul Prakash",
            roll: "24CIV021",
            department: "CIVIL",
            year: "II Year",
            room: "C-212",
            hostel: "Boys Hostel",
            session: "Morning",
            date: "2026-07-31",
            checkIn: "-",
            checkOut: "-",
            status: "Leave",
            gps: false,
            location: "Not Available",
            distance: "-",
            accuracy: "-",
            remarks: "Approved medical leave"
        },

        {
            id: 6,
            name: "Vishnu V",
            roll: "23CSE119",
            department: "CSE",
            year: "III Year",
            room: "A-212",
            hostel: "Boys Hostel",
            session: "Morning",
            date: "2026-07-31",
            checkIn: "07:49 AM",
            checkOut: "-",
            status: "Present",
            gps: true,
            location: "Hostel Campus",
            distance: "38 m",
            accuracy: "7 m",
            remarks: "Verified successfully"
        },

        {
            id: 7,
            name: "Mohamed Ashik",
            roll: "24IT012",
            department: "IT",
            year: "II Year",
            room: "D-103",
            hostel: "Boys Hostel",
            session: "Morning",
            date: "2026-07-31",
            checkIn: "08:11 AM",
            checkOut: "-",
            status: "Present",
            gps: true,
            location: "Hostel Campus",
            distance: "120 m",
            accuracy: "14 m",
            remarks: "Late attendance"
        },

        {
            id: 8,
            name: "Sanjay Kumar",
            roll: "23EEE056",
            department: "EEE",
            year: "III Year",
            room: "D-201",
            hostel: "Boys Hostel",
            session: "Morning",
            date: "2026-07-31",
            checkIn: "-",
            checkOut: "-",
            status: "Absent",
            gps: false,
            location: "Not Available",
            distance: "-",
            accuracy: "-",
            remarks: "Attendance not recorded"
        },

        /* NIGHT SESSION */

        {
            id: 9,
            name: "Arun Kumar",
            roll: "23CSE101",
            department: "CSE",
            year: "III Year",
            room: "A-204",
            hostel: "Boys Hostel",
            session: "Night",
            date: "2026-07-31",
            checkIn: "08:02 PM",
            checkOut: "-",
            status: "Present",
            gps: true,
            location: "Hostel Campus",
            distance: "46 m",
            accuracy: "9 m",
            remarks: "Night attendance verified"
        },

        {
            id: 10,
            name: "Adhi",
            roll: "23CSE108",
            department: "CSE",
            year: "III Year",
            room: "A-208",
            hostel: "Boys Hostel",
            session: "Night",
            date: "2026-07-31",
            checkIn: "08:07 PM",
            checkOut: "-",
            status: "Present",
            gps: true,
            location: "Hostel Campus",
            distance: "71 m",
            accuracy: "11 m",
            remarks: "GPS verified"
        },

        {
            id: 11,
            name: "Dinesh Raj",
            roll: "24ECE034",
            department: "ECE",
            year: "II Year",
            room: "B-105",
            hostel: "Boys Hostel",
            session: "Night",
            date: "2026-07-31",
            checkIn: "-",
            checkOut: "-",
            status: "Absent",
            gps: false,
            location: "Not Available",
            distance: "-",
            accuracy: "-",
            remarks: "Attendance not recorded"
        },

        {
            id: 12,
            name: "Karthik S",
            roll: "23ME045",
            department: "MECH",
            year: "III Year",
            room: "C-301",
            hostel: "Boys Hostel",
            session: "Night",
            date: "2026-07-31",
            checkIn: "08:15 PM",
            checkOut: "-",
            status: "Present",
            gps: true,
            location: "Hostel Campus",
            distance: "105 m",
            accuracy: "13 m",
            remarks: "Late attendance"
        }

    ];


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const sidebar =
        document.getElementById("sidebar") ||
        document.querySelector(".sidebar");

    const overlay =
        document.getElementById("overlay") ||
        document.querySelector(".sidebar-overlay");

    const menuBtn =
        document.getElementById("menuBtn") ||
        document.querySelector(".menu-toggle");

    const closeBtn =
        document.getElementById("closeBtn") ||
        document.querySelector(".close-sidebar");


    /* =====================================================
       SIDEBAR
    ===================================================== */

    function openSidebar() {

        if (sidebar) {
            sidebar.classList.add("active");
        }

        if (overlay) {
            overlay.classList.add("active");
        }
    }


    function closeSidebar() {

        if (sidebar) {
            sidebar.classList.remove("active");
        }

        if (overlay) {
            overlay.classList.remove("active");
        }
    }


    if (menuBtn) {
        menuBtn.addEventListener("click", openSidebar);
    }


    if (closeBtn) {
        closeBtn.addEventListener("click", closeSidebar);
    }


    if (overlay) {
        overlay.addEventListener("click", closeSidebar);
    }


    /* =====================================================
       CLOSE SIDEBAR WHEN NAV ITEM IS CLICKED ON MOBILE
    ===================================================== */

    document.querySelectorAll(".nav-item").forEach(item => {

        item.addEventListener("click", function () {

            if (window.innerWidth <= 768) {
                closeSidebar();
            }

        });

    });


    /* =====================================================
       LIVE CLOCK
    ===================================================== */

    function updateClock() {

        const clock =
            document.getElementById("clock") ||
            document.querySelector(".clock");

        if (!clock) return;

        const now = new Date();

        clock.textContent =
            now.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });

    }


    updateClock();

    setInterval(updateClock, 1000);


    /* =====================================================
       DATE
    ===================================================== */

    const dateElement =
        document.getElementById("currentDate");

    if (dateElement) {

        const today = new Date();

        dateElement.textContent =
            today.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });

    }


    /* =====================================================
       DOM ELEMENTS
    ===================================================== */

    const tableBody =
        document.getElementById("attendanceTableBody") ||
        document.querySelector("#attendanceTable tbody");

    const searchInput =
        document.getElementById("attendanceSearch") ||
        document.querySelector(".top-search input") ||
        document.querySelector(".search-filter input");

    const departmentFilter =
        document.getElementById("departmentFilter");

    const yearFilter =
        document.getElementById("yearFilter");

    const statusFilter =
        document.getElementById("statusFilter");

    const sessionFilter =
        document.getElementById("sessionFilter");

    const clearFilterBtn =
        document.getElementById("clearFilters") ||
        document.querySelector(".clear-filter-btn");

    const refreshBtn =
        document.getElementById("refreshAttendance") ||
        document.getElementById("refreshBtn");


    /* =====================================================
       STATISTIC ELEMENTS
    ===================================================== */

    const totalStudents =
        document.getElementById("totalStudents");

    const presentCount =
        document.getElementById("presentCount");

    const absentCount =
        document.getElementById("absentCount");

    const leaveCount =
        document.getElementById("leaveCount");

    const attendancePercentage =
        document.getElementById("attendancePercentage");


    /* =====================================================
       CURRENT SESSION
    ===================================================== */

    let currentSession = "Morning";


    /* =====================================================
       GET FILTERED DATA
    ===================================================== */

    function getFilteredData() {

        const searchValue =
            searchInput ?
            searchInput.value.toLowerCase().trim() :
            "";

        const department =
            departmentFilter ?
            departmentFilter.value :
            "All";

        const year =
            yearFilter ?
            yearFilter.value :
            "All";

        const status =
            statusFilter ?
            statusFilter.value :
            "All";

        const session =
            sessionFilter ?
            sessionFilter.value :
            currentSession;


        return attendanceData.filter(student => {

            const matchesSearch =
                !searchValue ||

                student.name.toLowerCase().includes(searchValue) ||

                student.roll.toLowerCase().includes(searchValue) ||

                student.department.toLowerCase().includes(searchValue) ||

                student.year.toLowerCase().includes(searchValue) ||

                student.room.toLowerCase().includes(searchValue);


            const matchesDepartment =
                department === "All" ||
                student.department === department;


            const matchesYear =
                year === "All" ||
                student.year === year;


            const matchesStatus =
                status === "All" ||
                student.status === status;


            const matchesSession =
                session === "All" ||
                student.session === session;


            return (
                matchesSearch &&
                matchesDepartment &&
                matchesYear &&
                matchesStatus &&
                matchesSession
            );

        });

    }


    /* =====================================================
       RENDER TABLE
    ===================================================== */

    function renderTable(data) {

        if (!tableBody) return;

        tableBody.innerHTML = "";


        if (data.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="10"
                        style="
                            text-align:center;
                            padding:40px;
                            color:#8a94a6;
                        ">

                        <i class="fa-solid fa-user-slash"
                           style="
                               font-size:30px;
                               margin-bottom:10px;
                               display:block;
                           ">
                        </i>

                        No attendance records found.

                    </td>
                </tr>
            `;

            return;
        }


        data.forEach(student => {

            const initials =
                student.name
                    .split(" ")
                    .map(word => word.charAt(0))
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();


            let statusClass = "";

            if (student.status === "Present") {
                statusClass = "present";
            }

            else if (student.status === "Absent") {
                statusClass = "absent";
            }

            else if (student.status === "Leave") {
                statusClass = "leave";
            }


            const gpsHTML = student.gps

                ? `
                    <span class="gps-verified">
                        <i class="fa-solid fa-circle-check"></i>
                        Verified
                    </span>
                  `

                : `
                    <span class="gps-not-verified">
                        <i class="fa-solid fa-circle-xmark"></i>
                        Not Verified
                    </span>
                  `;


            const row = document.createElement("tr");


            row.innerHTML = `

                <td>

                    <div class="student-cell">

                        <div class="student-avatar">
                            ${initials}
                        </div>

                        <div>

                            <strong>
                                ${student.name}
                            </strong>

                            <span>
                                ${student.roll}
                            </span>

                        </div>

                    </div>

                </td>


                <td>
                    ${student.department}
                </td>


                <td>
                    ${student.year}
                </td>


                <td>
                    ${student.room}
                </td>


                <td>
                    ${student.session}
                </td>


                <td>
                    ${student.checkIn}
                </td>


                <td>

                    <span class="status-badge ${statusClass}">
                        ${student.status}
                    </span>

                </td>


                <td>
                    ${gpsHTML}
                </td>


                <td>
                    ${student.location}
                </td>


                <td>

                    <button
                        class="view-student-btn"
                        data-id="${student.id}"
                        title="View Student Details">

                        <i class="fa-solid fa-eye"></i>

                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        });


        attachViewButtons();

    }


    /* =====================================================
       UPDATE STATISTICS
    ===================================================== */

    function updateStatistics(data) {

        const total = data.length;

        const present =
            data.filter(
                student => student.status === "Present"
            ).length;

        const absent =
            data.filter(
                student => student.status === "Absent"
            ).length;

        const leave =
            data.filter(
                student => student.status === "Leave"
            ).length;


        const percentage =
            total > 0
                ? Math.round((present / total) * 100)
                : 0;


        if (totalStudents) {
            totalStudents.textContent = total;
        }


        if (presentCount) {
            presentCount.textContent = present;
        }


        if (absentCount) {
            absentCount.textContent = absent;
        }


        if (leaveCount) {
            leaveCount.textContent = leave;
        }


        if (attendancePercentage) {
            attendancePercentage.textContent =
                percentage + "%";
        }


        /* Also update any generic stat elements */

        const percentageElements =
            document.querySelectorAll(
                "[data-attendance-percentage]"
            );


        percentageElements.forEach(element => {

            element.textContent =
                percentage + "%";

        });

    }


    /* =====================================================
       REFRESH PAGE DATA
    ===================================================== */

    function refreshAttendance() {

        const button =
            refreshBtn;

        if (button) {

            const originalHTML =
                button.innerHTML;

            button.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Refreshing...
            `;

            button.disabled = true;


            setTimeout(() => {

                renderPage();

                button.innerHTML =
                    originalHTML;

                button.disabled = false;

            }, 700);

        }

        else {

            renderPage();

        }

    }


    if (refreshBtn) {

        refreshBtn.addEventListener(
            "click",
            refreshAttendance
        );

    }


    /* =====================================================
       FILTER EVENTS
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderPage
        );

    }


    if (departmentFilter) {

        departmentFilter.addEventListener(
            "change",
            renderPage
        );

    }


    if (yearFilter) {

        yearFilter.addEventListener(
            "change",
            renderPage
        );

    }


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            renderPage
        );

    }


    if (sessionFilter) {

        sessionFilter.addEventListener(
            "change",
            function () {

                currentSession =
                    this.value;

                renderPage();

            }
        );

    }


    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    if (clearFilterBtn) {

        clearFilterBtn.addEventListener(
            "click",
            function () {

                if (searchInput) {
                    searchInput.value = "";
                }

                if (departmentFilter) {
                    departmentFilter.value = "All";
                }

                if (yearFilter) {
                    yearFilter.value = "All";
                }

                if (statusFilter) {
                    statusFilter.value = "All";
                }

                if (sessionFilter) {
                    sessionFilter.value = "All";
                }

                currentSession = "All";

                renderPage();

            }
        );

    }


    /* =====================================================
       MORNING / NIGHT SESSION BUTTONS
    ===================================================== */

    document.querySelectorAll(".session-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(".session-btn")
                        .forEach(btn => {

                            btn.classList.remove(
                                "active"
                            );

                        });


                    this.classList.add("active");


                    const session =
                        this.dataset.session;


                    if (session) {

                        currentSession =
                            session;


                        if (sessionFilter) {

                            sessionFilter.value =
                                session;

                        }

                    }


                    renderPage();

                }
            );

        });


    /* =====================================================
       STUDENT DETAILS MODAL
    ===================================================== */

    function attachViewButtons() {

        document
            .querySelectorAll(".view-student-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            Number(
                                this.dataset.id
                            );


                        const student =
                            attendanceData.find(
                                item =>
                                    item.id === id
                            );


                        if (student) {

                            showStudentModal(
                                student
                            );

                        }

                    }
                );

            });

    }


    function showStudentModal(student) {

        let modal =
            document.getElementById(
                "studentDetailsModal"
            );


        /* Create modal if it doesn't exist */

        if (!modal) {

            modal =
                document.createElement("div");

            modal.id =
                "studentDetailsModal";

            modal.className =
                "modal-overlay";


            modal.innerHTML = `

                <div class="student-modal">

                    <button
                        class="modal-close"
                        id="modalClose">

                        <i class="fa-solid fa-xmark"></i>

                    </button>


                    <div
                        class="modal-header"
                        id="modalHeader">
                    </div>


                    <div
                        class="modal-grid"
                        id="modalDetails">
                    </div>

                </div>

            `;


            document.body.appendChild(modal);


            document
                .getElementById("modalClose")
                .addEventListener(
                    "click",
                    closeModal
                );


            modal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target === modal
                    ) {

                        closeModal();

                    }

                }
            );

        }


        const initials =
            student.name
                .split(" ")
                .map(word =>
                    word.charAt(0)
                )
                .slice(0, 2)
                .join("")
                .toUpperCase();


        document.getElementById(
            "modalHeader"
        ).innerHTML = `

            <div class="modal-avatar">
                ${initials}
            </div>

            <div>

                <h2>
                    ${student.name}
                </h2>

                <p>
                    ${student.roll} •
                    ${student.department} •
                    ${student.year}
                </p>

            </div>

        `;


        document.getElementById(
            "modalDetails"
        ).innerHTML = `

            <div class="detail-item">
                <span>Room Number</span>
                <strong>${student.room}</strong>
            </div>

            <div class="detail-item">
                <span>Hostel</span>
                <strong>${student.hostel}</strong>
            </div>

            <div class="detail-item">
                <span>Attendance Date</span>
                <strong>${student.date}</strong>
            </div>

            <div class="detail-item">
                <span>Session</span>
                <strong>${student.session}</strong>
            </div>

            <div class="detail-item">
                <span>Check-in Time</span>
                <strong>${student.checkIn}</strong>
            </div>

            <div class="detail-item">
                <span>Check-out Time</span>
                <strong>${student.checkOut}</strong>
            </div>

            <div class="detail-item">
                <span>Attendance Status</span>
                <strong>${student.status}</strong>
            </div>

            <div class="detail-item">
                <span>GPS Verification</span>
                <strong>
                    ${student.gps ? "Verified" : "Not Verified"}
                </strong>
            </div>

            <div class="detail-item">
                <span>Location</span>
                <strong>${student.location}</strong>
            </div>

            <div class="detail-item">
                <span>Distance from Hostel</span>
                <strong>${student.distance}</strong>
            </div>

            <div class="detail-item">
                <span>GPS Accuracy</span>
                <strong>${student.accuracy}</strong>
            </div>

            <div class="detail-item">
                <span>Remarks</span>
                <strong>${student.remarks}</strong>
            </div>

        `;


        modal.classList.add("active");

        document.body.style.overflow =
            "hidden";

    }


    function closeModal() {

        const modal =
            document.getElementById(
                "studentDetailsModal"
            );


        if (modal) {

            modal.classList.remove(
                "active"
            );

        }


        document.body.style.overflow = "";

    }


    /* =====================================================
       ESCAPE KEY CLOSE MODAL
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeModal();

                closeSidebar();

            }

        }
    );


    /* =====================================================
       NOTIFICATION BUTTON
    ===================================================== */

    const notificationBtn =
        document.querySelector(
            ".notification-btn"
        );


    if (notificationBtn) {

        notificationBtn.addEventListener(
            "click",
            function () {

                alert(
                    "You have new attendance notifications."
                );

            }
        );

    }


    /* =====================================================
       CSV EXPORT
    ===================================================== */

    const exportBtn =
        document.getElementById(
            "exportAttendance"
        );


    if (exportBtn) {

        exportBtn.addEventListener(
            "click",
            exportCSV
        );

    }


    function exportCSV() {

        const data =
            getFilteredData();


        if (data.length === 0) {

            alert(
                "No attendance records available to export."
            );

            return;

        }


        let csv =
            "Student Name,Roll Number,Department,Year,Room,Session,Date,Check In,Status,GPS Verification,Location,Distance,Accuracy,Remarks\n";


        data.forEach(student => {

            csv += [

                student.name,
                student.roll,
                student.department,
                student.year,
                student.room,
                student.session,
                student.date,
                student.checkIn,
                student.status,
                student.gps
                    ? "Verified"
                    : "Not Verified",
                student.location,
                student.distance,
                student.accuracy,
                student.remarks

            ]
                .map(value =>
                    `"${String(value)
                        .replace(/"/g, '""')}"`
                )
                .join(",") + "\n";

        });


        const blob =
            new Blob(
                [csv],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "hostel-attendance-report.csv";


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    }


    /* =====================================================
       RENDER EVERYTHING
    ===================================================== */

    function renderPage() {

        const filteredData =
            getFilteredData();


        renderTable(
            filteredData
        );


        updateStatistics(
            filteredData
        );


        updateRecordCount(
            filteredData.length
        );

    }


    /* =====================================================
       RECORD COUNT
    ===================================================== */

    function updateRecordCount(count) {

        const countElements =
            document.querySelectorAll(
                "[data-record-count]"
            );


        countElements.forEach(element => {

            element.textContent =
                count;

        });


        const tableCount =
            document.getElementById(
                "tableRecordCount"
            );


        if (tableCount) {

            tableCount.textContent =
                count + " records";

        }

    }


    /* =====================================================
       AUTO DETECT CURRENT ATTENDANCE SESSION
    ===================================================== */

    function detectSession() {

        const hour =
            new Date().getHours();


        /*
            Morning session:
            6 AM - 12 PM

            Night session:
            6 PM - 11:59 PM
        */


        if (
            hour >= 6 &&
            hour < 12
        ) {

            currentSession = "Morning";

        }

        else if (
            hour >= 18
        ) {

            currentSession = "Night";

        }

    }


    detectSession();


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    renderPage();


});