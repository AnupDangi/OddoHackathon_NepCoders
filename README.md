# SynergySphere – Advanced Team Collaboration Platform

![SynergySphere](https://img.shields.io/badge/SynergySphere-v1.0-blue.svg)
![React](https://img.shields.io/badge/React-19.1.1-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)
![Supabase](https://img.shields.io/badge/Database-Supabase-green.svg)

## 🚀 Overview

SynergySphere is an advanced team collaboration platform designed to act as the central nervous system for teams. Unlike traditional project management tools, SynergySphere focuses on being intelligent, proactive, and supportive — ensuring teams stay organized, aligned, and continuously improving.

This repository contains the Minimum Viable Product (MVP) implementation of SynergySphere for both desktop and mobile platforms. The MVP focuses on core task management and team communication, while laying the groundwork for future intelligent features.

## 🎯 Vision & Mission

**Vision:** Teams work at their best when their tools truly support how they think, communicate, and move forward together.

**Mission:** Build a platform that goes beyond simple task tracking — one that helps teams avoid bottlenecks, stay aligned, and communicate effectively.

## ✨ Features

### 🔐 Authentication & User Management
- User registration and login
- JWT-based authentication
- Profile management with avatars
- Secure password handling

### 📋 Project Management
- Create and manage projects
- Project priorities (Low, Medium, High)
- Project deadlines and descriptions
- Tag-based organization
- Member management and roles

### ✅ Task Management
- Create, assign, and track tasks
- Task statuses (To-Do, In Progress, Done)
- Task deadlines and priorities
- Tag-based categorization
- Task assignments to team members

### 🔔 Smart Notifications
- Real-time notifications for project updates
- Task assignment notifications
- Deadline reminders
- Project invitation alerts
- Mark as read/unread functionality

### 👥 Team Collaboration
- Project member management
- Role-based permissions
- Team member invitations
- User search and discovery

### 📊 Dashboard & Analytics
- Project overview and statistics
- Task completion tracking
- Team performance insights
- Deadline monitoring

## 🏗️ Architecture

### Frontend (`/synergy`)
- **Framework:** React 19.1.1 with Vite
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Context API

### Backend (`/backend`)
- **Runtime:** Node.js with Express.js
- **Database:** Supabase (PostgreSQL)
- **Authentication:** JWT tokens
- **Email Service:** Nodemailer
- **API Version:** v1.0

## 🛠️ Technology Stack

### Frontend Technologies
```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-router-dom": "^7.8.2",
  "@supabase/supabase-js": "^2.57.2",
  "lucide-react": "^0.542.0",
  "vite": "^5.0.0"
}
```

### Backend Technologies
```json
{
  "express": "^5.1.0",
  "@supabase/supabase-js": "^2.57.2",
  "nodemailer": "^7.0.6",
  "cors": "^2.8.5",
  "dotenv": "^17.2.2",
  "body-parser": "^2.2.0"
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Gmail account (for email notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd SynergySphere
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Configure your environment variables (see Configuration section)
   
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../synergy
   npm install
   npm run dev
   ```

### Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Email Configuration
EMAIL_USER=your_gmail_address
EMAIL_APP_PASSWORD=your_gmail_app_password

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Database Setup

The database schema is defined in [`backend/models/Schema.md`](backend/models/Schema.md). Key tables include:

- **profiles** - User profiles and information
- **projects** - Project management
- **project_members** - Team membership
- **tasks** - Task management
- **notifications** - Notification system

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `POST /auth/logout` - User logout

### Project Endpoints
- `GET /projects/` - Get all projects
- `POST /projects/` - Create new project
- `GET /projects/:id` - Get project by ID
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project
- `POST /projects/:id/members` - Add project member
- `DELETE /projects/:id/members/:userId` - Remove project member

### Task Endpoints
- `GET /tasks/` - Get all user tasks
- `POST /tasks/` - Create new task
- `GET /tasks/:id` - Get task by ID
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `GET /tasks/project/:projectId` - Get tasks by project

### Notification Endpoints
- `GET /notifications/` - Get all notifications
- `GET /notifications/unread-count` - Get unread count
- `PUT /notifications/:id/read` - Mark as read
- `PUT /notifications/read-all` - Mark all as read
- `DELETE /notifications/:id` - Delete notification

For detailed API testing, see [`backend/API_TESTING_GUIDE.md`](backend/API_TESTING_GUIDE.md).

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
npm run test:auth     # Auth tests only
npm run test:projects # Project tests only
```

### Frontend Testing
```bash
cd synergy
npm run lint          # ESLint check
```

## 📁 Project Structure

```
SynergySphere/
├── backend/                    # Backend API server
│   ├── config/                # Configuration files
│   │   └── supabase.js        # Supabase client setup
│   ├── controllers/           # Business logic
│   │   ├── authController.js  # Authentication logic
│   │   ├── projectController.js # Project management
│   │   ├── taskController.js   # Task management
│   │   └── notificationController.js # Notifications
│   ├── middlewares/           # Express middlewares
│   │   ├── auth.js           # Authentication middleware
│   │   ├── errorHandler.js   # Error handling
│   │   └── validation.js     # Input validation
│   ├── routes/               # API routes
│   │   └── api/v1/          # Version 1 API routes
│   ├── models/              # Database schemas
│   └── server.js           # Server entry point
├── synergy/                 # Frontend React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context providers
│   │   ├── api/            # API client functions
│   │   └── main.jsx        # Application entry point
│   ├── public/             # Static assets
│   └── index.html         # HTML template
└── README.md              # This file
```

## 🎨 UI/UX Features

- **Responsive Design:** Works on desktop, tablet, and mobile
- **Dark/Light Theme Support:** System preference detection
- **Modern UI Components:** Clean, professional interface
- **Real-time Updates:** Live notifications and data updates
- **Intuitive Navigation:** Easy-to-use project and task management
- **Accessibility:** Screen reader friendly and keyboard navigation

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- CORS protection
- Environment variable configuration
- Secure password handling

## 🚦 Development Workflow

1. **Feature Development:**
   - Create feature branch from `main`
   - Develop frontend and backend components
   - Test API endpoints using the testing guide
   - Ensure responsive design

2. **Testing:**
   - Run backend tests
   - Test API endpoints with Postman/curl
   - Manual testing of UI components
   - Cross-browser testing

3. **Deployment:**
   - Build frontend: `npm run build`
   - Deploy backend to server
   - Configure environment variables
   - Set up database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Supabase for the backend-as-a-service platform
- React team for the amazing frontend framework
- Express.js for the robust backend framework
- All contributors and testers

## 📞 Support

For support, email support@synergysphere.com or create an issue in this repository.

---

**SynergySphere** - Where teams thrive together 🚀

