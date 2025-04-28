<?php
/**
 * Template Name: Mapa Interactivo
 */

get_header(); ?>

<div id="map-container">
    <div id="map"></div>
    <div class="map-instruction">Busca tu lugar en el mapa y deja tu recuerdo</div>
    <button id="add-memory-btn" class="memory-button">
        <i class="fas fa-plus"></i> Agrega tu recuerdo
    </button>
</div>

<!-- Popup (inicialmente oculto) -->
<div id="popup-memory-form" style="display: none;">
    <div class="popup-content">
        <span class="close-popup">&times;</span>
        
        <!-- Mensaje en español -->
        <h3>Gracias por tu memoria</h3>
        <p>Tu memoria ha sido añadida a la cola de moderación y será publicada en el sitio una vez aprobada. Por favor, vuelve más tarde para ver tu memoria.</p>

        <h4>Únete a la lista de correo</h4>
        <p>Recibe todas las últimas actualizaciones.</p>

        <!-- El formulario de Contact Form 7 -->
        <?php echo do_shortcode('[contact-form-7 id="a382450" title="Memory"]'); ?>
    </div>
</div>

<?php get_footer(); ?>