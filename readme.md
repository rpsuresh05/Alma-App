Here's a comprehensive README.md for the application:

# Almǎ - Lead Management

## Overview

Develop a Next.js frontend application to support creating, retrieving, and updating leads. The application will include a public lead submission form and an internal lead management interface, with authentication and state transitions.

├── app/ # Next.js application routes and pages
├── components/ # Reusable UI components
├── hooks/ # Custom React hooks
├── lib/ # Utility functions and shared code
├── prisma/ # Database schema and migrations
├── public/ # Static assets
└── jest.setup.js # Test configuration

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run setup
   ```
3. Set up environment variables:

   ```
   DATABASE_URL=
   JWT_SECRET=

   already added in .env local
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:

   ```bash
   npm run dev
   ```

6. To login use the following credentials:
   ```bash
   email: admin@alma.com
   password: admin123
   ```

## Core Features

### Public Features

- Visa Assessment Form
- File Upload System
- Lead Submission
- Responsive Design

### Administrative Features

- Secure Admin Dashboard
- Lead Management
- Status Tracking
- Document Management
- Authentication System

## Technical Architecture

### Frontend (`/app`)

- Built with Next.js 13+ (App Router)
- Client-side state management with React Query
- Responsive design with Tailwind CSS
- Type-safe development with TypeScript

### Components (`/components`)

- Modular UI components built with Radix UI
- Shadcn UI component library integration
- Custom components:
  - FileUpload
  - ButtonLoading
  - DataTable
  - Form elements

### Hooks (`/hooks`)

Custom React hooks for:

- `useAuth`: Authentication management
- `useLeads`: Lead data management
- `useAssessmentSubmit`: Form submission
- `useToast`: Notification system
- `useMobile`: Responsive design utilities

### Library (`/lib`)

Utility functions and shared code:

- Database client (Prisma)
- Authentication utilities
- Type definitions
- Data transformations
- Common utilities

### Database (`/prisma`)

- PostgreSQL database
- Prisma ORM
- Schema includes:
  - Users
  - Leads
  - Files
  - Authentication

### Public Assets (`/public`)

Static files including:

- Images
- Icons
- Fonts
- Other media assets

### Testing (`jest.setup.js`)

- Jest configuration
- Testing utilities
- Mock data

## Key Technologies

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Database**: PostgreSQL, Prisma
- **Authentication**: JWT, bcrypt
- **State Management**: React Query
- **File Handling**: Built-in file system
- **Testing**: Jest

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Secure file uploads
- Role-based access control

## Development Guidelines

- Follow TypeScript best practices
- Use component-driven development
- Implement proper error handling
- Write tests for critical functionality
- Follow the established project structure

## API Routes

- `/api/auth/*`: Authentication endpoints
- `/api/leads/*`: Lead management
- `/api/files/*`: File handling
- `/api/upload`: File upload endpoint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License

[License Type] - See LICENSE file for details
