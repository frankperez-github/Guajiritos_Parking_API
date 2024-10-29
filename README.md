
# API Parking Application - Technical Documentation

## Overview

This application serves as an API for managing parking spots, user authentication, and reservations. It includes controllers for users, parking spots, authentication, and logging activities.

## Prerequisites

- Node.js (version 14 or above)
- TypeScript
- PostgreSQL (or another database compatible with Sequelize)
- Recommended to use a tool like Postman for testing the API.

## Setup and Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/frankperez-github/Guajiritos_Parking_API
   ```
2. **Install dependencies**:
   Navigate to the project directory and install dependencies:

   ```bash
   npm install
   ```
3. **Set up Environment Variables**:
   Create a `.env` file in the root directory with the following variables:

   ```env
   MONGO_URI=<your_mongodb_database_url>
   JWT_SECRET=<your_jwt_secret>
   DB_NAME=<your_postgreSQL_database_name>
   DB_USER=<your_postgreSQL_database_user>
   DB_PASSWORD=<your_postgreSQL_database_password>
   ```
4. **Database Setup**:
   Initialize the database tables using Sequelize:

   ```bash
   npx sequelize-cli db:migrate
   ```
5. **Run the Application**:
   Start the server in development mode:

   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- **POST /auth/login**: Login user and generate JWT token.
- **POST /auth/register**: Register a new user.

### User Management

- **GET /users**: Retrieve all users (Admin only).
- **GET /users/:id**: Retrieve user by ID.
- **DELETE /users/:id**: Delete a user by ID (Admin only).

### Parking Spots

- **GET /parking**: Retrieve all parking spots.
- **POST /parking**: Create a new parking spot (Admin only).
- **PUT /parking/:id**: Update a parking spot (Admin only).
- **DELETE /parking/:id**: Delete a parking spot (Admin only).

### Logs

- **GET /logs**: Retrieve logs of all activities (Admin only).

For further details on each endpoint, please refer to the provided Postman collection.
