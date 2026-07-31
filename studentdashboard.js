// ==========================================
// SMART HOSTEL 360
// STUDENT DASHBOARD JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // SIDEBAR
    // ==========================

    const menuBtn = document.getElementById("menuBtn");
    const closeBtn = document.getElementById("closeBtn");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    function openSidebar() {
        sidebar.classList.add("active");
        overlay.classList.add("active");
    }

    function closeSidebar() {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
    }

    if (menuBtn) menuBtn.addEventListener("click", openSidebar);

    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);

    if (overlay) overlay.addEventListener("click", closeSidebar);

    // Close sidebar when menu clicked in mobile

    document.querySelectorAll(".sidebar li").forEach(item => {

        item.addEventListener("click", () => {

            if(window.innerWidth <= 992){

                closeSidebar();

            }

        });

    });

    // ==========================
    // LIVE CLOCK
    // ==========================

    function updateClock(){

        const now = new Date();

        const options = {

            hour:"2-digit",
            minute:"2-digit",
            second:"2-digit"

        };

        const clock = document.getElementById("clock");

        if(clock){

            clock.innerHTML = now.toLocaleTimeString("en-IN",options);

        }

    }

    updateClock();

    setInterval(updateClock,1000);

    // ==========================
    // SEARCH
    // ==========================

    const search = document.querySelector(".search input");

    if(search){

        search.addEventListener("keyup",()=>{

            console.log("Searching :",search.value);

        });

    }

    // ==========================
    // NOTIFICATION
    // ==========================

    const notification = document.querySelector(".notification");

    if(notification){

        notification.addEventListener("click",()=>{

            alert(

`Notifications

• Laundry Ready for Pickup - 4:00 PM

• Outpass Approved

• Tomorrow Breakfast at 7:00 AM

• New Hostel Announcement

• Complaint Updated`

);

        });

    }

    // ==========================
    // QUICK ACTIONS
    // ==========================

    document.querySelectorAll(".action-card").forEach(card=>{

        card.addEventListener("click",()=>{

            const title = card.querySelector("h4").innerText;

            alert(title);

        });

    });

    // ==========================
    // STATUS CARDS
    // ==========================

    document.querySelectorAll(".status-card").forEach(card=>{

        card.addEventListener("click",()=>{

            const title = card.querySelector("h3").innerText;

            alert(title);

        });

    });

    // ==========================
    // CALL BUTTONS
    // ==========================

    document.querySelectorAll(".contact button").forEach(btn=>{

        btn.addEventListener("click",()=>{

            alert("Calling...");

        });

    });

    // ==========================
    // PROFILE
    // ==========================

    const profile = document.querySelector(".profile");

    if(profile){

        profile.addEventListener("click",()=>{

            alert("Open Student Profile");

        });

    }

    // ==========================
    // FOOTER YEAR
    // ==========================

    const footer = document.querySelector(".footer p");

    if(footer){

        footer.innerHTML =
        `© ${new Date().getFullYear()} Smart Hostel 360 | Mount Zion College of Engineering & Technology`;

    }

});