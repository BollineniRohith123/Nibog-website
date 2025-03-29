Okay, let's craft a detailed Database Design Documentation for the NIBOG Event Booking Website, focusing on a logical structure and clear communication of data flow.

**Database Design Documentation: NIBOG Event Booking Website**

**1. Introduction**

This document details the database design for the NIBOG Event Booking Website, which stores data related to events, cities, games, registrations, users, and payment transactions. The design emphasizes a relational database structure, which ensures data integrity, efficient querying, and scalability. This documentation is intended to provide clarity on the organization of data within the system and how different tables relate to each other.

**2. Database Overview**

The database is designed using MySQL, adhering to relational database principles. The schema includes several tables representing key entities in the application. These tables are interconnected through relationships, ensuring data consistency and enabling effective data management.

**3. Database Tables and Fields**

This section provides a detailed list of all tables, their fields, data types, constraints, and descriptions.

**3.1. `users` Table**

*   **Purpose:** Stores user information, specifically administrators, and their access credentials.

    | Field        | Data Type      | Constraints    | Description                                            |
    |--------------|----------------|----------------|--------------------------------------------------------|
    | `id`         | INT            | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the user.                         |
    | `clerkId`     | VARCHAR(255)    | UNIQUE, NOT NULL| Clerk user ID.                                       |
    | `email`       | VARCHAR(255)    | NOT NULL       | User's email address.                               |
    | `role`   | ENUM('admin', 'user')    | DEFAULT 'user'        | Role of the user within the app.                               |
    | `createdAt` | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP    | Date and time when the user was created.                  |
    | `updatedAt` | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Date and time when the user was updated.    |

**3.2. `cities` Table**

*   **Purpose:** Stores information about cities where NIBOG events are held.

    | Field        | Data Type      | Constraints    | Description                               |
    |--------------|----------------|----------------|-------------------------------------------|
    | `id`         | INT            | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the city.         |
    | `name`       | VARCHAR(255)    | UNIQUE, NOT NULL   | Name of the city.                         |
    | `createdAt`  | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP  | Date and time when the city was created.   |
    | `updatedAt`  | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP    | Date and time when the city was updated.    |

**3.3. `events` Table**

*   **Purpose:** Stores details of NIBOG events.

    | Field           | Data Type      | Constraints             | Description                                                                 |
    |-----------------|----------------|-------------------------|-----------------------------------------------------------------------------|
    | `id`            | INT            | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the event.                                             |
    | `cityId`        | INT            | NOT NULL, FOREIGN KEY REFERENCES `cities`(`id`) ON DELETE CASCADE | Foreign key referencing the `cities` table.                             |
    | `name`          | VARCHAR(255)    | NOT NULL                | Name of the event.                                                              |
    | `description`   | TEXT           |                         | Detailed description of the event.                                           |
    | `date`          | DATE           | NOT NULL                | Date of the event.                                                             |
    | `startTime`      | TIME           | NOT NULL                | Starting time of the event.                                                    |
    | `endTime`      | TIME           | NOT NULL                | Ending time of the event.                                                    |
    | `ageCategories` | JSON           | NOT NULL                | JSON array of the age category (ex. { "categoryName" : "0-1 year", "price": 500, "maxCapacity" : 100}) |
    | `createdAt`     | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP      | Date and time when the event was created.                                   |
    | `updatedAt`     | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP    | Date and time when the event was last updated.                           |

**3.4. `games` Table**

*   **Purpose:** Stores information about games available at NIBOG events.

    | Field          | Data Type      | Constraints     | Description                                                  |
    |----------------|----------------|-----------------|--------------------------------------------------------------|
    | `id`           | INT            | PRIMARY KEY, AUTO_INCREMENT| Unique identifier for the game.                            |
    | `name`         | VARCHAR(255)    | NOT NULL        | Name of the game.                                            |
    | `description`  | TEXT           |                 | Detailed description of the game.                           |
    | `ageRange`    | VARCHAR(255) | NOT NULL | Range of ages eligible for the game (e.g., "0-1 year", "1-2 years").|
    | `image`      | VARCHAR(255) | | URL or location of the game image |
    | `videoLink`    | VARCHAR(255)  |                 | Link to a video showcasing the game.                         |
    | `createdAt`    | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP        | Date and time when the game was created.                      |
    | `updatedAt`    | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  | Date and time when the game was last updated.                     |

**3.5. `registrations` Table**

*   **Purpose:** Stores information about registrations for events.

    | Field           | Data Type      | Constraints                                   | Description                                                            |
    |-----------------|----------------|-----------------------------------------------|------------------------------------------------------------------------|
    | `id`            | INT            | PRIMARY KEY, AUTO_INCREMENT                    | Unique identifier for the registration.                              |
    | `eventId`       | INT            | NOT NULL, FOREIGN KEY REFERENCES `events`(`id`) ON DELETE CASCADE   | Foreign key referencing the `events` table.                          |
    | `gameId`        | INT            | NOT NULL, FOREIGN KEY REFERENCES `games`(`id`) ON DELETE CASCADE   | Foreign key referencing the `games` table.                         |
    | `childName`    | VARCHAR(255)    | NOT NULL                                     | Name of the child being registered.                                    |
    | `childAge`       | VARCHAR(255)    | NOT NULL                                      | Age of the child during the registration.                              |
    | `parentName`    | VARCHAR(255)    | NOT NULL                                     | Name of the parent registering the child.                              |
    | `parentContact` | VARCHAR(255)    | NOT NULL                                     | Contact information of the parent.                                    |
    | `paymentStatus`   | ENUM('pending', 'completed', 'failed')        | DEFAULT 'pending'                     | Status of the payment for the registration.                         |
    | `paymentId`       | VARCHAR(255)  |   | PhonePe payment id                      |
    | `createdAt`     | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP                      | Date and time when the registration was created.                       |
    | `updatedAt`     | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP    | Date and time when the registration was last updated.              |

**4. Entity-Relationship (ER) Descriptions**

This section details the relationships between the tables in the database:

*   **One-to-Many:**
    *   A `city` can have multiple `events` (One-to-Many, represented by the `cityId` foreign key in the `events` table).
    *   An `event` can have multiple `registrations` (One-to-Many, represented by the `eventId` foreign key in the `registrations` table).
    *   A `game` can have multiple `registrations` (One-to-Many, represented by the `gameId` foreign key in the `registrations` table).
*   **Many-to-Many:** There are no many-to-many relationships in this design.

**5. Data Flow Description**

The data flow in the system operates as follows:

1.  **User Interaction:**
    *   A user (parent) navigates the application to view events.
    *   The user can filter events based on city and date.
    *   The user can register for an event, and their details (child's name, age, and parent details) are stored in the `registrations` table.
    *  A user can manage their account through clerk auth and view their registered events
2.  **Admin Interaction:**
    *   Admin users can access a dedicated interface to create, update, and delete events, cities, and games.
    *   They can manage and view all registration data.
    *  They can also generate reports of the events and the registration.
3.  **Data Management:**
    *   Event data (name, date, city, etc.) is stored in the `events` table.
    *   City information (name) is stored in the `cities` table.
    *   Game details (name, description, age range, etc.) are stored in the `games` table.
    *   Registration details (child name, age, parent info, selected game, event, payment status) are stored in the `registrations` table.
    *   User information (email, role etc.) are stored in the `users` table.
4.  **Payment Flow:**
    *   After completing registration, the user proceeds to payment through the PhonePe gateway.
    *   The status is updated in the `registrations` table and stored by the payment gateway.
5. **Email Notifications:**
   * Upon successfull payment, a notification is sent to the user through nodemailer with the registration details.
6. **Data Retrieval:**
  * Data is queried through the Prisma client for any data fetching or modifying processes.
  * Data is returned to the user as JSON

**6. Data Integrity and Relationships**

*   **Foreign Keys:** The use of foreign keys enforces data integrity by linking related records across tables. For example, deleting a city will also delete any associated events due to the `ON DELETE CASCADE` constraint.
*   **Unique Constraints:** The unique constraints on fields like email and city ensure no duplication of records.
*  **Data Types and Constraints:**  Ensuring data types are correct and that the constraints are set correctly, helps in maintainig the data integrity within the tables.

**7. Conclusion**

This Database Design Documentation provides a detailed blueprint for the storage and management of data within the NIBOG Event Booking Website application. The relational structure, clear table descriptions, and explicit ER descriptions will help the development team build a reliable and scalable data storage mechanism.

If you need any further clarification or modifications, please let me know!
