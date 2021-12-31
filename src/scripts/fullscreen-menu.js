const openingBtn = document.querySelector(".hamburger");
const menu = document.querySelector(".fullscreen-menu");
const closingBtn = document.querySelector(".fullscreen-menu__close");
const body = document.querySelector("body");

openingBtn.addEventListener('click', function() {
    menu.classList.add("active");
    body.classList.add("hidden");
});

closingBtn.addEventListener('click', function() {
    menu.classList.remove("active");
    body.classList.remove("hidden");
});

menu.addEventListener("click", function (e) {
    e.preventDefault();

    if (e.target.classList.contains("menu__link")) {
        menu.classList.remove("active");
        body.classList.remove("hidden"); 
    }
});
