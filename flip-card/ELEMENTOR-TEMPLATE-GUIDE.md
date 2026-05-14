# Linking Custom Post Type to Elementor Pro Templates

## Method 1: Using Elementor Pro Theme Builder (Recommended)

### Step 1: Create a Single Post Template
1. In WordPress admin, go to **Templates > Theme Builder**
2. Click **Add New** → **Single Post**
3. Name your template (e.g., "Success Story Template")
4. Click **Create Template**

### Step 2: Design Your Template
1. Design your single post template using Elementor
2. Use **Dynamic Tags** to pull data from your custom fields:
   - Add a **Heading** widget → Click dynamic tags icon → **Post Custom Field** → Enter `person_name`
   - Add a **Text Editor** → Dynamic tags → **Post Custom Field** → Enter `job_title`
   - Add a **Text Editor** → Dynamic tags → **Post Custom Field** → Enter `quote`
   - Add a **Text Editor** → Dynamic tags → **Post Custom Field** → Enter `description`
   - Add an **Image** widget → Dynamic tags → **Featured Image**
   - Add a **Button** → Link → Dynamic tags → **Post Custom Field** → Enter `story_link`

### Step 3: Set Display Conditions
1. Click **Publish** (or the settings icon in the bottom left)
2. In the **Display Conditions** section, click **Add Condition**
3. Select **Singular** → **Success Story**
4. Click **Save & Close**

Now, when someone clicks on a Success Story link from your carousel, they'll see your custom Elementor template!

---

## Method 2: Using ACF Integration (If Using ACF)

If you're using Advanced Custom Fields Pro with Elementor Pro:

### Step 1: Create ACF Fields
1. Go to **Custom Fields > Add New**
2. Create a field group for "Success Story"
3. Add your fields (person_name, job_title, quote, etc.)
4. Set location rule: **Post Type** is equal to **Success Story**

### Step 2: Use ACF Dynamic Tags in Elementor
1. Create your Single Post template (as above)
2. Use **ACF** dynamic tags instead of Post Custom Field:
   - Heading → Dynamic tags → **ACF Field** → Select your field
   - This gives you more formatting options and better integration

---

## Method 3: Programmatic Template Assignment

If you want to force a specific template via code, add this to your theme's `functions.php` or a custom plugin:

```php
/**
 * Assign Elementor template to Success Story CPT
 */
function assign_elementor_template_to_success_story( $template_id ) {
    if ( is_singular( 'success_story' ) ) {
        // Replace 123 with your Elementor template ID
        return 123;
    }
    return $template_id;
}
add_filter( 'template_include', 'assign_elementor_template_to_success_story' );
```

To find your template ID:
1. Go to **Templates > Saved Templates**
2. Hover over your template
3. Look at the URL: `post=123` - that's your template ID

---

## Dynamic Content Mapping Reference

When building your Elementor template, use these dynamic tags:

| Card Field | Dynamic Tag Type | Field Name |
|------------|------------------|------------|
| Person Name | Post Custom Field | `person_name` |
| Job Title | Post Custom Field | `job_title` |
| Quote | Post Custom Field | `quote` |
| Description | Post Custom Field | `description` |
| Profile Image | Featured Image | (built-in) |
| Story Link | Post Custom Field | `story_link` |
| Post Title | Post Title | (built-in) |
| Post Content | Post Content | (built-in) |

---

## Example Template Structure

Here's a suggested layout for your Success Story single post template:

```
┌─────────────────────────────────────┐
│         HEADER SECTION              │
│  [Profile Image] [Name + Job Title] │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         QUOTE SECTION               │
│  "Quote text here..."               │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         STORY SECTION               │
│  Full story content/description     │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│         RELATED STORIES             │
│  [Use Posts widget with query]      │
└─────────────────────────────────────┘
```

---

## Advanced: Creating a "Related Stories" Section

Add a **Posts** widget to show related success stories:

1. Add **Posts** widget to your template
2. In **Query** settings:
   - Source: **Custom Query**
   - Post Type: `success_story`
   - Exclude: **Current Post**
   - Posts Per Page: 3
3. Choose a layout (cards, grid, etc.)

---

## Troubleshooting

**Template not applying?**
- Clear Elementor cache: **Elementor > Tools > Regenerate CSS**
- Check Display Conditions are set correctly
- Make sure the template is published, not draft

**Custom fields not showing?**
- Verify field names match exactly (case-sensitive)
- Check that the post has data in those fields
- Try using ACF instead of native custom fields for better Elementor integration

**Want to use post content instead of custom field?**
- Use **Post Content** dynamic tag instead of **Post Custom Field**
- This pulls from the main WordPress editor content

---

## Pro Tip: Archive Template

You can also create an **Archive** template for your Success Stories:

1. **Templates > Theme Builder > Add New > Archive**
2. Design your archive page (grid of stories)
3. Set condition: **Archive** → **Success Story Archive**
4. Users can now browse all stories at `/success_story/`

This creates a complete content ecosystem for your success stories!
