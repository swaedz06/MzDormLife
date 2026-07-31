// ======================================
// SMART HOSTEL 360 - ADMIN DASHBOARD
// dashboard.js
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // Mobile Sidebar
    // ==========================

    const menuBtn = document.getElementById("menuBtn");
    const closeBtn = document.getElementById("closeBtn");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    if(menuBtn){

        menuBtn.addEventListener("click",()=>{

            sidebar.classList.add("active");
            overlay.classList.add("active");

        });

    }

    if(closeBtn){

        closeBtn.addEventListener("click",closeSidebar);

    }

    if(overlay){

        overlay.addEventListener("click",closeSidebar);

    }

    function closeSidebar(){

        sidebar.classList.remove("active");
        overlay.classList.remove("active");

    }

    // Close sidebar when a menu item is clicked on mobile
    document.querySelectorAll(".menu li").forEach(item=>{

        item.addEventListener("click",()=>{

            if(window.innerWidth<=992){

                closeSidebar();

            }

        });

    });


    // ==========================
    // Counter Animation
    // ==========================

    function counter(id,target){

        const element=document.getElementById(id);

        if(!element) return;

        let count=0;

        let speed=Math.max(1,target/80);

        const timer=setInterval(()=>{

            count+=speed;

            if(count>=target){

                count=target;

                clearInterval(timer);

            }

            element.innerText=Math.floor(count);

        },20);

    }

    counter("students",1240);
    counter("present",1182);
    counter("leave",15);
    counter("complaints",8);


    // ==========================
    // Live Date & Time
    // ==========================

    function updateClock(){

        const now=new Date();

        const date=document.getElementById("currentDate");
        const time=document.getElementById("currentTime");

        if(date){

            date.innerHTML=now.toLocaleDateString("en-IN",{

                weekday:"long",
                day:"numeric",
                month:"long",
                year:"numeric"

            });

        }

        if(time){

            time.innerHTML=now.toLocaleTimeString();

        }

    }

    updateClock();

    setInterval(updateClock,1000);


    // ==========================
    // Search Demo
    // ==========================

    const search=document.querySelector(".search-box input");

    if(search){

        search.addEventListener("keyup",()=>{

            console.log("Searching :",search.value);

        });

    }


    // ==========================
    // Notification
    // ==========================

    const bell=document.querySelector(".notification");

    if(bell){

        bell.addEventListener("click",()=>{

            alert(

`Notifications

• 3 New Leave Requests

• 2 Emergency SOS Alerts

• 5 Complaints Pending

• Laundry Updated

• Mess Attendance Submitted`

);

        });

    }


    // ==========================
    // Quick Actions
    // ==========================

    document.querySelectorAll(".action-card").forEach(card=>{

        card.addEventListener("click",()=>{

            alert(card.innerText);

        });

    });

});


// ======================================
// Attendance Chart
// ======================================

const attendance=document.getElementById("attendanceChart");

if(attendance){

new Chart(attendance,{

type:"bar",

data:{

labels:["Present","Absent","Leave"],

datasets:[{

data:[1182,42,16],

backgroundColor:[
"#2563eb",
"#ef4444",
"#f59e0b"
],

borderRadius:10

}]

},

options:{

responsive:true,

plugins:{

legend:{
display:false
}

}

}

});

}


// ======================================
// Department Chart
// ======================================

const department=document.getElementById("departmentChart");

if(department){

new Chart(department,{

type:"doughnut",

data:{

labels:[
"CSE",
"AI & DS",
"ECE",
"EEE",
"MECH",
"CIVIL"
],

datasets:[{

data:[
320,
180,
170,
150,
210,
210
],

backgroundColor:[

"#2563eb",
"#22c55e",
"#eab308",
"#ec4899",
"#06b6d4",
"#8b5cf6"

]

}]

},

options:{

responsive:true,

plugins:{

legend:{
position:"bottom"
}

}

}

});

}