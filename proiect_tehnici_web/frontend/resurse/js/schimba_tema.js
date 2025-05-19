window.addEventListener("load", function() {
    document.getElementById("schimba-tema").onclick = function() {
        if(document.body.classList.toggle("dark")){
            localStorage.setItem("tema", "dark");
            this.querySelector("i").classList.replace("fa-sun", "fa-moon");
        }
        else{
            localStorage.removeItem("tema");
            this.querySelector("i").classList.replace("fa-moon", "fa-sun");
        }
    }
})