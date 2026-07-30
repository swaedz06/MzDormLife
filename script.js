/* ==========================================
   SMART HOSTEL 360
   Laundry Management JavaScript
========================================== */

// ==========================================
// Animated Statistics Counter
// ==========================================

document.querySelectorAll(".count").forEach(counter => {

    let target = parseInt(counter.dataset.target);
    let current = 0;

    let speed = Math.ceil(target / 100);

    let update = () => {

        current += speed;

        if(current < target){

            counter.innerHTML = current;

            requestAnimationFrame(update);

        }else{

            counter.innerHTML = target;

        }

    }

    update();

});


// ==========================================
// Theme Toggle
// ==========================================

const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        themeBtn.innerHTML="☀";

    }else{

        themeBtn.innerHTML="🌙";

    }

});


// ==========================================
// Scanner Simulation
// ==========================================

const scanBtn=document.getElementById("scanBtn");

scanBtn.addEventListener("click",()=>{

    scanBtn.innerHTML="Scanning...";

    scanBtn.disabled=true;

    showToast("Scanning Student ID Card");

    setTimeout(()=>{

        document.getElementById("studentPanel").style.display="flex";

        showToast("Student Verified Successfully");

        scanBtn.innerHTML="Scan Again";

        scanBtn.disabled=false;

    },2500);

});


// ==========================================
// Clothes Counter
// ==========================================

document.querySelectorAll(".plus").forEach(btn=>{

    btn.addEventListener("click",()=>{

        let input=btn.previousElementSibling;

        input.value=parseInt(input.value)+1;

        calculateTotal();

    });

});

document.querySelectorAll(".minus").forEach(btn=>{

    btn.addEventListener("click",()=>{

        let input=btn.nextElementSibling;

        if(parseInt(input.value)>0){

            input.value=parseInt(input.value)-1;

        }

        calculateTotal();

    });

});


// ==========================================
// Total Clothes
// ==========================================

function calculateTotal(){

    let total=0;

    document.querySelectorAll(".item input").forEach(input=>{

        total+=parseInt(input.value);

    });

    console.log("Total Clothes :",total);

}


// ==========================================
// Laundry Token
// ==========================================

document.getElementById("acceptLaundry").addEventListener("click",()=>{

    let token="LDR"+Math.floor(Math.random()*9000+1000);

    document.getElementById("token").innerHTML=token;

    showToast("Laundry Accepted");

});


// ==========================================
// Search Student
// ==========================================

const search=document.getElementById("searchStudent");

search.addEventListener("keyup",()=>{

    let value=search.value.toLowerCase();

    let student=document.querySelector(".student-info h2").innerText.toLowerCase();

    if(student.includes(value) || value===""){

        document.getElementById("studentPanel").style.display="flex";

    }else{

        document.getElementById("studentPanel").style.display="none";

    }

});


// ==========================================
// Notification Toast
// ==========================================

function showToast(message){

    let toast=document.createElement("div");

    toast.className="toast";

    toast.innerHTML=message;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("show");

    },100);

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },500);

    },3000);

}


// ==========================================
// Queue Row Hover Effect
// ==========================================

document.querySelectorAll(".queue tbody tr").forEach(row=>{

    row.addEventListener("mouseenter",()=>{

        row.style.background="#eef5ff";

    });

    row.addEventListener("mouseleave",()=>{

        row.style.background="white";

    });

});


// ==========================================
// Welcome Notification
// ==========================================

window.onload=()=>{

    setTimeout(()=>{

        showToast("Welcome to Laundry Management");

    },1000);

}


// ==========================================
// Button Ripple Animation
// ==========================================

document.querySelectorAll("button").forEach(button=>{

    button.addEventListener("click",function(e){

        let circle=document.createElement("span");

        circle.classList.add("ripple");

        let x=e.clientX-this.offsetLeft;

        let y=e.clientY-this.offsetTop;

        circle.style.left=x+"px";

        circle.style.top=y+"px";

        this.appendChild(circle);

        setTimeout(()=>{

            circle.remove();

        },600);

    });

});


// ==========================================
// Live Clock
// ==========================================

function updateClock(){

    const clock=document.getElementById("clock");

    if(!clock) return;

    let now=new Date();

    clock.innerHTML=now.toLocaleTimeString();

}

setInterval(updateClock,1000);


// ==========================================
// Fake Laundry Progress Update
// ==========================================

let stages=["Received","Washing","Drying","Ironing","Ready"];

let index=0;

setInterval(()=>{

    let progress=document.getElementById("laundryStatus");

    if(progress){

        progress.innerHTML=stages[index];

        index++;

        if(index>=stages.length){

            index=0;

        }

    }

},4000);


// ==========================================
// Bell Notification
// ==========================================

let bell=document.querySelector(".notification");

bell.addEventListener("click",()=>{

    showToast("No New Notifications");

});


// ==========================================
// Current Laundry Day
// ==========================================

const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const today=new Date();

console.log("Laundry Day :",days[today.getDay()]);


// ==========================================
// Student Eligibility
// ==========================================

function checkEligibility(){

    return true;

}

if(checkEligibility()){

    console.log("Eligible");

}else{

    console.log("Not Eligible");

}