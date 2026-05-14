<?php
/**
 * Register Custom Post Type for Success Stories
 *
 * This file registers a custom post type that can be used with the Flip Card Carousel widget.
 * You can customize this or create your own CPT using a plugin like ACF or CPT UI.
 *
 * @package ElementorFlipCardCarousel
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the Success Story custom post type.
 */
function flip_card_register_success_story_cpt() {
	$labels = array(
		'name'                  => _x( 'Success Stories', 'Post Type General Name', 'elementor-flip-card-carousel' ),
		'singular_name'         => _x( 'Success Story', 'Post Type Singular Name', 'elementor-flip-card-carousel' ),
		'menu_name'             => __( 'Success Stories', 'elementor-flip-card-carousel' ),
		'name_admin_bar'        => __( 'Success Story', 'elementor-flip-card-carousel' ),
		'archives'              => __( 'Story Archives', 'elementor-flip-card-carousel' ),
		'attributes'            => __( 'Story Attributes', 'elementor-flip-card-carousel' ),
		'parent_item_colon'     => __( 'Parent Story:', 'elementor-flip-card-carousel' ),
		'all_items'             => __( 'All Stories', 'elementor-flip-card-carousel' ),
		'add_new_item'          => __( 'Add New Story', 'elementor-flip-card-carousel' ),
		'add_new'               => __( 'Add New', 'elementor-flip-card-carousel' ),
		'new_item'              => __( 'New Story', 'elementor-flip-card-carousel' ),
		'edit_item'             => __( 'Edit Story', 'elementor-flip-card-carousel' ),
		'update_item'           => __( 'Update Story', 'elementor-flip-card-carousel' ),
		'view_item'             => __( 'View Story', 'elementor-flip-card-carousel' ),
		'view_items'            => __( 'View Stories', 'elementor-flip-card-carousel' ),
		'search_items'          => __( 'Search Story', 'elementor-flip-card-carousel' ),
		'not_found'             => __( 'Not found', 'elementor-flip-card-carousel' ),
		'not_found_in_trash'    => __( 'Not found in Trash', 'elementor-flip-card-carousel' ),
		'featured_image'        => __( 'Profile Image', 'elementor-flip-card-carousel' ),
		'set_featured_image'    => __( 'Set profile image', 'elementor-flip-card-carousel' ),
		'remove_featured_image' => __( 'Remove profile image', 'elementor-flip-card-carousel' ),
		'use_featured_image'    => __( 'Use as profile image', 'elementor-flip-card-carousel' ),
		'insert_into_item'      => __( 'Insert into story', 'elementor-flip-card-carousel' ),
		'uploaded_to_this_item' => __( 'Uploaded to this story', 'elementor-flip-card-carousel' ),
		'items_list'            => __( 'Stories list', 'elementor-flip-card-carousel' ),
		'items_list_navigation' => __( 'Stories list navigation', 'elementor-flip-card-carousel' ),
		'filter_items_list'     => __( 'Filter stories list', 'elementor-flip-card-carousel' ),
	);

	$args = array(
		'label'                 => __( 'Success Story', 'elementor-flip-card-carousel' ),
		'description'           => __( 'Success stories for the flip card carousel', 'elementor-flip-card-carousel' ),
		'labels'                => $labels,
		'supports'              => array( 'title', 'editor', 'thumbnail', 'custom-fields' ),
		'hierarchical'          => false,
		'public'                => true,
		'show_ui'               => true,
		'show_in_menu'          => true,
		'menu_position'         => 5,
		'menu_icon'             => 'dashicons-awards',
		'show_in_admin_bar'     => true,
		'show_in_nav_menus'     => true,
		'can_export'            => true,
		'has_archive'           => true,
		'exclude_from_search'   => false,
		'publicly_queryable'    => true,
		'capability_type'       => 'post',
		'show_in_rest'          => true, // Enable Gutenberg editor
	);

	register_post_type( 'success_story', $args );
}
add_action( 'init', 'flip_card_register_success_story_cpt', 0 );

/**
 * Add custom meta boxes for Success Story fields.
 */
function flip_card_add_meta_boxes() {
	add_meta_box(
		'flip_card_story_details',
		__( 'Story Details', 'elementor-flip-card-carousel' ),
		'flip_card_render_meta_box',
		'success_story',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'flip_card_add_meta_boxes' );

/**
 * Render the meta box content.
 */
function flip_card_render_meta_box( $post ) {
	// Add nonce for security
	wp_nonce_field( 'flip_card_save_meta_box', 'flip_card_meta_box_nonce' );

	// Get existing values
	$person_name = get_post_meta( $post->ID, 'person_name', true );
	$job_title = get_post_meta( $post->ID, 'job_title', true );
	$quote = get_post_meta( $post->ID, 'quote', true );
	$description = get_post_meta( $post->ID, 'description', true );
	$story_link = get_post_meta( $post->ID, 'story_link', true );
	?>

	<table class="form-table">
		<tr>
			<th><label for="person_name"><?php _e( 'Person Name', 'elementor-flip-card-carousel' ); ?></label></th>
			<td>
				<input type="text" id="person_name" name="person_name" value="<?php echo esc_attr( $person_name ); ?>" class="regular-text">
				<p class="description"><?php _e( 'e.g., Dr. Amina Yusuf', 'elementor-flip-card-carousel' ); ?></p>
			</td>
		</tr>
		<tr>
			<th><label for="job_title"><?php _e( 'Job Title & Location', 'elementor-flip-card-carousel' ); ?></label></th>
			<td>
				<input type="text" id="job_title" name="job_title" value="<?php echo esc_attr( $job_title ); ?>" class="regular-text">
				<p class="description"><?php _e( 'e.g., Community Pharmacist, Nigeria', 'elementor-flip-card-carousel' ); ?></p>
			</td>
		</tr>
		<tr>
			<th><label for="quote"><?php _e( 'Quote', 'elementor-flip-card-carousel' ); ?></label></th>
			<td>
				<textarea id="quote" name="quote" rows="3" class="large-text"><?php echo esc_textarea( $quote ); ?></textarea>
				<p class="description"><?php _e( 'The main quote to display on the card', 'elementor-flip-card-carousel' ); ?></p>
			</td>
		</tr>
		<tr>
			<th><label for="description"><?php _e( 'Description', 'elementor-flip-card-carousel' ); ?></label></th>
			<td>
				<textarea id="description" name="description" rows="5" class="large-text"><?php echo esc_textarea( $description ); ?></textarea>
				<p class="description"><?php _e( 'The body text for the card. Leave empty to use the post content.', 'elementor-flip-card-carousel' ); ?></p>
			</td>
		</tr>
		<tr>
			<th><label for="story_link"><?php _e( 'Story Link', 'elementor-flip-card-carousel' ); ?></label></th>
			<td>
				<input type="url" id="story_link" name="story_link" value="<?php echo esc_url( $story_link ); ?>" class="regular-text">
				<p class="description"><?php _e( 'Optional. Leave empty to use the post permalink.', 'elementor-flip-card-carousel' ); ?></p>
			</td>
		</tr>
	</table>

	<p><strong><?php _e( 'Profile Image:', 'elementor-flip-card-carousel' ); ?></strong> <?php _e( 'Use the "Featured Image" box on the right to set the profile photo.', 'elementor-flip-card-carousel' ); ?></p>

	<?php
}

/**
 * Save meta box data.
 */
function flip_card_save_meta_box( $post_id ) {
	// Check nonce
	if ( ! isset( $_POST['flip_card_meta_box_nonce'] ) || ! wp_verify_nonce( $_POST['flip_card_meta_box_nonce'], 'flip_card_save_meta_box' ) ) {
		return;
	}

	// Check autosave
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	// Check permissions
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	// Save fields
	$fields = array( 'person_name', 'job_title', 'quote', 'description', 'story_link' );

	foreach ( $fields as $field ) {
		if ( isset( $_POST[ $field ] ) ) {
			update_post_meta( $post_id, $field, sanitize_text_field( $_POST[ $field ] ) );
		}
	}
}
add_action( 'save_post_success_story', 'flip_card_save_meta_box' );
