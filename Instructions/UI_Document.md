Okay, let's create a detailed and actionable UI Guidelines Documentation for the NIBOG Event Booking Website, aiming for a clean, modern, and playful feel, using the provided image as a color reference.

**UI Guidelines Documentation: NIBOG Event Booking Website**

**1. Introduction**

This document establishes the UI guidelines for the NIBOG Event Booking Website. The goal is to create a user interface that is clean, modern, visually appealing, and easy to use, while maintaining a playful and engaging atmosphere suitable for a baby-focused event. This guide provides specific instructions and examples for colors, typography, layout, and component consistency.

**2. Color Palette**

The color palette is derived from the provided image and aims to be vibrant, friendly, and suitable for a children-focused application. The main background color will be a pale yellow. The color palette consists of:

| Color Name          | Hex Code  | RGB Value      | Usage                                                                                                     |
|---------------------|-----------|----------------|-----------------------------------------------------------------------------------------------------------|
| Pale Yellow         | `#F0E68C`  |  (240, 230, 140) | Primary background color for all pages, ensuring a soft and bright base.                               |
| Teal                | `#008080`  | (0, 128, 128)   | Primary text color, interactive elements, headers, event card backgrounds; creates a contrast for readability.   |
| Gray                | `#8B8B83`| (139,139,131)   | Secondary text color, form labels, general UI elements, used for less prominent text.                        |
| Coral Red           | `#E97451`  | (233, 116, 81)  | Highlight color, for interactive elements such as call-to-action buttons, error messages, and important notices. |
| Light Blue          | `#ADD8E6`  | (173, 216, 230) | Secondary background color, used for section backgrounds and content separation.                           |
| Green                | `#228B22`  | (34, 139, 34)   | For icons, progress bars, and visual accents indicating success or positive actions.                          |
| Light Cyan    | `#5F9EA0`      | (95, 158, 160)     | For secondary interactive elements, and background elements on hover or click.                               |
| Medium Turquoise       | `#40E0D0`  | (64, 224, 208)  |  Used in buttons, hover states and to differentiate elements.                                          |
| Dark Green       | `#006400`  | (0, 100, 0)   | For borders, text on light backgrounds, and visual accents to add contrast.                           |

**3. Typography**

Consistent typography is crucial for readability and aesthetic appeal. The following fonts and styles will be used:

*   **Primary Font:**
    *   **Name:** Montserrat
    *   **Rationale:** A modern, clean, and geometric sans-serif font with excellent legibility.
    *   **Weights:** 400 (Regular), 600 (Semi-Bold), 700 (Bold).
    *   **Sizes:**
        *   **Headings (H1):** 3rem (48px), Bold (700)
        *   **Headings (H2):** 2.25rem (36px), Semi-Bold (600)
        *   **Headings (H3):** 1.875rem (30px), Semi-Bold (600)
        *   **Subheadings (H4):** 1.5rem (24px), Semi-Bold (600)
        *   **Body Text:** 1rem (16px), Regular (400)
        *   **Labels/Captions:** 0.875rem (14px), Regular (400)
    *   **Example Pairings:**
        *   **H1 + Body Text:** `font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 3rem;`, `font-family: 'Montserrat', sans-serif; font-weight: 400; font-size: 1rem;`

*   **Secondary Font (Optional):**
    *  **Name:** Lato
    *  **Rationale:** A classic sans-serif font which complements Montsserrat
    * **Weights:** 400 (Regular), 700 (Bold).
     * **Sizes:**
        *   **Headings (H1):** 3rem (48px), Bold (700)
        *   **Headings (H2):** 2.25rem (36px), Semi-Bold (600)
        *   **Body Text:** 1rem (16px), Regular (400)
        *   **Labels/Captions:** 0.875rem (14px), Regular (400)
    *   **Example Pairings:**
        *   **H2 + Label/Caption:** `font-family: 'Lato', sans-serif; font-weight: 600; font-size: 2.25rem;`, `font-family: 'Lato', sans-serif; font-weight: 400; font-size: 0.875rem;`

**4. Design Style Principles**

*   **Spacing Rules:**
    *   **Consistent Padding & Margin:** Use a consistent grid system to keep elements well-spaced. Use a base of 8px as the unit of measure (e.g., 8px, 16px, 24px, etc.).
    *   **Section Padding:** Use consistent padding for all sections to make a well-spaced interface
*   **Grid System:**
    *   **Column-Based Layout:** Use a 12-column grid system for all pages, enhancing the responsiveness of the layout.
    *   **Responsive Behavior:** Ensure content adapts well to different screen sizes by using a flexbox or grid layout.
*   **Iconography Style:**
    *   **Rounded Icons:** Use simple, rounded icons with a consistent line weight for better visual harmony.
    *   **Coloring:** Color icons to match the overall style. Use the teal color for primary icons, the dark green for secondary icons, and the coral red for icons indicating error.
    *    **Example:** Font Awesome or similar icon libraries.
*   **Image Treatments:**
    *   **Clear and Sharp Images:** Use clear and sharp images, optimized for web use, related to babies, games, and events.
    *   **Rounded Corners:** Add subtle rounded corners to images to maintain a soft, friendly look.
    *   **Image Aspect Ratios:** Use consistent aspect ratios, ensuring a clean visual look across different pages and sections.

**5. Maintaining UI Consistency**

*   **Button Styles:**
    *   **Primary Buttons:**
        *   Background Color: `#E97451` (Coral Red)
        *   Text Color: White
        *   Border Radius: 4px
        *   Font Weight: 600
        *   Hover State: Background Color: Darkened coral red color
    *   **Secondary Buttons:**
        *   Background Color: `transparent`
        *   Border: 1px solid `teal` color
        *   Text Color:  `teal`
        *    Border Radius: 4px
        *    Font Weight: 600
        *   Hover State: Background Color: A lighter version of cyan color
*   **Form Elements:**
    *   **Input Fields:**
        *   Border: 1px solid gray
        *   Background Color: White
        *   Padding: 8px
        *   Font Size: 1rem (16px)
    *   **Labels:**
        *   Font Size: 0.875rem (14px)
        *   Text Color: Gray
    *   **Error Messages:**
        *   Color: Coral Red
        *   Font Size: 0.875rem (14px)
*   **Hover States:**
    *   **Interactive Elements:** Use a light background color change or slight animation for interactive elements when hovered over.
    *   **Buttons:** Primary buttons change to a darker shade of the main color, and secondary buttons get a light background color on hover.
*   **Loading States:**
    *  **Loading Indicators:** Use simple loading indicators like circular spinners during long network operations to inform users.
    *  **Placeholder Elements:** Use grey placeholder elements when there's no content to display.
*   **Navigation Elements:**
     *   Use a consistent navigation bar throughout all the pages.
     *   Use breadcrumbs to guide the user through the application.
*   **Modals:**
    *  Modal background should be a transparent black to overlay over the page content and should have a white background to make the form clear for the user.
*   **Use of Tailwind CSS:**
     *  To make the style consistent it is adviced to use tailwind classes directly wherever possible instead of overwriting through CSS.

**6. Actionable Guidelines**

*   **Use Tailwind CSS:** Create utility classes within Tailwind CSS to help maintain consistency and minimize CSS.
*   **Component Library:** Create reusable React components with all the guidelines mentioned above in mind.
*   **Figma or Adobe XD:** Create a well-organized style guide in Figma/Adobe XD to maintain the correct colors, fonts, spacing, and component design. This can help maintain consistency when designers are implementing new components.

**7. Conclusion**

By adhering to these UI Guidelines, the NIBOG Event Booking Website will maintain a consistent and user-friendly experience. These guidelines should act as a reference for all designers and developers throughout the project lifecycle. This document will ensure that the look and feel of the application aligns with the brand and effectively serves its users.

If you need any more adjustments or have additional questions, feel free to ask!
