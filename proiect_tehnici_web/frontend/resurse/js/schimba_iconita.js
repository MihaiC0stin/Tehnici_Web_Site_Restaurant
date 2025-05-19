if (localStorage.getItem("tema") === "dark") {
    document.body.classList.add("dark");
    document.getElementById("switch-tema").checked = true;
    document.getElementById("icon-tema").classList.replace("fa-sun", "fa-moon");
} else {
    document.getElementById("icon-tema").classList.replace("fa-moon", "fa-sun");
}
