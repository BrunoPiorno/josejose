<?php $popup_title = get_field('popup_title', 'option');
$popup_subtitle = get_field('popup_subtitle', 'option');
$popup_description = get_field('popup_description', 'option');
$popup_button = get_field('popup_button_text', 'option');
$logo = get_field('header_logo', 'option');
?>

<?php if ($popup_title && $popup_description): ?>
<div class="blur-overlay"></div>
<div id="intro-popup" class="popup-overlay">
	<div class="modal">	
		<div class="intro-block-left desktop-image">
			<?php get_template_part('inc/image', null, ['image' => get_field('image', 'option')]); ?>
		</div>
		<div class="intro-block-left mobile-image">
			<?php get_template_part('inc/image', null, ['image' => get_field('image_mobile', 'option')]); ?>
		</div>
		<div class="intro-block-right">
			<div class="intro-block-image">
				<img src="<?php echo esc_url($logo['url']); ?>" alt="Logo" class="site-logo" />
			</div>
			<h2><?php echo esc_html($popup_subtitle); ?></h2>
			<div class="intro-block-description">
				<?php echo $popup_description; ?>
			</div>
			<button class="button" id="close-popup"><?php echo esc_html($popup_button); ?></button>
		</div>
	</div>
</div>

<?php endif;