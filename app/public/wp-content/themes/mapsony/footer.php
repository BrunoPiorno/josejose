<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package mapsony
 */

?>

	<footer id="colophon" class="site-footer">
		<div class="site-info">
			<div class="footer-logos">
				<?php 
				$spotify_logo = get_field('sporify', 'option');
				$spotify_link = get_field('spotify_link', 'option');
				$sony_logo = get_field('sony', 'option');
				$sony_link = get_field('sony_link', 'option');
				if ($spotify_logo): ?>
					<div class="footer-logo spotify">
						<?php if ($spotify_link): ?>
							<a href="<?php echo esc_url($spotify_link); ?>" target="_blank" rel="noopener noreferrer">
						<?php endif; ?>
						<img src="<?php echo esc_url($spotify_logo['url']); ?>" 
							alt="<?php echo esc_attr($spotify_logo['alt']); ?>" 
							width="auto" height="30">
						<?php if ($spotify_link): ?>
							</a>
						<?php endif; ?>
					</div>
				<?php endif; 
				if ($sony_logo): ?>
					<div class="footer-logo sony">
						<?php if ($sony_link): ?>
							<a href="<?php echo esc_url($sony_link); ?>" target="_blank" rel="noopener noreferrer">
						<?php endif; ?>
						<img src="<?php echo esc_url($sony_logo['url']); ?>" 
							alt="<?php echo esc_attr($sony_logo['alt']); ?>" 
							width="auto" height="30">
						<?php if ($sony_link): ?>
							</a>
						<?php endif; ?>
					</div>
				<?php endif; ?>
			</div>
			<div class="footer-container">
				<div class="footer-links-section">

					<?php if (have_rows('links', 'option')) : ?>
						<nav class="footer-links">
							<ul>
								<?php while (have_rows('links', 'option')) : the_row(); 
									$link = get_sub_field('link');
									if ($link): 
										$url = $link['url'];
										$title = $link['title'];
										$target = $link['target'] ? $link['target'] : '_self'; ?>
									<li><a href="<?php echo esc_url($url); ?>" target="<?php echo esc_attr($target); ?>"><?php echo esc_html($title); ?></a></li>
								<?php endif; ?>
								<?php endwhile; ?>
							</ul>
						</nav>
					<?php endif; ?>
				</div>

				<div class="social-icons">
					<?php if (have_rows('socials', 'option')) : 
						while (have_rows('socials', 'option')) : the_row();
							$link = get_sub_field('link');
							if ($link) : ?>
								<a href="<?php echo esc_url($link); ?>" target="_blank" rel="noopener noreferrer" class="social-icon">
									<?php if (strpos($link, 'tiktok') !== false) : ?>
										<i class="fab fa-tiktok"></i>
									<?php elseif (strpos($link, 'youtube') !== false) : ?>
										<i class="fab fa-youtube"></i>
									<?php endif; ?>
								</a>
							<?php endif;
						endwhile;
					endif; ?>
				</div>
			</div>
		</div><!-- .site-info -->
	</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>
<?php get_template_part('inc/popup'); ?>

</body>
</html>
