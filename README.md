# Movies & Series Management System

A comprehensive backend API for managing movies and series with role-based access control. Admin users can manage the content catalog (add/edit/delete movies and series), while regular users can browse content, track their favorite items, manage personal watchlists, add ratings and notes.

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator

## Features

- 🔐 **JWT Authentication** with role-based access control
- 👥 **User Roles**: Regular Users (viewers) and Admins (content managers)
- 🎬 **Movie Management**: CRUD operations for movies (admin only)
- 📺 **Series Management**: CRUD operations for TV series (admin only)
- 📋 **Personal Watchlists**: Users can track movies/series they want to watch
- ⭐ **Ratings & Notes**: Personal ratings and notes for watched content
- 🔍 **Search Functionality**: Search movies and series by title, genre, or synopsis
- 📄 **API Documentation**: Interactive Swagger documentation

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd movie_and-_series_managment_system
```

2. Install dependencies
```bash
npm install
```

3. Setup PostgreSQL database
   - Create a PostgreSQL database named `movies_series_db`
   - Update the DATABASE_URL in `.env` file

4. Configure environment variables
```bash
# Copy the .env file and update with your values
DATABASE_URL="postgresql://username:password@localhost:5432/movies_series_db"
JWT_SECRET="your-secret-key-here-change-in-production"
JWT_EXPIRATION="7d"
PORT=5001
```

5. Run database migrations
```bash
npx prisma migrate dev
```

6. Seed the database with initial data
```bash
npm run seed
```

7. Start the development server
```bash
npm run start:dev
```

## Default Credentials

After running the seed command, you can use these credentials:

- **Admin**: admin@movies.com / admin123
- **User**: user@movies.com / user123

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/register-admin` - Register admin user (Admin only)

### Users
- `GET /users/profile` - Get current user profile (Protected)
- `PUT /users/profile` - Update user profile (Protected)
- `GET /users` - List all users (Admin only)
- `PUT /users/:id/role` - Update user role (Admin only)
- `DELETE /users/:id` - Delete user account (Protected)

### Movies
- `GET /movies` - List all movies with pagination
- `GET /movies/:id` - Get single movie details
- `GET /movies/search?q=` - Search movies
- `POST /movies` - Create new movie (Admin only)
- `PUT /movies/:id` - Update movie (Admin only)
- `DELETE /movies/:id` - Delete movie (Admin only)

### Series
- `GET /series` - List all series with pagination
- `GET /series/:id` - Get single series details
- `GET /series/search?q=` - Search series
- `POST /series` - Create new series (Admin only)
- `PUT /series/:id` - Update series (Admin only)
- `DELETE /series/:id` - Delete series (Admin only)

### Watchlist
- `GET /watchlist` - Get user's complete watchlist (Protected)
- `GET /watchlist/movies` - Get only movies from watchlist (Protected)
- `GET /watchlist/series` - Get only series from watchlist (Protected)
- `GET /watchlist/status/:status` - Filter by watch status (Protected)
- `POST /watchlist` - Add movie/series to watchlist (Protected)
- `PUT /watchlist/:id` - Update watchlist item (Protected)
- `DELETE /watchlist/:id` - Remove from watchlist (Protected)

## API Documentation

Once the server is running, you can access the interactive API documentation at:
```
http://localhost:5001/api-docs
```

## Database Schema

The system uses the following main entities:

- **User**: Stores user information with role (USER/ADMIN)
- **Movie**: Movie information including title, release date, genre, synopsis, rating
- **Series**: TV series information including seasons, start/end year
- **Watchlist**: User's personal watchlist linking to movies/series with status and personal notes

## Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run seed` - Seed database with initial data
- `npm run test` - Run unit tests
- `npm run lint` - Run linter

## Project Structure

```
src/
├── auth/          # Authentication module (JWT, guards, strategies)
├── users/         # User management module
├── movies/        # Movie CRUD operations
├── series/        # Series CRUD operations
├── watchlist/     # User watchlist management
├── prisma/        # Database service
├── common/        # Shared decorators and utilities
└── main.ts        # Application entry point
```

## Role-Based Access Control

- **Regular Users (USER)**:
  - Browse movies and series
  - Manage personal watchlist
  - Update own profile
  - Add ratings and notes

- **Administrators (ADMIN)**:
  - All user permissions
  - Create, update, delete movies and series
  - View all users
  - Update user roles
  - Register new admin users

## License

This is a university project - for educational purposes only.