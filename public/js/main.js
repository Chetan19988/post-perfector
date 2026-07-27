/**
 * Chetan Lifters - Main Application JavaScript
 * Reserve Modal Funnel, Mobile Menu & Interactive Elements
 */

document.addEventListener('DOMContentLoaded', function () {
  // --- Mobile Header Navigation Toggle ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function () {
      navMenu.classList.toggle('active');
    });
  }

  // --- Reserve Modal Functionality ---
  const modalOverlay = document.getElementById('reserveModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCancelBtn = document.getElementById('modalCancelBtn');
  const reserveForm = document.getElementById('reserveForm');
  const tonSelect = document.getElementById('tonSelect');
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const phoneInput = document.getElementById('userPhone');

  // Pre-set default dates (today and tomorrow)
  if (startDateInput && endDateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    startDateInput.valueAsDate = today;
    endDateInput.valueAsDate = tomorrow;
  }

  // Global Function to Open Reserve Modal
  window.openReserveModal = function (tonValue) {
    if (tonSelect && tonValue) {
      tonSelect.value = tonValue;
    }
    if (modalOverlay) {
      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  // Close Modal Helper
  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Handle Reserve Form Submit -> Format WhatsApp Message
  if (reserveForm) {
    reserveForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const ton = tonSelect ? tonSelect.value : '3 Ton';
      const start = startDateInput ? startDateInput.value : '';
      const end = endDateInput ? endDateInput.value : '';
      const phone = phoneInput && phoneInput.value.trim() !== '' ? phoneInput.value.trim() : 'Not provided';

      // WhatsApp Message Formatting (Bilingual / Hindi as requested)
      const message = `*फोर्कलिफ्ट रिजर्व – चेतन लिफ्टर्स*\nForklift: ${ton}\nStart: ${start}\nEnd: ${end}\nPhone: ${phone}\n---\nकृपया उपलब्धता कन्फर्म करें।`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/917982773422?text=${encodedMessage}`;

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');

      // Close modal
      closeModal();
    });
  }

  // --- FAQ Accordion Interactive Handlers ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        // Close other items
        faqItems.forEach(i => i.classList.remove('active'));
        // Toggle current item
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });
});
