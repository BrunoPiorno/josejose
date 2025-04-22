// Audio Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
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
});

// Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
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
});