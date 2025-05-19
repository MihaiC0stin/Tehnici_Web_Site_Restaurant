window.addEventListener("load", function() {
    document.getElementById("switch-tema").onclick = function() {
        const icon = document.getElementById("icon-tema");
        if (document.body.classList.toggle("dark")) {
            localStorage.setItem("tema", "dark");
            icon.classList.replace("fa-sun", "fa-moon");
        } else {
            localStorage.removeItem("tema");
            icon.classList.replace("fa-moon", "fa-sun");
        }
    };
});
