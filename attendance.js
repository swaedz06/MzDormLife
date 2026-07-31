// ========================================
// SMART HOSTEL 360
// STUDENT ATTENDANCE MODULE
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // ===========================
    // SIDEBAR
    // ===========================

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

    if(menuBtn) menuBtn.onclick = openSidebar;
    if(closeBtn) closeBtn.onclick = closeSidebar;
    if(overlay) overlay.onclick = closeSidebar;


    // ===========================
    // TEST REMINDER ALARM
    // ===========================

    function playTestAlarm() {

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        let beepCount = 0;

        function beep() {

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = "sine";
            oscillator.frequency.value = 1000;

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start();

            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

            oscillator.stop(audioContext.currentTime + 0.3);

            beepCount++;

            if (beepCount < 9) {
                setTimeout(beep, 500);
            }

        }

        beep();

    }
    // ===========================
    // LIVE CLOCK
    // ===========================

    function updateClock(){

        const now = new Date();

        document.getElementById("clock").innerHTML =
        now.toLocaleTimeString("en-IN",{

            hour:"2-digit",
            minute:"2-digit",
            second:"2-digit"

        });

    }

    updateClock();

    setInterval(updateClock,1000);

    // ===========================
    // COUNTDOWN
    // ===========================

    function updateCountdown(){

        const countdown = document.getElementById("countdownTimer");

        if(!countdown) return;

        const now = new Date();

        let target = new Date();

        if(now.getHours()<8){

            target.setHours(8,0,0);

        }

        else if(now.getHours()<20){

            target.setHours(20,0,0);

        }

        else{

            target.setDate(target.getDate()+1);

            target.setHours(8,0,0);

        }

        let diff = target-now;

        const h=Math.floor(diff/1000/60/60);

        diff-=h*1000*60*60;

        const m=Math.floor(diff/1000/60);

        diff-=m*1000*60;

        const s=Math.floor(diff/1000);

        countdown.innerHTML=

        `${String(h).padStart(2,'0')}:
         ${String(m).padStart(2,'0')}:
         ${String(s).padStart(2,'0')}`;

    }

    updateCountdown();

    setInterval(updateCountdown,1000);

    // ===========================
    // GPS ATTENDANCE
    // ===========================

    const attendanceBtn=document.getElementById("markAttendance");

    if(attendanceBtn){

        attendanceBtn.onclick=function(){

            if(!navigator.geolocation){

                alert("GPS is not supported on this device.");

                return;

            }

            attendanceBtn.innerHTML="Getting Location...";

            navigator.geolocation.getCurrentPosition(

                function(position){

                    const lat=position.coords.latitude;
                    const lng=position.coords.longitude;
                    const accuracy=position.coords.accuracy;

                    // Demo Hostel Coordinates
                    const hostelLat=10.294561;
                    const hostelLng=78.764815;
                function getDistance(lat1, lon1, lat2, lon2){

    const R = 6371000; // Earth radius in meters

    const dLat = (lat2-lat1) * Math.PI/180;

    const dLon = (lon2-lon1) * Math.PI/180;

    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1*Math.PI/180) *
        Math.cos(lat2*Math.PI/180) *
        Math.sin(dLon/2) *
        Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;

}

const distance = getDistance(
    lat,
    lng,
    hostelLat,
    hostelLng
);

                    if(distance<=300){

                        alert(

`Attendance Recorded Successfully

GPS Verified

Latitude : ${lat.toFixed(6)}

Longitude : ${lng.toFixed(6)}

Accuracy : ${accuracy.toFixed(0)} m`

                        );

                    }

                    else{

                        alert(

`Attendance Rejected

You are outside the hostel campus.

Distance : ${distance.toFixed(0)} meters`

                        );

                    }

                    attendanceBtn.innerHTML=

                    `<i class="fa-solid fa-location-dot"></i>

                    Mark Attendance (GPS)`;

                },

                function(){

                    attendanceBtn.innerHTML=

                    `<i class="fa-solid fa-location-dot"></i>

                    Mark Attendance (GPS)`;

                    alert("Unable to access GPS.");

                }

            );

        }

    }

    // ===========================
    // CHART
    // ===========================

    const ctx=document.getElementById("attendanceChart");

    if(ctx){

        new Chart(ctx,{

            type:"line",

            data:{

                labels:["Week 1","Week 2","Week 3","Week 4"],

                datasets:[{

                    label:"Attendance %",

                    data:[94,95,96,97],

                    borderColor:"#0056d6",

                    backgroundColor:"rgba(0,86,214,.15)",

                    fill:true,

                    tension:.4

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                plugins:{

                    legend:{

                        display:false

                    }

                },

                scales:{

                    y:{

                        beginAtZero:false,

                        min:70,

                        max:100

                    }

                }

            }

        });

    }

   // ===========================
// QUICK ACTIONS
// ===========================


document.querySelectorAll(".action-card").forEach(card => {

    card.addEventListener("click", function () {

        const title = this.querySelector("h4").textContent.trim();

        switch(title){

            case "Attendance Rules":

                rulesModal.classList.add("active");
                break;

            case "Attendance History":

                document.querySelector(".history-section")
                .scrollIntoView({
                    behavior:"smooth"
                });
                break;

            case "Attendance Correction":

                document.querySelector(".correction-section")
                .scrollIntoView({
                    behavior:"smooth"
                });
                break;

            case "Test Reminder":

                playTestAlarm();
                alert("Attendance Reminder Demo Started!");
                break;

            default:

                alert(title);

        }

    });

});

// Close Buttons

closeRules.onclick = function(){

    rulesModal.classList.remove("active");

};

// Close by clicking outside

window.onclick = function(e){

    
    if(e.target === rulesModal){

        rulesModal.classList.remove("active");

    }

};

    // ===========================
    // CORRECTION FORM
    // ===========================

    const form=document.querySelector(".correction-form");

    if(form){

        form.onsubmit=function(e){

            e.preventDefault();

            alert(

"Attendance correction request submitted successfully."

            );

            form.reset();

        }

    }

    // ===========================
    // NOTIFICATION
    // ===========================

    const notification=document.querySelector(".notification");

    if(notification){

        notification.onclick=function(){

            alert(

`Attendance Notifications

• Morning Attendance Recorded

• Night Attendance starts at 8:00 PM

• GPS Verification Successful

• Attendance 96%`

            );

        }

    }

});