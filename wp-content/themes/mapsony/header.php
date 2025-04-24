<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package mapsony
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
	<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
	<link rel="icon" type="image/x-icon" href="<?php echo get_template_directory_uri(); ?>/images/me-gusta.png">
	<?php wp_head(); ?>
	<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</head>
<?php
$logo = get_field('header_logo', 'option');
$audio = get_field('background_music', 'option');
?>

<header class="site-header">
    <div class="container">
        <?php if ($logo): ?>
            <div class="logo-link">
                <a href="<?php echo esc_url(home_url('/')); ?>">
                    <img src="<?php echo esc_url($logo['url']); ?>" alt="Logo" class="site-logo" />
                </a>
            </div>
        <?php endif; ?>
    </div>
</header>

<?php if ($audio): ?>
    <audio id="site-audio" muted loop>
        <source src="<?php echo esc_url($audio['url']); ?>" type="audio/mpeg">
        Tu navegador no soporta audio HTML5.
    </audio>

    <button id="toggleAudio" class="audio-toggle" aria-label="Toggle Audio">
        <i class="fa-solid fa-volume-high"></i>
    </button>
<?php endif; ?>