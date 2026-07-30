document.addEventListener("DOMContentLoaded", function(){


    const editButtons = document.querySelectorAll(".edit");
    const saveButton = document.querySelector(".save");


    let editMode = false;



    // Disable editing initially

    document.querySelectorAll("td[contenteditable]").forEach(cell => {

        cell.setAttribute("contenteditable","false");

    });





    // Edit button

    editButtons.forEach(button => {


        button.addEventListener("click", function(){


            editMode = true;


            document.querySelectorAll("td[contenteditable]").forEach(cell=>{

                cell.setAttribute("contenteditable","true");

            });


            alert("Edit mode enabled. Change menu items and click Save Changes.");


        });


    });








    // Save menu changes


    saveButton.addEventListener("click", function(){


        if(editMode){


            document.querySelectorAll("td[contenteditable]").forEach(cell=>{

                cell.setAttribute("contenteditable","false");

            });


            editMode=false;


            alert("Mess menu updated successfully!");



            console.log("Updated Menu:");



            document.querySelectorAll("tbody tr").forEach(row=>{


                let menu=[];


                row.querySelectorAll("td").forEach(cell=>{


                    menu.push(cell.innerText.trim());


                });


                console.log(menu);


            });



        }


        else{


            alert("Please click Edit before changing the menu.");

        }



    });







    // ================= ATTENDANCE CALCULATION =================



    let fullDayStudents = 350;

    let upToLunchStudents = 120;



    let breakfast = fullDayStudents + upToLunchStudents;

    let lunch = fullDayStudents + upToLunchStudents;

    let dinner = fullDayStudents;





    document.getElementById("breakfast").innerHTML =
    breakfast + " Students";



    document.getElementById("lunch").innerHTML =
    lunch + " Students";



    document.getElementById("dinner").innerHTML =
    dinner + " Students";



});