/* ============================================================
   SLIDER JS — Testimonials & Course Carousel
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* Generic Slider Factory */
  function initSlider(sliderEl) {
    if (!sliderEl) return;
    const track    = sliderEl.querySelector('.slider-track');
    const slides   = track ? Array.from(track.children) : [];
    const prevBtn  = sliderEl.querySelector('.slider-btn-prev');
    const nextBtn  = sliderEl.querySelector('.slider-btn-next');
    const dotsEl   = sliderEl.querySelector('.slider-dots');
    if (!track || slides.length === 0) return;

    let current = 0;
    let autoPlay;
    let perView  = getPerView();

    function getPerView() {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 900) return 2;
      return parseInt(sliderEl.dataset.perView || 3);
    }

    function getMaxIndex() { return Math.max(0, slides.length - perView); }

    /* Build dots */
    function buildDots() {
      if (!dotsEl) return;
      dotsEl.innerHTML = '';
      const count = getMaxIndex() + 1;
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === current ? ' active' : '');
        dot.setAttribute('aria-label', 'Slide ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsEl) return;
      dotsEl.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function goTo(index) {
      const max = getMaxIndex();
      current = Math.min(Math.max(index, 0), max);
      const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(track).gap || 24);
      track.style.transform = `translateX(-${current * slideWidth}px)`;
      updateDots();
    }

    function next() { goTo(current >= getMaxIndex() ? 0 : current + 1); }
    function prev() { goTo(current <= 0 ? getMaxIndex() : current - 1); }

    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    /* Auto-play */
    function startAuto() { autoPlay = setInterval(next, parseInt(sliderEl.dataset.auto || 4000)); }
    function stopAuto()  { clearInterval(autoPlay); }
    sliderEl.addEventListener('mouseenter', stopAuto);
    sliderEl.addEventListener('mouseleave', startAuto);

    /* Touch / swipe */
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; stopAuto(); }, { passive: true });
    track.addEventListener('touchend',   e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
      startAuto();
    }, { passive: true });

    /* Resize */
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        perView = getPerView();
        buildDots();
        goTo(0);
      }, 250);
    });

    buildDots();
    goTo(0);
    if (sliderEl.dataset.auto !== 'false') startAuto();
  }

  document.querySelectorAll('.slider-wrapper[data-slider]').forEach(initSlider);

});

/* ============================================================
   FORMS JS — Validation + Google Sheets
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ─ Google Sheets endpoint (replace with deployed URL) ─ */
  const SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

  /* Validate single field */
  function validateField(field) {
    const val = field.value.trim();
    let valid  = true;
    field.classList.remove('error');
    const err  = field.nextElementSibling;
    if (err && err.classList.contains('form-error')) err.style.display = 'none';

    if (field.required && !val) {
      valid = false;
      if (err) err.textContent = 'This field is required.';
    } else if (field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      valid = false;
      if (err) err.textContent = 'Enter a valid email address.';
    } else if (field.type === 'tel' && val && !/^\+?[\d\s\-()]{7,15}$/.test(val)) {
      valid = false;
      if (err) err.textContent = 'Enter a valid phone number.';
    }

    if (!valid) {
      field.classList.add('error');
      if (err) err.style.display = 'block';
    }
    return valid;
  }

  /* Validate full form */
  function validateForm(form) {
    let ok = true;
    form.querySelectorAll('[required]').forEach(f => { if (!validateField(f)) ok = false; });
    return ok;
  }

  /* Submit to Google Sheets */
  async function submitToSheet(form, sheetName) {
    const data = {};
    data['sheet'] = sheetName;
    data['timestamp'] = new Date().toISOString();
    new FormData(form).forEach((val, key) => { data[key] = val; });

    try {
      await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return true;
    } catch(e) {
      console.warn('Sheet submit error:', e);
      return true; /* still show success to user */
    }
  }

  /* Real-time validation */
  document.querySelectorAll('.validated-form [required]').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => { if (field.classList.contains('error')) validateField(field); });
  });

  /* Registration Form */
  const regForm = document.getElementById('registrationForm');
  if (regForm) {
    regForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      if (!validateForm(this)) {
        this.querySelector('.error')?.scrollIntoView({ behavior:'smooth', block:'center' });
        return;
      }
      const btn = this.querySelector('[type="submit"]');
      btn.disabled = true; btn.textContent = 'Submitting…';
      await submitToSheet(this, 'Registrations');
      btn.disabled = false; btn.textContent = 'Submit Registration';
      this.reset();
      openModal('successModal');
    });
  }

  /* Trial Form */
  const trialForm = document.getElementById('trialForm');
  if (trialForm) {
    trialForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      if (!validateForm(this)) return;
      const btn = this.querySelector('[type="submit"]');
      btn.disabled = true; btn.textContent = 'Booking…';
      await submitToSheet(this, 'TrialBookings');
      btn.disabled = false; btn.textContent = 'Book Free Trial';
      this.reset();
      openModal('successModal');
    });
  }

  /* Contact Form */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      if (!validateForm(this)) return;
      const btn = this.querySelector('[type="submit"]');
      btn.disabled = true; btn.textContent = 'Sending…';
      await submitToSheet(this, 'ContactMessages');
      btn.disabled = false; btn.textContent = 'Send Message';
      this.reset();
      showToast('✅ Message sent! We\'ll reply within 24 hours.');
    });
  }

  /* Multi-step form (registration) */
  const steps    = document.querySelectorAll('.form-step');
  const stepBtns = document.querySelectorAll('.step-next, .step-prev');
  const stepIndicators = document.querySelectorAll('.step-indicator');
  let currentStep = 0;

  function showStep(n) {
    steps.forEach((s, i) => s.classList.toggle('active', i === n));
    stepIndicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === n);
      ind.classList.toggle('done', i < n);
    });
  }

  if (steps.length) showStep(0);

  document.querySelectorAll('.step-next').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentFields = steps[currentStep]?.querySelectorAll('[required]');
      let ok = true;
      currentFields?.forEach(f => { if (!validateField(f)) ok = false; });
      if (ok && currentStep < steps.length - 1) { currentStep++; showStep(currentStep); window.scrollTo({top:0,behavior:'smooth'}); }
    });
  });

  document.querySelectorAll('.step-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) { currentStep--; showStep(currentStep); }
    });
  });

});
