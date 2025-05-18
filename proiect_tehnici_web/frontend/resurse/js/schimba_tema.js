window.addEventListener("load", function() {
    document.getElementById("schimba-tema").onclick = function() {
        if(document.body.classList.toggle("dark")){
            localStorage.setItem("tema", "dark");
        }
        else{
            localStorage.removeItem("tema");
        }
    }
})