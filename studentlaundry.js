/* ===========================================
   SMART HOSTEL 360
   STUDENT LAUNDRY PORTAL
=========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================
       DARK MODE
    ========================== */

    const themeBtn = document.getElementById("themeBtn");

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        if(document.body.classList.contains("dark")){

            themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';

            localStorage.setItem("theme","dark");

        }else{

            themeBtn.innerHTML='<i class="fa-solid fa-moon"></i>';

            localStorage.setItem("theme","light");

        }

    });

    if(localStorage.getItem("theme")=="dark"){

        document.body.classList.add("dark");

        themeBtn.innerHTML='<i class="fa-solid fa-sun"></i>';

    }

    /* ==========================
       TODAY DATE
    ========================== */

    const today = new Date();

    console.log(today.toDateString());

    /* ==========================
       TOAST NOTIFICATION
    ========================== */

    function showToast(message,color){

        const toast=document.createElement("div");

        toast.innerHTML=message;

        toast.style.position="fixed";
        toast.style.top="20px";
        toast.style.right="20px";
        toast.style.padding="15px 25px";
        toast.style.color="white";
        toast.style.background=color;
        toast.style.borderRadius="10px";
        toast.style.boxShadow="0 10px 25px rgba(0,0,0,.2)";
        toast.style.zIndex="9999";
        toast.style.animation="slide 0.5s";

        document.body.appendChild(toast);

        setTimeout(()=>{

            toast.remove();

        },3000);

    }

    /* ==========================
       STATUS SIMULATION
    ========================== */

    let status=document.getElementById("statusText");

    let progress=document.querySelector(".step.active p");

    let notify=document.querySelector(".notification h3");

    let notifyText=document.querySelector(".notification p");

    setTimeout(()=>{

        status.innerHTML="Completed";

        status.style.color="#16a34a";

        progress.innerHTML="Completed";

        notify.innerHTML="Laundry Ready";

        notifyText.innerHTML="Please collect your clothes between <b>4 PM - 6 PM</b>.";

        document.querySelector(".washing").innerHTML="🟢 Completed";

        document.querySelector(".washing").style.color="#16a34a";

        showToast("🎉 Laundry Completed","green");

    },15000);

    /* ==========================
       COUNTDOWN
    ========================== */

    const pickupHour=16;

    const countdown=document.createElement("h3");

    countdown.style.marginTop="15px";

    document.querySelector(".pickup-card").appendChild(countdown);

    function updateCountdown(){

        let now=new Date();

        let pickup=new Date();

        pickup.setHours(pickupHour);

        pickup.setMinutes(0);

        pickup.setSeconds(0);

        let diff=pickup-now;

        if(diff<=0){

            countdown.innerHTML="⏰ Pickup Time Started";

            countdown.style.color="green";

            return;

        }

        let hrs=Math.floor(diff/1000/60/60);

        let mins=Math.floor((diff/1000/60)%60);

        countdown.innerHTML="⏳ Time Remaining : "+hrs+" Hr "+mins+" Min";

        countdown.style.color="#2563eb";

    }

    updateCountdown();

    setInterval(updateCountdown,60000);

    /* ==========================
       TABLE HOVER
    ========================== */

    let rows=document.querySelectorAll("tbody tr");

    rows.forEach(row=>{

        row.addEventListener("click",()=>{

            rows.forEach(r=>r.style.background="");

            row.style.background="#DBEAFE";

        });

    });

    /* ==========================
       PROGRESS ANIMATION
    ========================== */

    const cards=document.querySelectorAll(".card");

    cards.forEach(card=>{

        card.addEventListener("mouseenter",()=>{

            card.style.transform="translateY(-10px) scale(1.03)";

        });

        card.addEventListener("mouseleave",()=>{

            card.style.transform="";

        });

    });

    /* ==========================
       PAGE LOAD
    ========================== */

    showToast("Welcome to Smart Hostel 360","#2563eb");

});