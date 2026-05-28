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
  const steps = Array.from(form.querySelectorAll(".form-step"));
  const dots = Array.from(form.querySelectorAll(".step-dots span"));
  let currentStep = 0;

  function showStep(index) {
    currentStep = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, stepIndex) => {
      const active = stepIndex === currentStep;
      step.hidden = !active;
      step.classList.toggle("is-active", active);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentStep);
      dot.classList.toggle("is-complete", dotIndex < currentStep);
    });
  }

  function canAdvance() {
    const activeStep = steps[currentStep];
    if (!activeStep) return true;
    const requiredFields = Array.from(activeStep.querySelectorAll("[required]"));
    return requiredFields.every((field) => field.reportValidity());
  }

  form.querySelectorAll(".form-next").forEach((button) => {
    button.addEventListener("click", () => {
      if (canAdvance()) showStep(currentStep + 1);
    });
  });

  form.querySelectorAll(".form-prev").forEach((button) => {
    button.addEventListener("click", () => showStep(currentStep - 1));
  });

  form.querySelectorAll("[data-choice-group]").forEach((group) => {
    const fieldName = group.getAttribute("data-choice-group");
    const hiddenField = fieldName ? form.querySelector(`input[name="${fieldName}"]`) : null;
    group.querySelectorAll("button[data-value]").forEach((button) => {
      button.addEventListener("click", () => {
        group.querySelectorAll("button").forEach((item) => item.classList.remove("is-selected"));
        button.classList.add("is-selected");
        if (hiddenField) hiddenField.value = button.getAttribute("data-value") || "";
        setTimeout(() => showStep(currentStep + 1), 120);
      });
    });
  });

  showStep(0);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!canAdvance()) return;
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
    message.textContent = "Thanks. Your roofing request has been started. The lead-routing endpoint is ready to connect.";
  });
});
