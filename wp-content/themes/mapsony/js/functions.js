document.addEventListener('DOMContentLoaded', () => {
    // Audio Toggle Functionality
    const audio = document.getElementById('site-audio');
    const toggleBtn = document.getElementById('toggleAudio');
    const closePopupBtn = document.getElementById('close-popup');
    const blurOverlay = document.querySelector('.blur-overlay');
    
    if (audio && toggleBtn && closePopupBtn && blurOverlay) {
        closePopupBtn.addEventListener('click', () => {
            blurOverlay.style.display = 'none';
            toggleBtn.style.display = 'block';
            audio.muted = false;
            audio.play().catch(e => console.log('Error al reproducir:', e));
        });

        toggleBtn.addEventListener('click', () => {
            audio.muted = !audio.muted;
            const icon = toggleBtn.querySelector('i');
            icon.className = audio.muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
        });
    }

    // Modal Intro Popup
    const introPopup = document.getElementById('intro-popup');
    if (introPopup && closePopupBtn) {
        setTimeout(() => {
            introPopup.style.display = 'flex';
        }, 500);
        closePopupBtn.addEventListener('click', () => {
            introPopup.style.display = 'none';
        });
    }

    // Memory Popup Functionality
    const memoryPopup = document.getElementById('popup-memory-form');

    // Abrir el popup al hacer click en .memory-submit
    document.addEventListener("click", function(event) {
        if (event.target && event.target.classList.contains("memory-submit")) {
            event.preventDefault();
            if (memoryPopup) {
                memoryPopup.style.display = "flex";
            }
        }
    });

    // Cerrar popups (en general) cuando se clickea la X
    document.querySelectorAll('.close-popup').forEach(function (el) {
        el.addEventListener('click', function () {
            const popupContainer = this.closest('.popup-content')?.parentElement;
            if (popupContainer) {
                popupContainer.style.display = 'none';
            }
        });
    });

    // Cierra el memory popup si clickean afuera
    window.addEventListener("click", function(event) {
        if (event.target === memoryPopup) {
            memoryPopup.style.display = "none";
        }
    });

    // Al enviar el formulario de Memory
    document.addEventListener('wpcf7submit', function (event) {
        console.log('Formulario enviado:', event.detail);
        if (event.detail.status === 'mail_sent') {
            // Ocultar el popup del formulario
            const memoryPopup = document.getElementById('popup-memory-form');
            if (memoryPopup) {
                memoryPopup.style.display = 'none';
            }
            
            // Mostrar el popup de agradecimiento
            const thankYouPopup = document.getElementById('popup-thank-you');
            if (thankYouPopup) {
                thankYouPopup.style.display = 'flex';
            } else {
                console.error('No se encontró el popup-thank-you');
            }
        }
    });

    const form = document.querySelector('.wpcf7 form');
    const submitBtn = form.querySelector('input[type="submit"]');

    // Función para validar todos los campos obligatorios
    function validateForm() {
      let isValid = true;

      // Lista de IDs de campos obligatorios
      const requiredFields = [
        'full-name',
        'your-email',
        'phone',
        'city',
        'your-country',
      ];

      requiredFields.forEach(id => {
        const field = form.querySelector('#' + id);
        if (!field || !field.value.trim()) {
          isValid = false;
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          isValid = false;
        }
      });

      // Validar checkbox
      const checkbox = form.querySelector('input[name="privacy-accept[]"]');
      if (!checkbox || !checkbox.checked) {
        isValid = false;
      }

      // Activar/desactivar el botón
      submitBtn.disabled = !isValid;
    }

    // Escuchar cambios en los campos
    form.addEventListener('input', validateForm);
    form.addEventListener('change', validateForm);

    // Desactivar botón al cargar la página
    submitBtn.disabled = true;

});
