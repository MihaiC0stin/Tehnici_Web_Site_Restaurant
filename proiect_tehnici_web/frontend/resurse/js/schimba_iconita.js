    if(localStorage.getItem("tema") === "dark"){
        document.getElementById("schimba-tema").querySelector("i").classList.replace("fa-sun", "fa-moon");
    } else{
        document.getElementById("schimba-tema").querySelector("i").classList.replace("fa-moon", "fa-sun");
    }