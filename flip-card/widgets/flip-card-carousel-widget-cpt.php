<?php
namespace FlipCardCarousel\Widgets;

use Elementor\Widget_Base;
use Elementor\Controls_Manager;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Elementor Flip Card Carousel Widget (Custom Post Type Version).
 *
 * This version pulls card data from a custom post type instead of using a repeater.
 *
 * @since 1.0.0
 */
class Flip_Card_Carousel_Widget_CPT extends Widget_Base {

	/**
	 * Get widget name.
	 */
	public function get_name() {
		return 'flip_card_carousel_cpt';
	}

	/**
	 * Get widget title.
	 */
	public function get_title() {
		return esc_html__( 'Flip Card Carousel (CPT)', 'elementor-flip-card-carousel' );
	}

	/**
	 * Get widget icon.
	 */
	public function get_icon() {
		return 'eicon-carousel';
	}

	/**
	 * Get widget categories.
	 */
	public function get_categories() {
		return [ 'general' ];
	}

	/**
	 * Register widget controls.
	 */
	protected function register_controls() {

		$this->start_controls_section(
			'content_section',
			[
				'label' => esc_html__( 'Query Settings', 'elementor-flip-card-carousel' ),
				'tab' => Controls_Manager::TAB_CONTENT,
			]
		);

		$this->add_control(
			'post_type',
			[
				'label' => esc_html__( 'Post Type', 'elementor-flip-card-carousel' ),
				'type' => Controls_Manager::TEXT,
				'default' => 'success_story',
				'description' => esc_html__( 'Enter the custom post type slug (e.g., "success_story")', 'elementor-flip-card-carousel' ),
			]
		);

		$this->add_control(
			'posts_per_page',
			[
				'label' => esc_html__( 'Number of Cards', 'elementor-flip-card-carousel' ),
				'type' => Controls_Manager::NUMBER,
				'default' => 3,
				'min' => 1,
				'max' => 20,
			]
		);

		$this->add_control(
			'order',
			[
				'label' => esc_html__( 'Order', 'elementor-flip-card-carousel' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'DESC',
				'options' => [
					'ASC' => esc_html__( 'Ascending', 'elementor-flip-card-carousel' ),
					'DESC' => esc_html__( 'Descending', 'elementor-flip-card-carousel' ),
				],
			]
		);

		$this->add_control(
			'orderby',
			[
				'label' => esc_html__( 'Order By', 'elementor-flip-card-carousel' ),
				'type' => Controls_Manager::SELECT,
				'default' => 'date',
				'options' => [
					'date' => esc_html__( 'Date', 'elementor-flip-card-carousel' ),
					'title' => esc_html__( 'Title', 'elementor-flip-card-carousel' ),
					'menu_order' => esc_html__( 'Menu Order', 'elementor-flip-card-carousel' ),
					'rand' => esc_html__( 'Random', 'elementor-flip-card-carousel' ),
				],
			]
		);

		$this->end_controls_section();

		// Field Mapping Section
		$this->start_controls_section(
			'field_mapping_section',
			[
				'label' => esc_html__( 'Field Mapping', 'elementor-flip-card-carousel' ),
				'tab' => Controls_Manager::TAB_CONTENT,
			]
		);

		$this->add_control(
			'field_mapping_info',
			[
				'type' => Controls_Manager::RAW_HTML,
				'raw' => '<p>' . esc_html__( 'Map your custom fields to the card elements. Leave empty to use default fields.', 'elementor-flip-card-carousel' ) . '</p>',
			]
		);

		$this->add_control(
			'name_field',
			[
				'label' => esc_html__( 'Name Field', 'elementor-flip-card-carousel' ),
				'type' => Controls_Manager::TEXT,
				'default' => 'person_name',
				'description' => esc_html__( 'Custom field key for the person\'s name', 'elementor-flip-card-carousel' ),
			]
		);

		$this->add_control(
			'job_title_field',
			[
				'label' => esc_html__( 'Job Title Field', 'elementor-flip-card-carousel' ),
				'type' => Controls_Manager::TEXT,
				'default' => 'job_title',
				'description' => esc_html__( 'Custom field key for job title', 'elementor-flip-card-carousel' ),
			]
		);

		$this->add_control(
			'quote_field',
			[
				'label' => esc_html__( 'Quote Field', 'elementor-flip-card-carousel' ),
				'type' => Controls_Manager::TEXT,
				'default' => 'quote',
				'description' => esc_html__( 'Custom field key for the quote', 'elementor-flip-card-carousel' ),
			]
		);

		$this->add_control(
			'description_field',
			[
				'label' => esc_html__( 'Description Field', 'elementor-flip-card-carousel' ),
				'type' => Controls_Manager::TEXT,
				'default' => 'description',
				'description' => esc_html__( 'Custom field key for the description (or leave empty to use post content)', 'elementor-flip-card-carousel' ),
			]
		);

		$this->add_control(
			'image_field',
			[
				'label' => esc_html__( 'Image Field', 'elementor-flip-card-carousel' ),
				'type' => Controls_Manager::TEXT,
				'default' => 'profile_image',
				'description' => esc_html__( 'Custom field key for the profile image (or leave empty to use featured image)', 'elementor-flip-card-carousel' ),
			]
		);

		$this->add_control(
			'link_field',
			[
				'label' => esc_html__( 'Link Field', 'elementor-flip-card-carousel' ),
				'type' => Controls_Manager::TEXT,
				'default' => 'story_link',
				'description' => esc_html__( 'Custom field key for the link (or leave empty to use post permalink)', 'elementor-flip-card-carousel' ),
			]
		);

		$this->end_controls_section();
	}

	/**
	 * Render widget output on the frontend.
	 */
	protected function render() {
		$settings = $this->get_settings_for_display();

		// Query arguments
		$args = [
			'post_type' => $settings['post_type'],
			'posts_per_page' => $settings['posts_per_page'],
			'order' => $settings['order'],
			'orderby' => $settings['orderby'],
			'post_status' => 'publish',
		];

		$query = new \WP_Query( $args );

		if ( ! $query->have_posts() ) {
			echo '<p>' . esc_html__( 'No cards found. Please create posts in the specified post type.', 'elementor-flip-card-carousel' ) . '</p>';
			return;
		}

		?>
		<div class="flip-card-carousel-container">
			<?php while ( $query->have_posts() ) : $query->the_post(); ?>
				<?php
				// Get field values
				$name = get_post_meta( get_the_ID(), $settings['name_field'], true );
				$job_title = get_post_meta( get_the_ID(), $settings['job_title_field'], true );
				$quote = get_post_meta( get_the_ID(), $settings['quote_field'], true );
				
				// Description: use custom field or post content
				$description = '';
				if ( ! empty( $settings['description_field'] ) ) {
					$description = get_post_meta( get_the_ID(), $settings['description_field'], true );
				}
				if ( empty( $description ) ) {
					$description = get_the_content();
				}

				// Image: use custom field or featured image
				$image_url = '';
				if ( ! empty( $settings['image_field'] ) ) {
					$image_id = get_post_meta( get_the_ID(), $settings['image_field'], true );
					if ( $image_id ) {
						$image_url = wp_get_attachment_image_url( $image_id, 'thumbnail' );
					}
				}
				if ( empty( $image_url ) && has_post_thumbnail() ) {
					$image_url = get_the_post_thumbnail_url( get_the_ID(), 'thumbnail' );
				}

				// Link: use custom field or post permalink
				$link = '';
				if ( ! empty( $settings['link_field'] ) ) {
					$link = get_post_meta( get_the_ID(), $settings['link_field'], true );
				}
				if ( empty( $link ) ) {
					$link = get_permalink();
				}
				?>

				<div class="flip-card">
					<div class="flip-card-inner">
						<!-- Front Face -->
						<div class="flip-card-front">
							<div class="card-header">
								<?php if ( $image_url ) : ?>
									<div class="card-image-wrapper">
										<img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $name ); ?>">
									</div>
								<?php endif; ?>
								<div class="card-meta">
									<h3 class="card-name"><?php echo esc_html( $name ); ?>,</h3>
									<h4 class="card-job-title"><?php echo esc_html( $job_title ); ?></h4>
								</div>
							</div>
							
							<div class="card-body">
								<?php if ( $quote ) : ?>
									<blockquote class="card-quote"><?php echo esc_html( $quote ); ?></blockquote>
								<?php endif; ?>
								<div class="card-description">
									<?php echo wp_kses_post( $description ); ?>
								</div>
							</div>

							<?php if ( $link ) : ?>
								<div class="card-footer">
									<a href="<?php echo esc_url( $link ); ?>" class="card-link">
										<span class="link-icon">
											<svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M0.257784 11.3833C0.0879507 11.2133 0.00203412 11.0102 3.41232e-05 10.774C-0.00196588 10.5377 0.0839507 10.3326 0.257784 10.1588L5.91603 4.5375C6.23803 4.21033 6.63453 4.04675 7.10553 4.04675C7.5767 4.04675 7.97587 4.21033 8.30303 4.5375L11.2845 7.513L17.0823 1.70325H14.8128C14.5723 1.70325 14.3702 1.621 14.2065 1.4565C14.0429 1.292 13.961 1.08892 13.961 0.84725C13.961 0.605584 14.0429 0.404 14.2065 0.2425C14.3702 0.0808336 14.5723 0 14.8128 0H19.0833C19.3238 0 19.5269 0.0818335 19.6925 0.2455C19.8582 0.409167 19.941 0.61125 19.941 0.85175V5.12225C19.941 5.35025 19.8621 5.54917 19.7043 5.719C19.5465 5.889 19.3497 5.974 19.114 5.974C18.8824 5.974 18.6815 5.889 18.5115 5.719C18.3417 5.54917 18.2568 5.35025 18.2568 5.12225V2.94675L12.453 8.7255C12.1269 9.05267 11.7283 9.21625 11.2573 9.21625C10.7863 9.21625 10.3892 9.05267 10.066 8.7255L7.08453 5.775L1.47628 11.3833C1.30628 11.5531 1.1032 11.638 0.867034 11.638C0.630867 11.638 0.427784 11.5531 0.257784 11.3833Z" fill="#E84AC7"/>
											</svg>
										</span> <?php esc_html_e( 'Read Success Story', 'elementor-flip-card-carousel' ); ?>
									</a>
								</div>
							<?php endif; ?>
						</div>
						<!-- Back Face -->
						<div class="flip-card-back">
							<div class="card-content">
								<p><?php esc_html_e( 'Click to see next card', 'elementor-flip-card-carousel' ); ?></p>
							</div>
						</div>
					</div>
				</div>

			<?php endwhile; ?>
            <div class="flip-card-nav">
                <button class="flip-card-nav-btn flip-nav-prev" type="button" aria-label="Previous">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.0078 4.68652C12.0934 4.68658 12.1668 4.71285 12.249 4.79492C12.3313 4.88086 12.3574 4.95797 12.3574 5.04395C12.3573 5.13078 12.3308 5.20478 12.249 5.28711L5.8877 11.6484H19.2979C19.4194 11.6485 19.4945 11.6838 19.5586 11.7471C19.6207 11.8084 19.6553 11.8801 19.6553 12C19.6553 12.1199 19.6207 12.1916 19.5586 12.2529C19.4945 12.3162 19.4194 12.3515 19.2979 12.3516H5.8877L12.2432 18.707V18.7061C12.3254 18.7885 12.3537 18.8653 12.3545 18.957V18.958C12.355 19.0245 12.3404 19.0829 12.2988 19.1426L12.2471 19.2041C12.1671 19.2851 12.0939 19.3113 12.0049 19.3105C11.9104 19.3096 11.8321 19.2796 11.749 19.1973L4.80078 12.249C4.74762 12.1949 4.72192 12.1527 4.70996 12.124V12.123C4.69485 12.0867 4.68652 12.0466 4.68652 11.999C4.68655 11.9514 4.69516 11.9123 4.70996 11.877V11.876C4.72183 11.8475 4.74729 11.8051 4.80078 11.751L11.751 4.80078C11.8414 4.71356 11.9211 4.68652 12.0078 4.68652Z" fill="#310F5C" stroke="#310F5C"/>
                    </svg>
                </button>
                <button class="flip-card-nav-btn flip-nav-next" type="button" aria-label="Next">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.9951 4.68945C12.0661 4.69012 12.1279 4.70677 12.1895 4.75L12.251 4.80273L19.1992 11.751C19.2524 11.8051 19.2781 11.8473 19.29 11.876V11.877C19.3052 11.9133 19.3135 11.9534 19.3135 12.001C19.3134 12.0486 19.3048 12.0877 19.29 12.123V12.124C19.2782 12.1525 19.2527 12.1948 19.1992 12.249L12.2451 19.1973C12.1538 19.2875 12.0752 19.3135 11.9922 19.3135C11.9115 19.3134 11.8393 19.2889 11.7559 19.2031L11.751 19.1982L11.6992 19.1377C11.6571 19.0781 11.6426 19.02 11.6426 18.9551C11.6426 18.8904 11.6573 18.8328 11.6992 18.7734L11.751 18.7129L18.1123 12.3516H4.70215C4.58005 12.3515 4.50781 12.3164 4.44727 12.2559H4.44629C4.38542 12.195 4.35059 12.122 4.35059 12C4.35059 11.878 4.38542 11.805 4.44629 11.7441H4.44727C4.50782 11.6836 4.58005 11.6485 4.70215 11.6484H18.1123L11.7568 5.29297C11.6955 5.23162 11.6637 5.17322 11.6514 5.1084L11.6455 5.04102C11.6446 4.95107 11.6708 4.87748 11.751 4.79688L11.752 4.7959C11.8321 4.71531 11.9055 4.68868 11.9951 4.68945Z" fill="#310F5C" stroke="#310F5C"/>
                    </svg>
                </button>
            </div>
		</div>
		<?php

		wp_reset_postdata();
	}
}
