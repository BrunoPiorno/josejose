document.addEventListener('DOMContentLoaded', function () {
    // 1. Crear el mapa
    const map = L.map('map', {
        worldCopyJump: false,  // Deshabilitamos la repetición
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0,
        zoomSnap: 1,
        minZoom: 2,  // Zoom mínimo para evitar ver múltiples copias
        maxZoom: 19,
        noWrap: true,  // Evitar que el mapa se repita horizontalmente
        backgroundColor: '#E2E6E7'
    }).setView([30, -30], 3); // Ajusta el zoom (3) y centro si es necesario

    // --- Crear un Pane para la capa GeoJSON ---
    map.createPane('overlayPane');
    map.getPane('overlayPane').style.zIndex = 300; // zIndex entre tiles (200) y marcadores (400+)
    map.getPane('overlayPane').style.pointerEvents = 'none'; // No interferir con clics

    // 2. Capa base del mapa (los tiles de CartoDB)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        opacity: 0.6,  // Hacer el mapa base un poco más tenue
        noWrap: true,  // Evitar que los tiles se repitan
        bounds: [[-90, -180], [90, 180]]  // Limitar los tiles al mundo
    }).addTo(map);

    // Agregar evento de clic al mapa base
    map.on('click', function(e) {
        if (!addMemoryMode) return;
        
        // Prevenir que el clic se propague si es en un control o popup
        if (e.originalEvent && (e.originalEvent.target.closest('.leaflet-control') || e.originalEvent.target.closest('.leaflet-popup-content'))) {
            return;
        }

        // Verificar si el clic fue en un país permitido
        let clickedOnAllowedCountry = false;
        
        map.eachLayer((layer) => {
            if (layer.feature && layer.feature.properties) {
                const countryName = (layer.feature.properties.name || '').toLowerCase();
                if (countriesToShow.includes(countryName) && layer.getBounds && layer.getBounds().contains(e.latlng)) {
                    clickedOnAllowedCountry = true;
                }
            }
        });

        if (!clickedOnAllowedCountry) {
            // Crear y mostrar el popup de error
            L.popup({
                className: 'error-popup',
                closeButton: true,
                closeOnClick: true,
                autoClose: true
            })
            .setLatLng(e.latlng)
            .setContent(mapsony_vars.popup_message)
            .openOn(map);
        }
    });

    // 3. Lista de códigos ISO A2 de países a mostrar (América + España)
    const countriesToShow = [
        // América del Norte
        'canada',
        'united states of america',
        'mexico',
        'greenland',
        'bermuda',

        // América Central
        'guatemala',
        'belize',
        'el salvador',
        'honduras',
        'nicaragua',
        'costa rica',
        'panama',

        // Caribe
        'cuba',
        'jamaica',
        'haiti',
        'dominican republic',
        'puerto rico',
        'trinidad and tobago',
        'bahamas',
        'barbados',
        'saint lucia',
        'saint vincent and the grenadines',
        'grenada',
        'antigua and barbuda',
        'saint kitts and nevis',
        'dominica',
        'aruba',
        'curacao',
        'sint maarten',
        'bonaire',
        'sint eustatius',
        'saba',
        'turks and caicos islands',
        'cayman islands',
        'british virgin islands',
        'anguilla',
        'montserrat',
        'guadeloupe',
        'martinique',
        'saint martin',
        'saint barthelemy',

        // América del Sur
        'colombia',
        'venezuela',
        'guyana',
        'suriname',
        'ecuador',
        'peru',
        'bolivia',
        'chile',
        'paraguay',
        'argentina',
        'uruguay',
        'brazil',

        // Europa (extra)
        'spain'
    ];

    // 4. Cargar datos geográficos de países
    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }   
            return response.json();
        })
        .then(data => {
            // 5. Añadir la capa GeoJSON con el estilo condicional
            L.geoJSON(data, {
                interactive: true,
                style: function(feature) {
                    const props = feature.properties;
                    const countryName = (props.name || '').toLowerCase();
                
                    if (countryName && countriesToShow.includes(countryName)) {
                        return {
                            fillColor: 'transparent',
                            color: '#666666',
                            weight: 0.5,
                            fillOpacity: 0,
                            opacity: 0.5,
                            draggable: false
                        };
                    } else {
                        return {
                            fillColor: '#E2E6E7',
                            fillOpacity: 0.5,
                            color: '#E2E6E7',
                            opacity: 1,
                            weight: 2,  // Hacemos el borde más grueso
                            draggable: false,
                            interactive: false
                        };
                    }
                },  
                
                onEachFeature: function(feature, layer) {
                    const countryName = (feature.properties.name || '').toLowerCase();
                    if (countryName && countriesToShow.includes(countryName)) {
                        
                        layer.on('click', function(e) {
                            if (addMemoryMode) {
                                const clickedCountry = feature.properties.name;
                                const latlng = e.latlng;

                                if(tempMarker) map.removeLayer(tempMarker);

                                // Debug: Ver el valor del pin_icon
                                console.log('Pin Icon URL:', mapsony_vars.pin_icon);

                                tempMarker = L.marker(latlng, {
                                    icon: L.divIcon({
                                        html: `<img src="${mapsony_vars.pin_icon}" alt="Memory Pin" style="width:24px; height:24px; display:block;">`,
                                        iconSize: [24, 24],
                                        iconAnchor: [12, 24],
                                        className: 'temp-marker'
                                    }),
                                    draggable: true
                                }).addTo(map);

                                memoryInstructions.style.display = 'none';

                                // Calcular la posición del popup
                                const popupOffset = L.point(0, 20); // Offset vertical de 20px
                                const popupOptions = {
                                    offset: popupOffset,
                                    autoPan: true,
                                    autoPanPadding: [50, 100], // Padding extra en la parte superior
                                    maxHeight: 400 // Altura máxima del popup
                                };

                                tempMarker.bindPopup(`
                                    <div class="memory-form">
                                        <h3>Deja tu recuerdo en ${clickedCountry}</h3>
                                        <input type="text" class="memory-screenname" placeholder="Nombre (así aparecerás en el mapa)">
                                        <textarea class="memory-content" placeholder="Escribe tu recuerdo"></textarea>
                                        <div class="memory-footer">
                                            <p>Al enviar un recuerdo, aceptas los <a href="/terminos-y-condiciones" target="_blank">Términos y condiciones</a></p>
                                            <div class="memory-buttons">
                                                <button class="memory-back">Atrás</button>
                                                <button class="memory-submit">Siguiente</button>
                                            </div>
                                        </div>
                                    </div>
                                `, {
                                    closeButton: true,
                                    closeOnClick: false,
                                    autoClose: false,
                                    className: 'memory-popup'
                                }).openPopup();
                            }
                        });
                    }
                },                
                pane: 'overlayPane'
            }).addTo(map);
        })
        .catch(error => {
            console.error("Error loading or processing GeoJSON:", error);
            alert("Could not load the country overlay layer. The map might not look as expected.");
        });

    let tempMarker = null;
    let addMemoryMode = false;
    let markers = {};  // Objeto para guardar marcadores por coordenadas
    let allMemories = [];
    let currentMemoryIndex = 0;
    
    const addMemoryBtn = document.getElementById('add-memory-btn');
    const memoryInstructions = document.createElement('div');
    memoryInstructions.id = 'memory-instructions';
    memoryInstructions.style.display = 'none';
    memoryInstructions.innerHTML = `
        <div class="instructions-content">
            <p>Haz clic en un país resaltado</p>
        </div>
    `;
    document.querySelector('#map').appendChild(memoryInstructions);

    if (addMemoryBtn) {
        addMemoryBtn.addEventListener('click', toggleMemoryMode);
    }

    document.addEventListener('click', handleButtonClicks);

    function toggleMemoryMode() {
        addMemoryMode = !addMemoryMode;
        
        if (addMemoryMode) {
            addMemoryBtn.innerHTML = '<i class="fas fa-times"></i> Salir';
            addMemoryBtn.classList.add('active');
            memoryInstructions.style.display = 'block';
        } else {
            addMemoryBtn.innerHTML = '<i class="fas fa-plus"></i> Agrega tu recuerdo';
            addMemoryBtn.classList.remove('active');
            memoryInstructions.style.display = 'none';
            if (tempMarker) {
                map.removeLayer(tempMarker);
                tempMarker = null;
            }
            // Cerrar cualquier popup abierto
            map.closePopup();
        }
    }

    async function loadMemories() {
        try {
            const response = await fetch('/wp-json/wp/v2/memories?per_page=100');
            allMemories = await response.json();
            
            allMemories.forEach((memory) => {
                const lat = memory.meta?.latitude;
                const lng = memory.meta?.longitude;
                
                if (lat && lng) {
                    const marker = L.marker([
                        parseFloat(lat),
                        parseFloat(lng)
                    ], {
                        icon: L.divIcon({
                            html: `<img src="${mapsony_vars.pin_icon}" alt="Memory Pin" style="width:24px; height:24px; display:block;">`,
                            iconSize: [24, 24],
                            iconAnchor: [12, 24],
                            className: 'memory-marker'
                        })
                    }).addTo(map);

                    marker.bindPopup(createMemoryPopup(memory, lat, lng));

                    // Guardar el marcador usando las coordenadas como clave
                    markers[`${lat},${lng}`] = marker;

                    // Agregar event listener para los botones
                    const popup = marker.getPopup();
                    popup.on('add', () => {
                        const popupContent = popup.getElement();
                        if (popupContent) {
                            popupContent.addEventListener('click', handleButtonClicks);
                        }
                        // Actualizar el índice actual cuando se abre un popup
                        const index = allMemories.findIndex(m => 
                            m.meta?.latitude === lat && 
                            m.meta?.longitude === lng
                        );
                        if (index !== -1) currentMemoryIndex = index;
                    });
                }
            });
        } catch (error) {
            console.error('Error loading memories:', error);
        }
    }

    function navigateMemory(direction) {
        // Calcular el siguiente índice
        if (direction === 'next') {
            currentMemoryIndex = (currentMemoryIndex + 1) % allMemories.length;
        } else {
            currentMemoryIndex = (currentMemoryIndex - 1 + allMemories.length) % allMemories.length;
        }

        const nextMemory = allMemories[currentMemoryIndex];
        const lat = nextMemory.meta?.latitude;
        const lng = nextMemory.meta?.longitude;

        if (lat && lng) {
            // Cerrar todos los popups
            Object.values(markers).forEach(marker => marker.closePopup());
            
            // Abrir el popup correspondiente
            const marker = markers[`${lat},${lng}`];
            if (marker) {
                marker.openPopup();
                // Centrar el mapa en el marcador
                map.panTo(marker.getLatLng());
            }
        }
    }

    async function handleButtonClicks(e) {
        if(e.target.classList.contains('next-memory') || e.target.closest('.next-memory')) {
            e.preventDefault();
            navigateMemory('next');
        }
        
        if(e.target.classList.contains('prev-memory') || e.target.closest('.prev-memory')) {
            e.preventDefault();
            navigateMemory('prev');
        }
        
        const shareButton = e.target.classList.contains('social-button') ? e.target : e.target.closest('.social-button');
        if (shareButton) {
            e.preventDefault();
            const url = shareButton.dataset.url;
            const text = shareButton.dataset.text;

            if (shareButton.classList.contains('share-twitter')) {
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                window.open(twitterUrl, '_blank', 'width=550,height=420');
            }

            if (shareButton.classList.contains('share-facebook')) {
                const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                window.open(facebookUrl, '_blank', 'width=550,height=420');
            }

            if (shareButton.classList.contains('download-memory')) {
                const memoryId = shareButton.dataset.id;
                const popup = shareButton.closest('.leaflet-popup-content');
                
                if(popup) {
                    // Crear una copia del popup sin los botones sociales y flechas
                    const cleanPopup = popup.cloneNode(true);
                    const socialButtons = cleanPopup.querySelector('.memory-social');
                    const navButtons = cleanPopup.querySelectorAll('.nav-button');
                    
                    if (socialButtons) {
                        socialButtons.remove();
                    }
                    navButtons.forEach(button => button.remove());
                    
                    // Crear un contenedor temporal para el popup limpio
                    const tempContainer = document.createElement('div');
                    tempContainer.style.position = 'absolute';
                    tempContainer.style.left = '-9999px';
                    tempContainer.appendChild(cleanPopup);
                    document.body.appendChild(tempContainer);
                    
                    // Capturar la versión limpia
                    html2canvas(cleanPopup).then(popupCanvas => {
                        // Eliminar el contenedor temporal
                        document.body.removeChild(tempContainer);
                        
                        const finalCanvas = document.createElement('canvas');
                        const ctx = finalCanvas.getContext('2d');
                        
                        finalCanvas.width = 800;
                        finalCanvas.height = 600;
                        
                        const gradient = ctx.createLinearGradient(0, 0, 0, finalCanvas.height);
                        gradient.addColorStop(0, '#194569');
                        gradient.addColorStop(1, '#5F84A2');
                        ctx.fillStyle = gradient;
                        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
                        
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                        for(let i = 0; i < finalCanvas.width; i += 40) {
                            for(let j = 0; j < finalCanvas.height; j += 40) {
                                ctx.fillRect(i, j, 20, 20);
                            }
                        }
                        
                        const x = (finalCanvas.width - popupCanvas.width) / 2;
                        const y = (finalCanvas.height - popupCanvas.height) / 2;
                        
                        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                        ctx.shadowBlur = 20;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 10;
                        
                        ctx.drawImage(popupCanvas, x, y);
                        
                        ctx.shadowBlur = 0;
                        ctx.shadowOffsetY = 0;
                        ctx.font = 'bold 24px Arial';
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                        ctx.textAlign = 'center';
                        ctx.fillText('JOSÉ JOSÉ', finalCanvas.width / 2, 50);
                        
                        const link = document.createElement('a');
                        link.download = `josejose.png`;
                        link.href = finalCanvas.toDataURL('image/png');
                        link.click();
                    });
                }
            }
        }

        if(e.target.classList.contains('memory-submit')) {
            const popupContent = e.target.closest('.memory-form');
            const screenname = popupContent.querySelector('.memory-screenname').value;
            const content = popupContent.querySelector('.memory-content').value;
            const latlng = tempMarker.getLatLng();

            if(!content) {
                alert('Please enter your memory content');
                return;
            }

            try {
                const response = await fetch(mapsony_vars.save_memory_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-WP-Nonce': mapsony_vars.nonce
                    },
                    body: JSON.stringify({
                        title: screenname || 'Anonymous',
                        content: content,
                        latitude: latlng.lat.toString(),
                        longitude: latlng.lng.toString()
                    })
                });

                const responseData = await response.json();

                if(response.ok) {
                    // Agregar la nueva memoria al mapa
                    addMemoryToMap(responseData);
                    
                    // Limpiar el formulario y cerrar el popup
                    map.closePopup();
                    tempMarker = null;
                    addMemoryMode = false;
                    addMemoryBtn.innerHTML = '<i class="fas fa-plus"></i> Add a Memory';
                    addMemoryBtn.classList.remove('active');
                    memoryInstructions.style.display = 'none';
                } else {
                    console.error('Server response:', responseData);
                    throw new Error(responseData.message || 'Error saving memory');
                }
            } catch (error) {
                console.error('Error:', error);
                L.popup({
                    className: 'error-popup',
                    closeButton: true,
                    closeOnClick: true,
                    autoClose: true
                })
                .setLatLng(latlng)
                .setContent(mapsony_vars.popup_message)
                .openOn(map);
            }
        }

        if(e.target.classList.contains('memory-back')) {
            map.removeLayer(tempMarker);
            tempMarker = null;
            addMemoryBtn.textContent = 'Add a Memory';
            addMemoryMode = false;
            map.closePopup();
        }
    }

    if(typeof html2canvas === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
        document.head.appendChild(script);
    }

    // Función para crear el contenido del popup
    function createMemoryPopup(memory, lat, lng) {
        const shareUrl = window.location.origin + window.location.pathname + `?memory=${memory.id}`;
        const shareText = `${memory.title?.rendered} - Check out this memory from ${lat},${lng}`;
        
        return `
            <div class="memory-popup">
                <h3>${memory.title?.rendered}</h3>
                <div class="memory-text">${memory.content?.rendered}</div>
                <div class="memory-footer">
                    <button class="nav-button prev-memory">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <div class="memory-social">
                        <button class="social-button share-twitter" data-url="${shareUrl}" data-text="${shareText}">
                            <i class="fab fa-twitter"></i>
                        </button>
                        <button class="social-button share-facebook" data-url="${shareUrl}">
                            <i class="fab fa-facebook-f"></i>
                        </button>
                        <button class="social-button download-memory" data-id="${memory.id}">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                    <button class="nav-button next-memory">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // Función para agregar una nueva memoria al mapa
    function addMemoryToMap(memory) {
        const lat = memory.meta?.latitude;
        const lng = memory.meta?.longitude;
        
        if (lat && lng) {
            const marker = L.marker([parseFloat(lat), parseFloat(lng)], {
                icon: L.divIcon({
                    html: `<img src="${mapsony_vars.pin_icon}" alt="Memory Pin" style="width:24px; height:24px; display:block;">`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 24],
                    className: 'memory-marker'
                })
            }).addTo(map);

            marker.bindPopup(createMemoryPopup(memory, lat, lng));

            // Agregar event listener para los botones
            const popup = marker.getPopup();
            popup.on('add', () => {
                const popupContent = popup.getElement();
                if (popupContent) {
                    popupContent.addEventListener('click', handleButtonClicks);
                }
            });

            allMemories.push(memory);
        }
    }

    loadMemories();
});
