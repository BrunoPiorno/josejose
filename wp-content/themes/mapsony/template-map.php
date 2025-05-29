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
        
        <hr>

        <h4>Únete a la lista de correo</h4>
        <p>Sí quieres recibir información exclusiva de José José, inscríbete aquí.</p>

        <!-- El formulario de Contact Form 7 -->
        <?php echo do_shortcode('[contact-form-7 id="ac75432" title="Memory"]'); ?>
    </div>
</div>

<!-- Popup de Gracias (inicialmente oculto) -->
<div id="popup-thank-you" style="display: none;">
  <div class="popup-content">
    <span class="close-popup">&times;</span>
    <h3>¡GRACIAS POR TU SUSCRIPCIÓN!</h3>
    <p>Tu participación ha sido enviada a la cola de moderación y se añadirá al sitio una vez aprobada. Por favor, vuelve más tarde para encontrar tu publicación.</p>
    
    <hr>

    <p>¡Gracias por registrarte!</p>
  </div>
</div>


<?php get_footer(); ?>