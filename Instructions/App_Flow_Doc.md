Okay, let's create a detailed App Flow Documentation for the NIBOG Event Booking Website, covering all aspects of the user journey and conditional flows.

**App Flow Documentation: NIBOG Event Booking Website**

**1. Introduction**

This document outlines the user flows and page structure for the NIBOG Event Booking Website. It provides a detailed description of the user journey, from the initial landing page through registration and account management, as well as administrative access paths. The document is designed to be a comprehensive reference, covering all typical and edge-case scenarios.

**2. User Flow Overview**

The application offers two primary user experiences:

*   **Parent (Customer) User Flow:** This flow is designed for parents to discover events, register their children, and manage their registrations.
*   **Admin User Flow:** This flow is designed for NIBOG organizers to manage events, cities, games, registrations, and user data.

**3. Detailed User Flows**

**3.1. Parent (Customer) User Flow:**

**3.1.1. Initial Landing Page (Home Page):**

*   **Overview:** The initial page users land on when they access the site. It provides a brief overview of NIBOG, upcoming events, and direct links to main areas.

*   **Structure:**
    *   **Navigation Bar:** Contains the site logo/name and links for "Home", "Events", and "Account."
    *   **Hero Section:** A prominent section with a brief intro about NIBOG.
    *   **Featured Events Section:** Display a list of upcoming events.
    *    **Popular Cities Section:** A list of cities to check events
    *   **Footer:** Contains copyright info and relevant links.
*   **User Actions:**
    *   Browse through featured events.
    *   Navigate to the "Events" page to see all events.
    *   Navigate to the "Account" page for registration management and profile updates, if logged in.

**3.1.2. Events Page:**

*   **Overview:** A page displaying all available NIBOG events. This page allows users to search and filter based on city and date.

*   **Structure:**
    *   **Navigation Bar:** Remains consistent.
    *   **Filter Bar:** Contains search and filter options by city and date.
    *   **Events List:** Displays all the events in a card format with information including city, date, and available age categories.
    *   **Pagination:** For long event lists.
    *   **Footer:** Remains consistent.
*   **User Actions:**
    *   Filter events using city and date fields.
    *   Click on an event card to navigate to event city page.
    *   Navigate to "Account" or home page using the navigation bar.
    *   User might see login button if they are not logged in.

**3.1.3. City Landing Page:**

*   **Overview:** A specific page for a selected city that displays all available events of the city.

*   **Structure:**
    *   **Navigation Bar:** Remains consistent.
    *   **City Name Section:** Heading of the page shows the city name.
    *   **Events List:** Displays all the events in a card format with information including date and available age categories.
    *   **Footer:** Remains consistent.

*   **User Actions:**
    *   Click on the event to go to registration page.
    *   Navigate to "Account", "Home" or "Events" page using the navigation bar.
    *   User might see login button if they are not logged in.

**3.1.4. Registration Page:**

*   **Overview:** A page where users can register their child for a selected event.

*   **Structure:**
    *   **Navigation Bar:** Remains consistent.
    *   **Registration Form:**
        *   Fields to input child's name, age, parent's name, contact details.
        *   Dropdown to select a game that is dynamically displayed based on the child’s age.
        *  Dropdown for age categories for a particular event
    *   **Payment Section:** Integrated PhonePe payment processing widget.
    *   **Footer:** Remains consistent.
*   **User Actions:**
    *   Fill out the registration form.
    *   Make payment for the selected age category through PhonePe.
    *   Navigate to "Account", "Home", or "Events" page using the navigation bar.

*   **Conditional Flows:**
    *   **User Not Logged In:** If the user is not logged in, a sign-up/login screen is shown before the registration page is available, then they are redirected back to the registration page.
    *   **Age Validation:** Only the available games according to the child’s age range are shown in the games dropdown field.

**3.1.5. Account Page:**

*   **Overview:** A page where users can view their registration history and manage their profile.

*   **Structure:**
    *   **Navigation Bar:** Remains consistent.
    *   **User Profile Section:** Displays user info (name, email, etc.) - uses Clerk components
    *   **Registration History Section:** A list of past registrations, each showing event details, game, and payment status.
    *   **Footer:** Remains consistent.

*   **User Actions:**
    *   Update user profile using Clerk’s provided components
    *   View registration details.
    *   Navigate to other pages through the navigation bar.
*   **Conditional Flows:**
    *   **User Not Logged In:** If the user is not logged in, they are redirected to the sign-up/login screen.

**3.2. Admin User Flow:**

**3.2.1. Admin Login Page:**

*   **Overview:**  A page where admin users can log in.

*   **Structure:**
    *   **Login Form:** with email and password fields
    * **Footer:** Remains consistent
*   **User Actions:**
    *  Admin user enters credentials and authenticates.

**3.2.2. Admin Dashboard:**

*   **Overview:** The admin landing page after a successful login.

*   **Structure:**
    *   **Navigation Sidebar:** Links to "Dashboard", "Events", "Games", "Registrations", "Users", "Cities" and "Settings."
    *   **Main Content Area:** Displays a summary of key metrics like current bookings, upcoming events, etc.
    *  **Footer:** Remains consistent

*   **User Actions:**
    *   Navigate to other admin pages through the sidebar.

**3.2.3. Admin Event Management Page:**

*   **Overview:** This page is for managing events, with lists of events, add/edit/delete options.

*   **Structure:**
    *   **Navigation Sidebar:** Remains consistent.
    *   **Event Listing Table:** Displays events and corresponding details.
    *   **Action Buttons:** Add new event, edit selected event, delete selected event.
    *   **Event form:** Modal form to create or edit event.
    *  **Footer:** Remains consistent

*   **User Actions:**
    *   Create a new event via a modal form.
    *   Edit an existing event via a modal form.
    *   Delete an existing event
    *   Navigate to other admin pages through the sidebar.

**3.2.4. Admin Game Management Page:**

*   **Overview:** This page is for managing games, with lists of games and options to add, edit, or delete games.

*   **Structure:**
    *   **Navigation Sidebar:** Remains consistent.
    *   **Game Listing Table:** Displays a list of games with corresponding details.
    *   **Action Buttons:** Add new game, edit selected game, delete selected game.
    *   **Game form:** Modal form to create or edit a game.
    * **Footer:** Remains consistent

*   **User Actions:**
    *   Create a new game via a modal form.
    *   Edit an existing game via a modal form.
    *   Delete an existing game.
    *   Navigate to other admin pages through the sidebar.

**3.2.5. Admin Registration Management Page:**

*   **Overview:** This page is for viewing and managing event registrations.

*   **Structure:**
    *   **Navigation Sidebar:** Remains consistent.
    *   **Registration Table:** Displays all registrations with filtering options and search options.
    *   **Download Button:** Option to download registrations in CSV format.
    *  **Footer:** Remains consistent

*   **User Actions:**
    *   Filter registration by city, date, age group and game.
    *   Download registrations in CSV format.
    *   Navigate to other admin pages through the sidebar.

**3.2.6. Admin User Management Page:**

*   **Overview:** This page is for managing admin users.

*   **Structure:**
    *   **Navigation Sidebar:** Remains consistent.
    *   **User Listing Table:** Display all the admin users with an option to add admin.
    *    **Add Admin Button:** Button to create new admin
    *    **Admin User form:** Modal form to create a new admin user.
    *  **Footer:** Remains consistent

*   **User Actions:**
    *   Create a new admin through a modal form.
    *   Navigate to other admin pages through the sidebar.

**3.2.7. Admin City Management Page:**

*   **Overview:** This page is for managing the event cities.

*   **Structure:**
    *   **Navigation Sidebar:** Remains consistent.
    *   **City Listing Table:** Display all the cities with an option to add new cities.
    *  **Add City Button:** Button to add a new city.
    *  **City form:** Modal form to create or edit a city
    * **Footer:** Remains consistent

*   **User Actions:**
    *   Create a new city via a modal form.
    *   Edit an existing city via a modal form.
    *    Delete an existing city.
    *   Navigate to other admin pages through the sidebar.

**3.2.8 Admin Settings Management Page:**

*   **Overview:** This page is for managing the admin settings.

*   **Structure:**
    *  **Navigation Sidebar:** Remains consistent.
    *  **Email template:** Input field to configure the email template for the users.
    *  **Footer:** Remains consistent

*   **User Actions:**
    * Modify the email templates that are sent to the users
    * Navigate to other admin pages through the sidebar.

*   **Conditional Flows:**
    *   **User Not Authenticated:** If an admin user is not logged in they are redirected to the Admin Login page.

**4. Conditional Flows Summary**

*   **Authentication:** Users are redirected to the login page if they try to access pages that require authentication without being logged in (both for parents and admins).
*   **Age Validation:** The registration form dynamically shows the games that apply to the child’s age range.
*   **Data Validation:** The forms on different pages are validated before any data is submitted to the database
*   **Form Submission Confirmation:** After form submission, a notification is shown to the user to inform the user of successful submission.
*  **Data Downloading:** The admin user can only download the CSV of the registrations when they are logged in.

**5. Conclusion**

This detailed App Flow Documentation provides a comprehensive understanding of the user journeys and application structure for the NIBOG Event Booking Website. By adhering to these flows, the development team can build a user-friendly and robust platform, covering both parent and administrator use cases, including all possible conditional flows.

If there are any more questions or if you need further clarification, feel free to ask!
