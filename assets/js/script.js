'use strict';



/**
 * PRELOAD
 * 
 * loading will be end after document is loaded
 */

const preloader = document.querySelector("[data-preaload]");

window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});



/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * NAVBAR
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);



/**
 * HEADER & BACK TOP BTN
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollPos = window.scrollY;
}

window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});



/**
 * HERO SLIDER
 */

const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

// Only initialize hero slider if elements exist
if (heroSlider && heroSliderItems.length > 0 && heroSliderPrevBtn && heroSliderNextBtn) {
  let currentSlidePos = 0;
  let lastActiveSliderItem = heroSliderItems[0];

  const updateSliderPos = function () {
    lastActiveSliderItem.classList.remove("active");
    heroSliderItems[currentSlidePos].classList.add("active");
    lastActiveSliderItem = heroSliderItems[currentSlidePos];
  }

  const slideNext = function () {
    if (currentSlidePos >= heroSliderItems.length - 1) {
      currentSlidePos = 0;
    } else {
      currentSlidePos++;
    }

    updateSliderPos();
  }

  const slidePrev = function () {
    if (currentSlidePos <= 0) {
      currentSlidePos = heroSliderItems.length - 1;
    } else {
      currentSlidePos--;
    }

    updateSliderPos();
  }

  heroSliderNextBtn.addEventListener("click", slideNext);
  heroSliderPrevBtn.addEventListener("click", slidePrev);

  console.log("✅ Hero slider initialized successfully");
} else {
  console.log("ℹ️ Hero slider elements not found - skipping hero slider initialization");
}

/**
 * auto slide
 */

// Only initialize auto-slide if hero slider exists
if (heroSlider && heroSliderItems.length > 0 && heroSliderPrevBtn && heroSliderNextBtn) {
  let autoSlideInterval;

  const autoSlide = function () {
    autoSlideInterval = setInterval(function () {
      slideNext();
    }, 7000);
  }

  addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function () {
    clearInterval(autoSlideInterval);
  });

  addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);

  window.addEventListener("load", autoSlide);

  console.log("✅ Auto-slide initialized successfully");
} else {
  console.log("ℹ️ Auto-slide skipped - hero slider not available");
}

// Ensure header sticks at 0 on scroll and toggles active state
window.addEventListener('scroll', () => {
  const headerEl = document.querySelector('[data-header]');
  if (!headerEl) return;
  if (window.scrollY >= 50) {
    headerEl.classList.add('active');
  } else {
    headerEl.classList.remove('active');
  }
});



/**
 * PARALLAX EFFECT
 */

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

window.addEventListener("mousemove", function (event) {

  x = (event.clientX / window.innerWidth * 10) - 5;
  y = (event.clientY / window.innerHeight * 10) - 5;

  // reverse the number eg. 20 -> -20, -5 -> 5
  x = x - (x * 2);
  y = y - (y * 2);

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }

});



/**
 * MOBILE EVENT CARDS ANIMATION
 * Trigger animation when event section comes into view on mobile
 */

const isMobile = window.innerWidth <= 768;

if (isMobile) {
  const eventList = document.querySelector('.event .grid-list');
  const eventItems = eventList ? eventList.querySelectorAll(':scope > li') : [];

  if (eventList && eventItems.length) {
    let current = 0;

    // Show only the first item initially
    Array.from(eventItems).forEach((li, idx) => {
      li.style.opacity = idx === 0 ? '1' : '0';
      li.style.transition = 'opacity 600ms ease-in-out';
    });

    // Ensure the container has enough height to show full card
    const setEventListHeight = () => {
      let maxH = 0;
      Array.from(eventItems).forEach(li => { maxH = Math.max(maxH, li.offsetHeight); });
      if (maxH > 0) eventList.style.height = maxH + 'px';
    };
    setEventListHeight();
    window.addEventListener('resize', setEventListHeight);

    const cycleEvents = () => {
      const next = (current + 1) % eventItems.length;
      eventItems[current].style.opacity = '0';
      eventItems[next].style.opacity = '1';
      current = next;
    };

    const onEnter = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Start cycling when section enters viewport
          if (!eventList.dataset.cycling) {
            eventList.dataset.cycling = 'true';
            // Set height again in case images finished loading
            setEventListHeight();
            eventList._cycleInterval = setInterval(cycleEvents, 2500);
          }
        } else {
          // Pause when out of view
          if (eventList.dataset.cycling && eventList._cycleInterval) {
            clearInterval(eventList._cycleInterval);
            eventList._cycleInterval = null;
            delete eventList.dataset.cycling;
          }
        }
      });
    };

    const observer = new IntersectionObserver(onEnter, { threshold: 0.2 });
    observer.observe(eventList);
  }
}


/**
 * LOGO ANIMATION - Working Version
 */

function initLogo() {
  console.log('🔍 Logo initialization started');

  const logoContainers = document.querySelectorAll('.logo-container');
  console.log(`🔍 Found ${logoContainers.length} logo containers`);

  if (logoContainers.length === 0) {
    console.error('❌ No logo containers found! Check HTML structure');
    return;
  }

  logoContainers.forEach((container, containerIndex) => {
    console.log(`🔍 Processing container ${containerIndex + 1}`);

    const spinner = container.querySelector('.logo-spinner');
    const faces = container.querySelectorAll('.logo-face');
    const images = container.querySelectorAll('img');

    console.log(`🔍 Container ${containerIndex + 1}: spinner=${!!spinner}, faces=${faces.length}, images=${images.length}`);

    if (!spinner || faces.length === 0) {
      console.error(`❌ Container ${containerIndex + 1}: Missing spinner or faces`);
      return;
    }

    // Check image sources - they should be logo-1.png, logo-2.png, logo-3.png
    images.forEach((img, imgIndex) => {
      console.log(`🔍 Container ${containerIndex + 1}, Image ${imgIndex + 1}: src="${img.src}"`);

      img.addEventListener('load', () => {
        console.log(`✅ Container ${containerIndex + 1}, Image ${imgIndex + 1}: Loaded successfully`);
      });
      img.addEventListener('error', () => {
        console.error(`❌ Container ${containerIndex + 1}, Image ${imgIndex + 1}: Failed to load`);
      });
    });

    // Initialize 3D coin spinner
    faces.forEach((face, index) => {
      face.style.display = 'block';
      face.style.visibility = 'visible';
      face.classList.remove('hidden');
      console.log(`🔧 Container ${containerIndex + 1}, Face ${index + 1}: Initialized and made visible`);
    });

    // Make sure container is visible
    container.style.display = 'block';
    container.style.visibility = 'visible';
    spinner.style.display = 'block';
    spinner.style.visibility = 'visible';

    // Start with first face
    spinner.className = 'logo-spinner show-face-1';

    console.log(`✅ Container ${containerIndex + 1}: 3D Logo spinner initialized with class: ${spinner.className}`);

    // 3D Coin spinning animation
    let currentFace = 1;
    let animationInterval;
    let isPaused = false;

    function spinCoin() {
      if (isPaused) {
        console.log(`⏸️ Container ${containerIndex + 1}: Animation paused, skipping spin`);
        return;
      }

      const previousFace = currentFace;
      currentFace = (currentFace % 3) + 1;
      spinner.className = `logo-spinner show-face-${currentFace}`;

      console.log(`🪙 Container ${containerIndex + 1}: Spinning from face ${previousFace} to face ${currentFace}`);
      console.log(`🔧 Container ${containerIndex + 1}: Spinner class is now: ${spinner.className}`);

      // Force a style recalculation
      spinner.offsetHeight;
    }

    // Start animation after 3 seconds, then repeat every 5 seconds
    setTimeout(() => {
      if (!isPaused) {
        spinCoin();
        animationInterval = setInterval(() => {
          if (!isPaused) {
            spinCoin();
          }
        }, 5000);
      }
    }, 3000);

    // Pause on hover
    container.addEventListener('mouseenter', () => {
      isPaused = true;
      if (animationInterval) {
        clearInterval(animationInterval);
      }
      console.log(`⏸️ Container ${containerIndex + 1}: Animation paused`);
    });

    container.addEventListener('mouseleave', () => {
      isPaused = false;
      animationInterval = setInterval(() => {
        if (!isPaused) {
          spinCoin();
        }
      }, 5000);
      console.log(`▶️ Container ${containerIndex + 1}: Animation resumed`);
    });
  });
}

// Initialize logo spinner
console.log('🔍 Document ready state:', document.readyState);
console.log('🔍 Current page URL:', window.location.href);

function safeInitLogo() {
  try {
    console.log('🔍 Attempting to initialize logo spinner...');
    initLogo();
  } catch (error) {
    console.error('❌ Error initializing logo spinner:', error);
  }
}

if (document.readyState === 'loading') {
  console.log('🔍 Document still loading, waiting for DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', safeInitLogo);
} else {
  console.log('🔍 Document already loaded, initializing immediately');
  safeInitLogo();
}

// Backup initialization
window.addEventListener('load', function() {
  console.log('🔍 Window loaded, running logo init as backup');
  setTimeout(safeInitLogo, 100);
});


/**
 * VIDEO PLAYER
 */

const videoBtn = document.querySelector("[data-video-btn]");
const video = document.querySelector(".chef-video");

if (videoBtn && video) {
  videoBtn.addEventListener("click", function () {
    if (video.paused) {
      video.play();
      videoBtn.style.display = "none";
    } else {
      video.pause();
      videoBtn.style.display = "flex";
    }
  });

  video.addEventListener("click", function () {
    if (video.paused) {
      video.play();
      videoBtn.style.display = "none";
    } else {
      video.pause();
      videoBtn.style.display = "flex";
    }
  });

  video.addEventListener("ended", function () {
    videoBtn.style.display = "flex";
  });
}