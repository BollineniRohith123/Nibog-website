# Nibog Event Booking Platform 🎉

## 🚀 Project Overview
Nibog is a comprehensive event booking platform for children's activities, offering seamless event discovery, registration, and management.

## 📦 Tech Stack
- **Frontend**: Next.js 14
- **Backend**: Prisma ORM
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **Database**: MySQL

## 📂 Project Structure

### Key Directories
- `components/`: Reusable React components
- `pages/`: Next.js page components
  - `admin/`: Admin dashboard pages
  - `events/`: Event-related pages
  - `api/`: Backend API routes
- `prisma/`: Database schema and migrations
- `utils/`: Utility functions and helpers

## 🔑 Core Features
- Event discovery by city, date, age
- Secure user registration
- Age-based game selection
- Admin dashboard for event management

## 🛠 Setup Instructions

### Prerequisites
- Node.js 18+
- MySQL Database

### Installation
1. Clone repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Configure environment variables
4. Run database migrations
   ```bash
   npx prisma migrate dev
   ```
5. Start development server
   ```bash
   npm run dev
   ```

## 🔐 Environment Configuration
- `DATABASE_URL`: MySQL connection
- `CLERK_PUBLISHABLE_KEY`: Authentication
- `ADMIN_USERS`: Admin user IDs

## 🚦 Key Routes
- `/events/[eventId]`: Event details
- `/events/[eventId]/register`: Registration
- `/admin/*`: Admin dashboard sections

## 🧪 Testing
```bash
npm run test
```

## 🚀 Deployment Platforms
- Vercel
- Netlify
- DigitalOcean

## 🤝 Contributing
1. Fork repository
2. Create feature branch
3. Commit changes
4. Create Pull Request

## 📜 License
[Specify License]

## 🆘 Support
Open GitHub issues or contact support@nibog.com
