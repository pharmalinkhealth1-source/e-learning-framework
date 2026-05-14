<?php
/**
 * Plugin Name: Elementor Flip Card Carousel
 * Description: A custom Elementor widget to display a dynamically managed, flipping card carousel.
 * Version: 1.0.0
 * Author: Your Name
 * Text Domain: elementor-flip-card-carousel
 * Domain Path: /languages
 */

namespace FlipCardCarousel;

// Security: Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Main plugin class.
 *
 * This class orchestrates the loading of all plugin components.
 */
final class Plugin {

    /**
     * Plugin instance.
     *
     * @var Plugin
     */
    private static $instance = null;

    /**
     * Singleton instance method.
     *
     * @return Plugin The one and only instance of the Plugin class.
     */
    public static function instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Plugin constructor.
     *
     * Private to enforce the singleton pattern.
     */
    private function __construct() {
        add_action('plugins_loaded', [$this, 'init']);
    }

    /**
     * Initialize the plugin.
     *
     * This method hooks into WordPress and Elementor to register our components.
     */
    public function init() {
        // Check if Elementor is installed and activated
        if (!did_action('elementor/loaded')) {
            add_action('admin_notices', [$this, 'admin_notice_missing_elementor']);
            return;
        }

        // Check for minimum Elementor version
        if (!version_compare(ELEMENTOR_VERSION, '3.0.0', '>=')) {
            add_action('admin_notices', [$this, 'admin_notice_minimum_elementor_version']);
            return;
        }

        // Load the custom post type
        require_once plugin_dir_path(__FILE__) . 'includes/custom-post-type.php';

        // Register the widgets with Elementor
        add_action('elementor/widgets/register', [$this, 'register_widgets']);

        // Enqueue styles and scripts for the frontend
        add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts']);
    }

    /**
     * Register the custom Elementor widget.
     *
     * @param \Elementor\Widgets_Manager $widgets_manager The Elementor widgets manager.
     */
    public function register_widgets($widgets_manager) {
        // Load the widget class files
        require_once plugin_dir_path(__FILE__) . 'widgets/flip-card-carousel-widget.php';
        require_once plugin_dir_path(__FILE__) . 'widgets/flip-card-carousel-widget-cpt.php';

        // Register the manual repeater version
        $widgets_manager->register(new \FlipCardCarousel\Widgets\Flip_Card_Carousel_Widget());
        
        // Register the custom post type version
        $widgets_manager->register(new \FlipCardCarousel\Widgets\Flip_Card_Carousel_Widget_CPT());
    }

    /**
     * Admin notice for missing Elementor.
     *
     * Warning when Elementor is not installed or activated.
     */
    public function admin_notice_missing_elementor() {
        if (isset($_GET['activate'])) {
            unset($_GET['activate']);
        }

        $message = sprintf(
            /* translators: 1: Plugin name 2: Elementor */
            esc_html__('"%1$s" requires "%2$s" to be installed and activated.', 'elementor-flip-card-carousel'),
            '<strong>' . esc_html__('Elementor Flip Card Carousel', 'elementor-flip-card-carousel') . '</strong>',
            '<strong>' . esc_html__('Elementor', 'elementor-flip-card-carousel') . '</strong>'
        );

        printf('<div class="notice notice-warning is-dismissible"><p>%1$s</p></div>', $message);
    }

    /**
     * Admin notice for minimum Elementor version.
     *
     * Warning when the site doesn't have a minimum required Elementor version.
     */
    public function admin_notice_minimum_elementor_version() {
        if (isset($_GET['activate'])) {
            unset($_GET['activate']);
        }

        $message = sprintf(
            /* translators: 1: Plugin name 2: Elementor 3: Required Elementor version */
            esc_html__('"%1$s" requires "%2$s" version %3$s or greater.', 'elementor-flip-card-carousel'),
            '<strong>' . esc_html__('Elementor Flip Card Carousel', 'elementor-flip-card-carousel') . '</strong>',
            '<strong>' . esc_html__('Elementor', 'elementor-flip-card-carousel') . '</strong>',
            '3.0.0'
        );

        printf('<div class="notice notice-warning is-dismissible"><p>%1$s</p></div>', $message);
    }

    /**
     * Enqueue the necessary scripts and styles.
     *
     * The scripts will be loaded on every page, but this could be
     * optimized further by checking if the widget is present on the page.
     */
    public function enqueue_scripts() {
        // Enqueue the CSS file.
        wp_enqueue_style(
            'flip-card-style',
            plugins_url('assets/css/flip-card-style.css', __FILE__),
            [],
            '1.0.0'
        );

        // Enqueue the JavaScript file.
        wp_enqueue_script(
            'flip-card-script',
            plugins_url('assets/js/flip-card-script.js', __FILE__),
            ['elementor-frontend'], // Ensure it loads after Elementor's frontend script.
            '1.0.0',
            true // Load in the footer for better performance.
        );
    }
}

// Start the plugin by getting the single instance.
Plugin::instance();