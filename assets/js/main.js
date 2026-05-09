/* ============================================================
   MAIN JS — Abdullah's Quran & Arabic Academy
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Page Loader ── */
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 600);
    });
  }

  /* ── Navbar ── */
  const navbar   = document.getElementById('navbar');
  const hamburger= document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
      scrollTopBtn && scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* Active nav link */
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');
  const curPage  = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === curPage || (curPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Scroll To Top ── */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Scroll Reveal ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children').forEach(el => {
    revealObserver.observe(el);
  });

  /* ── Animated Counters ── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target || el.textContent, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      el.textContent = Math.floor(current).toLocaleString() + suffix;
      if (current >= target) clearInterval(timer);
    }, step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-number[data-target]').forEach(animateCounter);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.stats-grid').forEach(el => counterObserver.observe(el));

  /* ── Accordion ── */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item   = header.parentElement;
      const body   = item.querySelector('.accordion-body');
      const isOpen = item.classList.contains('open');

      // close siblings
      header.closest('.accordion-list')?.querySelectorAll('.accordion-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.accordion-body').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ── Ripple Effect on Buttons ── */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  /* ── Smooth Scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

  /* ── Modal ── */
  window.openModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
  };
  window.closeModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) { modal.classList.remove('open'); document.body.style.overflow = ''; }
  };
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) closeModal(this.id);
    });
  });
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.closest('.modal-overlay').id));
  });

  /* ── FAQ Search ── */
  const faqSearch = document.getElementById('faqSearch');
  if (faqSearch) {
    faqSearch.addEventListener('input', function() {
      const q = this.value.toLowerCase();
      document.querySelectorAll('.accordion-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  /* ── Tab Switcher ── */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const group = this.dataset.group;
      const target= this.dataset.tab;
      document.querySelectorAll(`[data-group="${group}"].tab-btn`).forEach(b => b.classList.remove('active'));
      document.querySelectorAll(`[data-group="${group}"].tab-content`).forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      document.querySelector(`[data-group="${group}"][data-id="${target}"]`)?.classList.add('active');
    });
  });

  /* ── Newsletter form ── */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value) {
        input.value = '';
        showToast('✅ Subscribed! JazakAllah Khair.');
      }
    });
  }

  /* ── Toast notification ── */
  window.showToast = function(msg, type='success') {
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = msg;
    toast.style.cssText = `
      position:fixed;bottom:90px;left:50%;transform:translateX(-50%) translateY(20px);
      background:${type==='success'?'#1B4332':'#E53E3E'};color:white;
      padding:14px 28px;border-radius:50px;font-weight:700;font-size:0.92rem;
      box-shadow:0 8px 24px rgba(0,0,0,0.2);z-index:9999;
      opacity:0;transition:all 0.35s ease;white-space:nowrap;
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity='1'; toast.style.transform='translateX(-50%) translateY(0)'; });
    setTimeout(() => {
      toast.style.opacity='0';
      toast.style.transform='translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  };

  /* ── Lazy image load ── */
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
          imgObserver.unobserve(img);
        }
      });
    });
    document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
  }

  /* ── Particles in hero ── */
  const hero = document.querySelector('.particles');
  if (hero) {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left:${Math.random()*100}%;
        top:${Math.random()*100}%;
        --dur:${6+Math.random()*8}s;
        --delay:${-Math.random()*6}s;
        opacity:${0.3+Math.random()*0.5};
        width:${2+Math.random()*3}px;
        height:${2+Math.random()*3}px;
      `;
      hero.appendChild(p);
    }
  }

  /* ── Callback Modal ── */
  const callbackModal = document.getElementById('callbackModal');
  const closeCallbackBtn = document.getElementById('closeModal');
  const modalForm = document.getElementById('modalForm');

  if (callbackModal) {
    const modalStatus = localStorage.getItem('callbackModalStatus');
    
    if (!modalStatus) {
      setTimeout(() => {
        callbackModal.classList.add('active');
      }, 3000); // Show after 3 seconds
    }

    closeCallbackBtn.addEventListener('click', () => {
      callbackModal.classList.remove('active');
      localStorage.setItem('callbackModalStatus', 'closed');
    });

    window.addEventListener('click', (e) => {
      if (e.target === callbackModal) {
        callbackModal.classList.remove('active');
        localStorage.setItem('callbackModalStatus', 'closed');
      }
    });

    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modalName').value;
      const phone = document.getElementById('modalPhone').value;
      
      const whatsappNumber = "8074027524";
      const message = `Hello, I am interested in joining the academy.\nName: ${name}\nMobile: ${phone}\nPlease call me back.`;
      const encodedMessage = encodeURIComponent(message);
      
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
      
      callbackModal.classList.remove('active');
      localStorage.setItem('callbackModalStatus', 'filled');
    });
  }

});
