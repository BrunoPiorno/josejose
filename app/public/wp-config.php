<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'local' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          'x>4RJ1U]P;JClzm2~2`[<5jN-W.iHG71<O<089I4p[vfNMWr#53F@)Z%2snm;vH*' );
define( 'SECURE_AUTH_KEY',   '>_q Bincgzy}Ls:gS#T,4>+-MKn,yJLy,):i@q^TH)1RdrTyB28Rk-G7JyR6PK/4' );
define( 'LOGGED_IN_KEY',     '2C 5gr8@Cuu VmD G[Y ll`FGUSwQL7;}lKoh]2b}c<!mXNo~1JKcw*[VH]u7^d?' );
define( 'NONCE_KEY',         'ZAz-`0}LE7e@|Z>lK48VjgRp}[x=tV[f.q*w`Bcbp|,kS@yWp:0^;%/ lr *1Z45' );
define( 'AUTH_SALT',         'whuyft@g<3aru:F5&^bPq^H0v86Cj,Nkb`PH|bqnin4MGS+rB})5;ngaqTN~)HAW' );
define( 'SECURE_AUTH_SALT',  'F+g_R4u~b9ACP]r@{t@48Fn$Ia|F|`;7mc`WLif6Lc.<6qX3xYYY?v?}<89.jN]l' );
define( 'LOGGED_IN_SALT',    '5)Y9KOUX`z]qcsLmJYCe5r_&iDF&:j/DI1}K*Xta=|KmQFIp8LsTc795s9l4xhYr' );
define( 'NONCE_SALT',        'y)KDA=X :-~xFb6b)]G)uf2z?g;oxOAROx@>kN!u*3LT3m))92^NPq$ma;jDFUB[' );
define( 'WP_CACHE_KEY_SALT', '>)S{SzIWslCz!>!XLps [65HHcpecjIs]W9zt*O| Vx),I7SXuDrc( d`/SUem9M' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'WP_ENVIRONMENT_TYPE', 'local' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
