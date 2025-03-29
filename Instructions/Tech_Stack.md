Okay, let's craft a detailed Tech Stack Documentation for the NIBOG Event Booking Website, focusing on clarity and ease of onboarding for new developers.

**Tech Stack Documentation: NIBOG Event Booking Website**

**1. Introduction**

This document outlines the technology stack used for developing the NIBOG Event Booking Website. This platform allows parents to register their children for NIBOG events and enables administrators to manage events, registrations, and related data. This document is intended to be a comprehensive guide for new developers joining the project, enabling them to quickly understand and contribute to the development.

**2. Core Technologies & Rationale**

*   **Frontend Framework:** Next.js
    *   **Version:** Latest Stable
    *   **Rationale:** Next.js is a React framework that provides server-side rendering, static site generation, routing, and API routes. This ensures a performant, scalable, and SEO-friendly user experience.
*   **UI Component Library:** Tailwind CSS
    *   **Version:** Latest Stable
    *   **Rationale:** Tailwind CSS is a utility-first CSS framework that enables rapid and responsive UI development. It facilitates a consistent design language and makes the styling process easier.
*   **Authentication:** Clerk
    *   **Version:** Latest Stable
    *   **Rationale:** Clerk provides a complete authentication solution, simplifying user management, security, and the integration of login/registration flows. It integrates smoothly with React and Next.js.
*   **Backend:** Node.js (Within Next.js API Routes)
    *   **Version:** Latest LTS
    *   **Rationale:** Node.js is a JavaScript runtime that enables building scalable and efficient backend services, taking advantage of JavaScript for both the frontend and the backend. Integrated API routes within Next.js provide a streamlined development experience.
*   **Database:** MySQL
    *   **Version:** 8.x
    *   **Rationale:** MySQL is an open-source, reliable, and widely used relational database. It is known for its scalability, performance, and maturity, making it ideal for storing the application's data.
*   **ORM (Object-Relational Mapping):** Prisma
    *   **Version:** Latest Stable
    *   **Rationale:** Prisma is a modern database toolkit that makes interacting with the database easier by offering a type-safe API. It simplifies query construction and database schema management.
*   **Payment Gateway:** PhonePe SDK/API
    *   **Version:** Latest Stable SDK/API
    *   **Rationale:** PhonePe is a leading Indian digital payment platform, providing secure payment processing options.
*   **Email Service:** Nodemailer
    *   **Version:** Latest Stable
    *   **Rationale:** Nodemailer is a Node.js library for sending emails, which is essential for user registration confirmation and communication.
*   **Version Control:** Git
    *   **Platform:** GitHub, GitLab, or Bitbucket
    *   **Rationale:** Git is crucial for code collaboration and version tracking, enabling organized development and issue resolution.

**3. API and Package Integrations**

This section details the APIs and packages used in the project with relevant endpoints, rate limits, and expected data formats.

**3.1. Clerk Authentication API**

*   **Purpose:** To manage user authentication, user data, and secure login/registration processes.
*   **Endpoints:**
    *   `GET /api/v1/users/:userId` - Retrieve user data.
        *   **Rate Limits:** Standard Clerk limits apply (refer to [Clerk's documentation](https://clerk.com/docs)).
        *   **Data Format:**
            ```json
            {
              "id": "user_xxxxxxxx",
              "first_name": "John",
              "last_name": "Doe",
              "email": "john.doe@example.com",
               ...
             }
            ```
    *   `POST /api/v1/sessions` - Create a new session (user login).
        *   **Rate Limits:** Standard Clerk limits apply.
        *   **Data Format:** Requires credentials (email, password) or OAuth tokens.
    *   `DELETE /api/v1/sessions/:sessionId` - End a user's session (logout).
        *   **Rate Limits:** Standard Clerk limits apply.

*   **Configuration:**
    *   Clerk provides a frontend SDK that works with React. Refer to Clerk’s documentation on how to setup and install clerk within the Next.js Application. Make sure to set the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` environment variables.
    *   Use Clerk’s pre-built UI components for login, registration, and user management.

**3.2. PhonePe Payment Gateway API**

*   **Purpose:** To handle secure online payment transactions for event registrations.
*   **Endpoints:**
    *   `/api/payments/initiate` - Initiate a new payment request.
        *   **Rate Limits:** Dependent on the agreements with PhonePe; check PhonePe's API documentation.
        *   **Data Format:**
        ```json
            {
                "merchantId": "merchant_id",
                 "amount": 100.00,
                "callbackUrl": "https://your-app.com/api/payments/callback",
                 ...
            }
       ```

    *   `/api/payments/callback` - Payment response callback.
        *   **Rate Limits:** Dependent on PhonePe
        *   **Data Format:** JSON payload in the POST request with transaction details as provided by the PhonePe.

    *   `/api/payments/status/:transactionId` - Fetch payment status by transaction ID.
        *   **Rate Limits:** Dependent on PhonePe.
        *   **Data Format:** Returns a JSON object with payment status, if the payment is pending, completed, or failed.

*   **Configuration:**
    *   Refer to PhonePe's documentation for setting up your merchant account, generating API keys, and integrating the SDK/API.
    *  Ensure to keep the sensitive credentials, such as API keys, in environment variables.
    *   Implement webhook handling or polling for payment status updates from PhonePe.

**3.3. Prisma ORM**

*   **Purpose:** To manage database interactions through a type-safe and intuitive API.
*   **Usage:** Prisma Client is used to query, create, update, and delete data in the MySQL database.
*   **Data Modeling:**
    *   Define database models (`schema.prisma`) for events, cities, games, registrations, users, etc.
    *   Example:
        ```prisma
        model Event {
          id        Int      @id @default(autoincrement())
          name      String
          location  String
          date      DateTime
          ...
        }
        ```
*   **Configuration:**
    *   Create your `schema.prisma` file, then run `npx prisma generate` to create the Prisma client.
    *   Establish your database connection through Prisma using the `DATABASE_URL` environment variable.
    *   Always keep database credentials in environment variables.

**3.4. Nodemailer**

*   **Purpose:** To send email notifications, such as registration confirmations.
*   **Usage:**
    *   Create a mailer service/utility function with Nodemailer.
    *   Use SMTP settings to configure your email provider.
    *   Use environment variables to configure the service with mail details.
    * Example:
    ```js
    const nodemailer = require('nodemailer')

    const transporter = nodemailer.createTransport({
        host: 'smtp.example.com',
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: 'your-email@example.com',
            pass: 'your-email-password'
        }
    });

    const mailOptions = {
         from: 'youremail@example.com',
         to: 'useremail@example.com',
         subject: 'Registration Confirmation',
         html: '<h1> Your Registration Confirmed!</h1>'
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log(error)
          return
      }
      console.log('Email sent: ' + info.response)
    });
    ```
*   **Configuration:**
    *   Configure your SMTP server settings using environment variables.
    *   Keep email credentials (username and password) secure.
    *   Handle sending failures gracefully with proper error handling and logs.

**4. Best Practices and Recommended Configurations**

*   **Environment Variables:**
    *   Always use environment variables for sensitive data like API keys, database credentials, and secret keys.
    *   Use a `.env.local` file for development and configure environment variables for different environments like staging and production.
*   **Code Style and Linting:**
    *   Follow established code style guides (e.g., Airbnb, Prettier).
    *   Use linters (e.g., ESLint) to maintain code quality and consistency.
*   **Error Handling:**
    *   Implement comprehensive error handling in all modules.
    *   Log errors for analysis and debugging.
*   **Security:**
    *   Sanitize user inputs to prevent cross-site scripting (XSS) and SQL injection.
    *   Store sensitive data in environment variables and do not commit these in your repo.
    *   Use HTTPS for all traffic.
*   **Performance:**
    *   Optimize database queries and use indexes for efficient data retrieval.
    *   Implement caching where appropriate.
    *   Minimize the size of assets and optimize images.
*  **Code Splitting:**
    *  Employ code splitting at the page level or component level to increase performance and make the overall bundle size smaller.
*   **Monitoring:**
    *  Use monitoring systems (e.g., Sentry, New Relic) to track application performance and issues.
*   **Testing:**
    *   Write unit tests for critical components and logic.
    *   Conduct integration tests for APIs and interactions.
*  **Keep Dependencies Updated:**
     * Regularly update all dependencies to keep them patched for security vulnerabilities and to leverage new features.

**5. Onboarding Checklist**

To help new developers onboard quickly, follow these steps:

1.  Clone the repository and install all dependencies by using `npm install` or `yarn install`.
2.  Setup your MySQL database and then connect Prisma with the database.
3.  Configure the `.env.local` file with your environment variables like Clerk and PhonePe keys.
4.  Familiarize yourself with the file structure mentioned above.
5.  Start building in your branch.
6.  Test and run your application before committing changes.
7.  Follow code style guidelines.
8.  Read this Tech Stack documentation to fully grasp the working of the project.

**6. Conclusion**

This Tech Stack Documentation should serve as a comprehensive guide for any new developer joining the NIBOG Event Booking Website project. By thoroughly understanding and adhering to these guidelines, the development team can work efficiently, maintain code quality, and ensure the long-term success of the application.

If you have any further questions or clarifications, feel free to ask!
