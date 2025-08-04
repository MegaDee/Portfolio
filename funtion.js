// Initialize EmailJS
emailjs.init("T_QKgYrKLdRGzwEfJ");

const track = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const cards = document.querySelectorAll('.project-card');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.header-right');
const contactForm = document.querySelector('#contact-form');
const submitBtn = document.querySelector('.contact-form .cta-button');

let currentIndex = 0;
let autoSlideInterval;

// Utility: Debounce function for resize event
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Validate email format
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Show form message
const showFormMessage = (message, type) => {
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) existingMessage.remove();
  const messageEl = document.createElement('p');
  messageEl.className = `form-message ${type}`;
  messageEl.textContent = message;
  contactForm.appendChild(messageEl);
  setTimeout(() => messageEl.remove(), 3000);
};

// Carousel Functions
const getCardWidth = () => (cards.length > 0 ? cards[0].offsetWidth + 32 : 0);

const updateCarousel = () => {
  if (track && cards.length > 0) {
    track.style.transform = `translateX(-${getCardWidth() * currentIndex}px)`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= cards.length - 1;
  }
};

const startAutoSlide = () => {
  if (cards.length > 0) {
    autoSlideInterval = setInterval(() => {
      if (currentIndex < cards.length - 1) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateCarousel();
    }, 6000);
  }
};

const stopAutoSlide = () => {
  clearInterval(autoSlideInterval);
};

// Form Submission
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.querySelector('#name')?.value.trim();
    const email = document.querySelector('#email')?.value.trim();
    const message = document.querySelector('#message')?.value.trim();

    // Validation
    if (!name || name.length < 2) {
      showFormMessage('Please enter a valid name (at least 2 characters).', 'error');
      return;
    }
    if (!email || !isValidEmail(email)) {
      showFormMessage('Please enter a valid email address.', 'error');
      return;
    }
    if (!message || message.length < 10) {
      showFormMessage('Please enter a message (at least 10 characters).', 'error');
      return;
    }

    // Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    // Send email using EmailJS
    emailjs.send("service_q7mh8g6", "template_9ybclh9", {
      from_name: name,
      from_email: email,
      message: message,
      to_email: "adedezzy@gmail.com"
    })
    .then(() => {
      showFormMessage('Message sent successfully!', 'success');
      contactForm.reset();
    }, (error) => {
      showFormMessage('Failed to send message. Please try again.', 'error');
      console.error('EmailJS error:', error);
    })
    .finally(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  });
}

// Carousel Navigation
if (prevBtn && nextBtn && track && cards.length > 0) {
  nextBtn.addEventListener('click', () => {
    stopAutoSlide();
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      updateCarousel();
    }
    startAutoSlide();
  });

  prevBtn.addEventListener('click', () => {
    stopAutoSlide();
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
    startAutoSlide();
  });

  // Pause auto-slide on hover over track or buttons
  [track, prevBtn, nextBtn].forEach(el => {
    el.addEventListener('mouseenter', stopAutoSlide);
    el.addEventListener('mouseleave', startAutoSlide);
  });

  // Keyboard navigation for carousel
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && currentIndex < cards.length - 1) {
      stopAutoSlide();
      currentIndex++;
      updateCarousel();
      startAutoSlide();
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
      stopAutoSlide();
      currentIndex--;
      updateCarousel();
      startAutoSlide();
    }
  });
}

// Mobile Menu Toggle
if (mobileMenuToggle && navMenu) {
  mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const isActive = navMenu.classList.contains('active');
    mobileMenuToggle.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target) && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });

  // Close menu on Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
}

// Smooth Scrolling
document.querySelectorAll('.header-right a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
      if (navMenu) navMenu.classList.remove('active');
      if (mobileMenuToggle) mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
});

// Debounced resize handler
window.addEventListener('resize', debounce(() => {
  updateCarousel();
}, 100));

// Start auto-slide on page load
startAutoSlide();