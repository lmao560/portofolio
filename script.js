const navIcon = document.getElementById("nav-icon");
const navList = document.getElementById("nav-list");
const navLinks = document.querySelectorAll(".nav-link");
const headerElement = document.querySelector("header");
let interactionTimeout;

function handleHeaderInactivity() {
    if (!navList || !headerElement) return;

    const isMobileNavOpen = navList.classList.contains("active");

    if (isMobileNavOpen) {
        headerElement.classList.remove("hide");
        clearTimeout(interactionTimeout);
        return;
    }

    headerElement.classList.remove("hide");
    clearTimeout(interactionTimeout);

    interactionTimeout = setTimeout(() => {
        const currentlyOpen = navList.classList.contains("active");

        if (!currentlyOpen) {
            headerElement.classList.add("hide");
        }
    }, 3000);
}

if (navIcon && navList) {
    navIcon.addEventListener ("click", () => {
        navList.classList.toggle("active");
        handleHeaderInactivity();
    })
}

if (navLinks) {
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navList.classList.remove("active");
            handleHeaderInactivity();
        });
    });
}

window.addEventListener("scroll", handleHeaderInactivity);
window.addEventListener("mousemove", handleHeaderInactivity);
window.addEventListener("keydown", handleHeaderInactivity);
window.addEventListener("touchstart", handleHeaderInactivity);

handleHeaderInactivity();
