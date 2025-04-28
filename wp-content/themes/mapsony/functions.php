<?php
/**
 * mapsony functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package mapsony
 */

if ( ! defined( '_S_VERSION' ) ) {
	// Replace the version number of the theme on each release.
	define( '_S_VERSION', '1.0.0' );
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function mapsony_setup() {
	/*
		* Make theme available for translation.
		* Translations can be filed in the /languages/ directory.
		* If you're building a theme based on mapsony, use a find and replace
		* to change 'mapsony' to the name of your theme in all the template files.
		*/
	load_theme_textdomain( 'mapsony', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
		* Let WordPress manage the document title.
		* By adding theme support, we declare that this theme does not use a
		* hard-coded <title> tag in the document head, and expect WordPress to
		* provide it for us.
		*/
	add_theme_support( 'title-tag' );

	/*
		* Enable support for Post Thumbnails on posts and pages.
		*
		* @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		*/
	add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus(
		array(
			'menu-1' => esc_html__( 'Primary', 'mapsony' ),
		)
	);

	/*
		* Switch default core markup for search form, comment form, and comments
		* to output valid HTML5.
		*/
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);

	// Set up the WordPress core custom background feature.
	add_theme_support(
		'custom-background',
		apply_filters(
			'mapsony_custom_background_args',
			array(
				'default-color' => 'ffffff',
				'default-image' => '',
			)
		)
	);

	// Add theme support for selective refresh for widgets.
	add_theme_support( 'customize-selective-refresh-widgets' );

	/**
	 * Add support for core custom logo.
	 *
	 * @link https://codex.wordpress.org/Theme_Logo
	 */
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 250,
			'width'       => 250,
			'flex-width'  => true,
			'flex-height' => true,
		)
	);
}
add_action( 'after_setup_theme', 'mapsony_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function mapsony_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'mapsony_content_width', 640 );
}
add_action( 'after_setup_theme', 'mapsony_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function mapsony_widgets_init() {
	register_sidebar(
		array(
			'name'          => esc_html__( 'Sidebar', 'mapsony' ),
			'id'            => 'sidebar-1',
			'description'   => esc_html__( 'Add widgets here.', 'mapsony' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);
}
add_action( 'widgets_init', 'mapsony_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function mapsony_scripts() {
    wp_enqueue_style( 'mapsony-style', get_stylesheet_uri(), array(), _S_VERSION );
    wp_style_add_data( 'mapsony-style', 'rtl', 'replace' );

    wp_enqueue_style( 'mapsony-header', get_template_directory_uri() . '/css/header.css', array(), _S_VERSION );
    wp_enqueue_style( 'mapsony-footer', get_template_directory_uri() . '/css/footer.css', array(), _S_VERSION );
    wp_enqueue_style( 'mapsony-popup', get_template_directory_uri() . '/css/popup.css', array(), _S_VERSION );

    wp_enqueue_script( 'mapsony-navigation', get_template_directory_uri() . '/js/navigation.js', array(), _S_VERSION, true );
    wp_enqueue_script( 'mapsony-functions', get_template_directory_uri() . '/js/functions.js', array(), _S_VERSION, true );

    // Primero Leaflet (dependencia)
    wp_enqueue_script('leaflet', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', array(), '1.9.4', true);
    wp_enqueue_style('leaflet-css', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', array(), '1.9.4');

    // Luego nuestro script
    wp_enqueue_script('mapsony-map-interactions', get_template_directory_uri() . '/js/map-interactions.js', array('leaflet', 'jquery'), _S_VERSION, true);

    // Localización de variables
    wp_localize_script('mapsony-map-interactions', 'mapsony_vars', array(
        'rest_url' => rest_url('wp/v2/'),
        'save_memory_url' => rest_url('mapsony/v1/save-memory/'),
        'nonce' => wp_create_nonce('wp_rest'),
        'site_url' => get_site_url(),
        'popup_message' => get_field('popup_message', 'option'),
        'pin_icon' => get_field('pin_icon', 'option')['url'] ?? '', // Obtener la URL de la imagen
        'subscription_form_html' => do_shortcode('[contact-form-7 id="bbf3b31" title="Newsletter Subscription"]')
    ));

    if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
        wp_enqueue_script( 'comment-reply' );
    }
}
add_action( 'wp_enqueue_scripts', 'mapsony_scripts' );

// Cargar Font Awesome
function enqueue_font_awesome() {
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
}
add_action('wp_enqueue_scripts', 'enqueue_font_awesome');

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require get_template_directory() . '/inc/jetpack.php';
}

// Agregar página de opciones al menú de WordPress
if (function_exists('acf_add_options_page')) {
    acf_add_options_page(array(
        'page_title'  => 'Opciones del Sitio',
        'menu_title'  => 'Options',
        'menu_slug'   => 'site-options',
        'capability'  => 'edit_posts',
        'redirect'    => false,
        'position'    => 25, // Justo debajo de Comentarios
        'icon_url'    => 'dashicons-admin-generic',
    ));
}

// Registrar campos meta en la API REST
function register_memory_meta() {
    register_post_meta('memory', 'latitude', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string'
    ));
    
    register_post_meta('memory', 'longitude', array(
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string'
    ));
}
add_action('init', 'register_memory_meta');

// Registrar Custom Post Type para Memorias
function register_memory_post_type() {
    $args = array(
        'public' => true,
        'label'  => 'Memorias',
        'show_in_rest' => true,
        'supports' => array('title', 'editor', 'custom-fields'),
        'menu_icon' => 'dashicons-heart',
        'has_archive' => true,
        'rewrite' => array('slug' => 'memories'),
        'show_in_rest' => true,
        'rest_base' => 'memories',
        'publicly_queryable' => true,
        'exclude_from_search' => false,
        'capability_type' => 'post',
        'map_meta_cap' => true,
        'hierarchical' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_nav_menus' => true,
        'show_in_admin_bar' => true,
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        'capabilities' => array(
            'edit_post' => 'edit_post',
            'read_post' => 'read_post',
            'delete_post' => 'delete_post',
            'edit_posts' => 'edit_posts',
            'edit_others_posts' => 'edit_others_posts',
            'publish_posts' => 'publish_posts',
            'read_private_posts' => 'read_private_posts'
        )
    );
    register_post_type('memory', $args);

    // Registrar campos personalizados para la API REST
    register_rest_field('memory', 'latitude', array(
        'get_callback' => function($post_arr) {
            return get_post_meta($post_arr['id'], 'latitude', true);
        },
        'schema' => array(
            'type' => 'string'
        )
    ));

    register_rest_field('memory', 'longitude', array(
        'get_callback' => function($post_arr) {
            return get_post_meta($post_arr['id'], 'longitude', true);
        },
        'schema' => array(
            'type' => 'string'
        )
    ));
}
add_action('init', 'register_memory_post_type');

// API para guardar memorias
function save_memory_api() {
    register_rest_route('mapsony/v1', '/save-memory/', array(
        'methods' => 'POST',
        'callback' => 'save_memory_callback',
        'permission_callback' => '__return_true'
    ));
}

function save_memory_callback($request) {
    $params = $request->get_params();
    
    $post_id = wp_insert_post(array(
        'post_title' => sanitize_text_field($params['title']),
        'post_content' => sanitize_textarea_field($params['content']),
        'post_type' => 'memory',
        'post_status' => 'pending'
    ));
    
    if($post_id) {
        update_post_meta($post_id, 'latitude', sanitize_text_field($params['latitude']));
        update_post_meta($post_id, 'longitude', sanitize_text_field($params['longitude']));
        
        // Obtener los datos actualizados para devolverlos
        $post = get_post($post_id);
        return array(
            'id' => $post_id,
            'title' => array('rendered' => $post->post_title),
            'content' => array('rendered' => apply_filters('the_content', $post->post_content)),
            'meta' => array(
                'latitude' => get_post_meta($post_id, 'latitude', true),
                'longitude' => get_post_meta($post_id, 'longitude', true)
            )
        );
    }
    
    return new WP_Error('error', 'Error saving memory', array('status' => 500));
}
add_action('rest_api_init', 'save_memory_api');
