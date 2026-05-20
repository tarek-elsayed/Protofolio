function debounce(callbackFunction, delayDuration) {
  let timeoutId;

  return function (...callbackArguments) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callbackFunction.apply(this, callbackArguments);
    }, delayDuration);
  };
}

function initializeMobileNavigationMenu() {
  const navigationLinksContainer = document.querySelector(".nav-links");

  if (!navigationLinksContainer) return;

  const mobileMenuButton = document.createElement("button");

  mobileMenuButton.className =
    "mobile-menu-btn lg:hidden text-slate-900 dark:text-white text-2xl";

  mobileMenuButton.innerHTML = `<i class="fa-solid fa-bars"></i>`;

  const headerContainer = document.querySelector("#header .container");

  headerContainer.appendChild(mobileMenuButton);

  mobileMenuButton.addEventListener("click", () => {
    navigationLinksContainer.classList.toggle("active");

    const menuIcon = mobileMenuButton.querySelector("i");

    const isMenuOpen = navigationLinksContainer.classList.contains("active");

    menuIcon.className = isMenuOpen ? "fa-solid fa-times" : "fa-solid fa-bars";
  });

  const navigationLinks = navigationLinksContainer.querySelectorAll("a");

  navigationLinks.forEach((navigationLink) => {
    navigationLink.addEventListener("click", () => {
      navigationLinksContainer.classList.remove("active");

      mobileMenuButton.querySelector("i").className = "fa-solid fa-bars";
    });
  });
}

function initializeActiveNavigationLinks() {
  const pageSections = document.querySelectorAll("section[id]");

  const navigationLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNavigationState() {
    let activeSectionId = "";

    pageSections.forEach((sectionElement) => {
      const sectionTopOffset = sectionElement.offsetTop;

      if (window.scrollY >= sectionTopOffset - 100) {
        activeSectionId = sectionElement.getAttribute("id");
      }
    });

    navigationLinks.forEach((navigationLink) => {
      navigationLink.classList.remove("active");

      const linkTarget = navigationLink.getAttribute("href");

      if (linkTarget === `#${activeSectionId}`) {
        navigationLink.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", debounce(updateActiveNavigationState, 50));

  updateActiveNavigationState();
}

function applyThemeColors(primaryColor, secondaryColor, accentColor) {
  document.documentElement.style.setProperty("--color-primary", primaryColor);

  document.documentElement.style.setProperty(
    "--color-secondary",
    secondaryColor,
  );

  document.documentElement.style.setProperty("--color-accent", accentColor);
}

function initializeDarkModeToggle() {
  const themeToggleButton = document.getElementById("theme-toggle-button");

  if (!themeToggleButton) return;

  const htmlRootElement = document.documentElement;

  const savedTheme = localStorage.getItem("theme") || "dark";

  htmlRootElement.classList.toggle("dark", savedTheme === "dark");

  themeToggleButton.addEventListener("click", () => {
    const isDarkModeEnabled = htmlRootElement.classList.toggle("dark");

    localStorage.setItem("theme", isDarkModeEnabled ? "dark" : "light");
  });
}

function initializePortfolioFilter() {
  const filterButtons = document.querySelectorAll(".portfolio-filter");

  const portfolioItems = document.querySelectorAll(".portfolio-item");

  if (!filterButtons.length || !portfolioItems.length) {
    return;
  }

  filterButtons.forEach((filterButton) => {
    filterButton.addEventListener("click", function () {
      const selectedCategory = this.getAttribute("data-filter");

      filterButtons.forEach((buttonElement) => {
        buttonElement.classList.remove("active");
      });

      this.classList.add("active");

      portfolioItems.forEach((portfolioItem) => {
        const itemCategory = portfolioItem.getAttribute("data-category");

        const shouldDisplayItem =
          selectedCategory === "all" || itemCategory === selectedCategory;

        portfolioItem.style.display = shouldDisplayItem ? "block" : "none";
      });
    });
  });
}

function initializeTestimonialsCarousel() {
  const carouselContainer = document.getElementById("testimonials-carousel");

  if (!carouselContainer) return;

  const previousButton = document.getElementById("prev-testimonial");

  const nextButton = document.getElementById("next-testimonial");

  const testimonialCards = document.querySelectorAll(".testimonial-card");

  let currentSlideIndex = 0;

  function updateCarouselPosition() {
    carouselContainer.style.transform = `translateX(${currentSlideIndex * 100}%)`;
  }

  nextButton?.addEventListener("click", () => {
    currentSlideIndex++;

    if (currentSlideIndex >= testimonialCards.length) {
      currentSlideIndex = 0;
    }

    updateCarouselPosition();
  });

  previousButton?.addEventListener("click", () => {
    currentSlideIndex--;

    if (currentSlideIndex < 0) {
      currentSlideIndex = testimonialCards.length - 1;
    }

    updateCarouselPosition();
  });
}

function initializeScrollToTopButton() {
  const scrollToTopButton = document.getElementById("scroll-to-top");

  if (!scrollToTopButton) return;

  window.addEventListener(
    "scroll",
    debounce(() => {
      const shouldShowButton = window.scrollY > 300;

      scrollToTopButton.classList.toggle("visible", shouldShowButton);
    }, 100),
  );

  scrollToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function initializeContactFormValidation() {
  const contactForm = document.querySelector("#contact form");

  if (!contactForm) return;

  contactForm.addEventListener("submit", (submitEvent) => {
    submitEvent.preventDefault();

    clearValidationErrors(contactForm);

    const isFormValid = validateContactForm(contactForm);

    if (isFormValid) {
      showSuccessPopup();

      contactForm.reset();
    }
  });
}

function validateContactForm(contactForm) {
  let isFormValid = true;

  const fullNameInput = contactForm.querySelector('input[type="text"]');

  const emailInput = contactForm.querySelector('input[type="email"]');

  const messageTextarea = contactForm.querySelector("textarea");

  if (!fullNameInput.value.trim()) {
    createValidationError(fullNameInput, "يرجى إدخال الاسم الكامل");

    isFormValid = false;
  }

  const emailValidationPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailValidationPattern.test(emailInput.value)) {
    createValidationError(emailInput, "يرجى إدخال بريد إلكتروني صحيح");

    isFormValid = false;
  }

  if (messageTextarea.value.trim().length < 10) {
    createValidationError(messageTextarea, "يرجى إدخال المزيد من التفاصيل");

    isFormValid = false;
  }

  return isFormValid;
}

function createValidationError(targetInput, errorMessage) {
  const errorMessageElement = document.createElement("p");

  errorMessageElement.className = "error-message text-red-500 text-sm mt-1";

  errorMessageElement.textContent = errorMessage;

  targetInput.classList.add("border-red-500");

  targetInput.parentElement.appendChild(errorMessageElement);
}

function clearValidationErrors(contactForm) {
  contactForm.querySelectorAll(".error-message").forEach((errorElement) => {
    errorElement.remove();
  });

  contactForm.querySelectorAll(".border-red-500").forEach((invalidElement) => {
    invalidElement.classList.remove("border-red-500");
  });
}

function showSuccessPopup() {
  const popupOverlay = document.createElement("div");

  popupOverlay.className =
    "fixed inset-0 flex items-center justify-center bg-black/70 z-50";

  popupOverlay.innerHTML = `
    <div class="bg-slate-800 text-white p-8 rounded-2xl text-center">
      <h3 class="text-2xl mb-4">
        تم إرسال رسالتك بنجاح
      </h3>

      <button class="close-popup-btn">
        حسناً
      </button>
    </div>
  `;

  document.body.appendChild(popupOverlay);

  popupOverlay
    .querySelector(".close-popup-btn")
    .addEventListener("click", () => {
      popupOverlay.remove();
    });
}

initializeMobileNavigationMenu();

initializeActiveNavigationLinks();

initializeDarkModeToggle();

initializePortfolioFilter();

initializeTestimonialsCarousel();

initializeScrollToTopButton();

initializeContactFormValidation();
