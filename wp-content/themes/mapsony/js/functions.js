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

    // Modal Functionality
    const popup = document.getElementById('intro-popup');
    const closeBtn = document.getElementById('close-popup');
    
    if (popup && closeBtn) {
        setTimeout(() => {
            popup.style.display = 'flex';
        }, 500);
        
        closeBtn.addEventListener('click', () => {
            popup.style.display = 'none';
        });
    }

    // Memory Popup Functionality
    const submitButton = document.querySelector(".memory-submit");
    const memoryPopup = document.getElementById("popup-memory-form");
    const closeMemoryPopup = memoryPopup ? memoryPopup.querySelector(".close-popup") : null;

    // Delegación de eventos: Escuchamos el click en el documento
    document.addEventListener("click", function(event) {
        // Verifica si el botón .memory-submit ha sido clickeado
        if (event.target && event.target.classList.contains("memory-submit")) {
            event.preventDefault(); // Prevenir la acción por defecto si es necesario
            memoryPopup.style.display = "flex"; // Muestra el popup
        }
    });

    // Cierra el popup cuando se hace clic en la 'X'
    if (closeMemoryPopup) {
        closeMemoryPopup.addEventListener("click", function() {
            memoryPopup.style.display = "none"; // Oculta el popup
        });
    }

    // Cierra el popup si el usuario hace clic fuera del contenido del popup
    window.addEventListener("click", function(event) {
        if (event.target === memoryPopup) {
            memoryPopup.style.display = "none"; // Oculta el popup
        }
    });
});
