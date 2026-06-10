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

const form = document.getElementById('contact-form');
const result = document.getElementById('form-result');
const submitBtn = form.querySelector('.btn-send');

if (form && result) {
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Mencegah halaman reload otomatis
        
        // Ubah tampilan tombol menjadi status loading ala game
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> TRANSMITTING...';
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        result.innerHTML = "Please wait...";
        result.className = "form-result-message processing";

        // Mengirim data ke server Web3Forms
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let res = await response.json();
            if (response.status == 200) {
                // JIKA SUKSES: Munculkan notifikasi bernuansa RPG!
                result.innerHTML = "✔ QUEST ACCEPTED! Message sent successfully.";
                result.className = "form-result-message success";
                form.reset(); // Bersihkan semua kotak input
            } else {
                console.log(response);
                result.innerHTML = res.message;
                result.className = "form-result-message error";
            }
        })
        .catch(error => {
            console.log(error);
            result.innerHTML = "❌ TRANSMISSION FAILED! Something went wrong.";
            result.className = "form-result-message error";
        })
        .then(function() {
            // Kembalikan teks tombol ke semula setelah selesai
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> SEND MESSAGE';
            submitBtn.disabled = false;
            
            // Hilangkan pesan notifikasi setelah 5 detik
            setTimeout(() => {
                result.innerHTML = "";
                result.className = "form-result-message";
            }, 5000);
        });
    });
}