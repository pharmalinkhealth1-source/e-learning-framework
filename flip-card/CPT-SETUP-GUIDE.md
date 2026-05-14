# Flip Card Carousel - Custom Post Type Setup Guide

## Overview
This plugin now includes **two versions** of the Flip Card Carousel widget:

1. **Flip Card Carousel** - Manual repeater (original version)
2. **Flip Card Carousel (CPT)** - Pulls data from a custom post type

## Setting Up the Custom Post Type Version

### Step 1: Activate the Plugin
1. Upload the `flip-card-carousel` folder to `/wp-content/plugins/`
2. Activate the plugin through the WordPress admin
3. You'll see a new "Success Stories" menu item in your WordPress admin

### Step 2: Create Success Stories
1. Go to **Success Stories > Add New** in WordPress admin
2. Fill in the following fields:

   **Story Details Meta Box:**
   - **Person Name**: e.g., "Dr. Amina Yusuf"
   - **Job Title & Location**: e.g., "Community Pharmacist, Nigeria"
   - **Quote**: The main quote to display (will be italicized)
   - **Description**: The body text (or leave empty to use post content)
   - **Story Link**: Optional custom link (or leave empty to use post permalink)

   **Featured Image:**
   - Set the profile photo using the "Featured Image" box on the right

3. Click **Publish**

### Step 3: Add the Widget to Your Page
1. Edit your page in Elementor
2. Search for "Flip Card Carousel (CPT)" in the widget panel
3. Drag it to your desired section

### Step 4: Configure Widget Settings

**Query Settings Tab:**
- **Post Type**: `success_story` (default)
- **Number of Cards**: How many cards to display (1-20)
- **Order**: Ascending or Descending
- **Order By**: Date, Title, Menu Order, or Random

**Field Mapping Tab:**
The widget is pre-configured to work with the default fields:
- **Name Field**: `person_name`
- **Job Title Field**: `job_title`
- **Quote Field**: `quote`
- **Description Field**: `description`
- **Image Field**: `profile_image` (or uses featured image)
- **Link Field**: `story_link` (or uses post permalink)

## Using a Different Custom Post Type

If you want to use your own custom post type (created with ACF, CPT UI, etc.):

1. In the widget settings, change **Post Type** to your CPT slug
2. Update the **Field Mapping** to match your custom field names
3. The widget will automatically pull data from those fields

## Using with ACF (Advanced Custom Fields)

If you're using ACF instead of the built-in meta boxes:

1. Create a Field Group for your custom post type
2. Add fields with the following names (or update the Field Mapping):
   - `person_name` (Text)
   - `job_title` (Text)
   - `quote` (Textarea)
   - `description` (Textarea or WYSIWYG)
   - `profile_image` (Image)
   - `story_link` (URL)

## Customizing the Custom Post Type

You can customize the CPT by editing `/includes/custom-post-type.php`:

- Change the post type slug from `success_story` to something else
- Modify labels and menu icon
- Add taxonomies (categories/tags)
- Change supported features

## Benefits of Using the CPT Version

✅ **Easier Content Management**: Edit cards like regular WordPress posts
✅ **Scalability**: Add unlimited cards without cluttering Elementor
✅ **Reusability**: Use the same content across multiple pages
✅ **Better Workflow**: Content editors can manage cards without touching Elementor
✅ **Advanced Queries**: Filter by categories, tags, or custom taxonomies
✅ **SEO**: Each story can have its own permalink and meta data

## Troubleshooting

**Cards not showing?**
- Make sure you've published at least one Success Story
- Check that the Post Type slug matches in the widget settings
- Verify that the field names match in the Field Mapping tab

**Images not displaying?**
- Ensure you've set a Featured Image on the post
- Or add a custom field with an image ID

**Need different fields?**
- Update the Field Mapping in the widget settings
- Or modify the widget code in `widgets/flip-card-carousel-widget-cpt.php`
