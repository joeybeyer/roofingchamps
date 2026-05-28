const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");
const navMenus = Array.from(document.querySelectorAll(".nav-menu"));

function closeNavMenus(exceptMenu = null) {
  navMenus.forEach((menu) => {
    if (menu !== exceptMenu) menu.open = false;
  });
}

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    if (!isOpen) closeNavMenus();
  });
}

navMenus.forEach((menu) => {
  menu.addEventListener("toggle", () => {
    if (menu.open) closeNavMenus(menu);
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-nav")) closeNavMenus();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavMenus();
});

document.querySelectorAll("[data-quote-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("button[type='submit']");
    if (button) {
      button.textContent = "Request Started";
      button.disabled = true;
    }
    let message = form.querySelector(".form-message");
    if (!message) {
      message = document.createElement("p");
      message.className = "form-message";
      form.appendChild(message);
    }
    message.textContent = "Thanks. The form shell is ready for CRM or lead-routing integration.";
  });
});
