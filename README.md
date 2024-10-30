
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
5. **Run e2e tests**:

   ```bash
   npm test
   ```
   
6. **Run the Application**:

   ```bash
   npm start
   ```

# API Endpoints

## Autenticación

- **POST `/auth/login`**
  - **Descripción**: Autentica al usuario y genera un token JWT.
  - **Parámetros del cuerpo**:
    - `email` (string): Correo del usuario.
    - `password` (string): Contraseña del usuario.
  - **Respuesta**:
    - `200 OK`: Retorna el token de acceso.
    - `401 Unauthorized`: Credenciales incorrectas.
    - `500 Internal Server Error`: Error en el proceso de autenticación.

## Gestión de Usuarios

- **POST `/users`**
  - **Descripción**: Crea un nuevo usuario.
  - **Parámetros del cuerpo**:
    - `name` (string): Nombre del usuario.
    - `email` (string): Correo electrónico del usuario.
    - `password` (string): Contraseña del usuario.
    - `role` (string): Rol del usuario (por ejemplo, `cliente`, `empleado`, `admin`).
  - **Respuesta**:
    - `201 Created`: Retorna el objeto del usuario creado.
    - `500 Internal Server Error`: Error al crear el usuario.

- **GET `/users`**
  - **Descripción**: Recupera todos los usuarios (requiere autenticación de administrador).
  - **Respuesta**:
    - `200 OK`: Lista de usuarios.
    - `500 Internal Server Error`: Error al recuperar los usuarios.

- **GET `/users/:id`**
  - **Descripción**: Recupera un usuario específico por su ID.
  - **Parámetros de ruta**:
    - `id` (string): ID del usuario.
  - **Respuesta**:
    - `200 OK`: Información del usuario.
    - `404 Not Found`: Usuario no encontrado.
    - `500 Internal Server Error`: Error al recuperar el usuario.

- **PUT `/users/:id`**
  - **Descripción**: Actualiza un usuario específico.
  - **Parámetros de ruta**:
    - `id` (string): ID del usuario.
  - **Parámetros del cuerpo**:
    - `name` (string, opcional): Nombre actualizado.
    - `email` (string, opcional): Correo electrónico actualizado.
    - `password` (string, opcional): Nueva contraseña (se almacena como hash).
    - `role` (string, opcional): Rol actualizado.
  - **Respuesta**:
    - `200 OK`: Información del usuario actualizado.
    - `404 Not Found`: Usuario no encontrado.
    - `500 Internal Server Error`: Error al actualizar el usuario.

- **DELETE `/users/:id`**
  - **Descripción**: Elimina un usuario específico.
  - **Parámetros de ruta**:
    - `id` (string): ID del usuario.
  - **Respuesta**:
    - `200 OK`: Usuario eliminado.
    - `404 Not Found`: Usuario no encontrado.
    - `500 Internal Server Error`: Error al eliminar el usuario.

## Gestión de Espacios de Estacionamiento

- **GET `/parking`**
  - **Descripción**: Recupera todos los espacios de estacionamiento.
  - **Respuesta**:
    - `200 OK`: Lista de espacios de estacionamiento.
    - `500 Internal Server Error`: Error al recuperar los espacios.

## Reservas y Entradas de Estacionamiento

- **POST `/parking/reserve`**
  - **Descripción**: Reserva un espacio de estacionamiento.
  - **Parámetros del cuerpo**:
    - `vehicleDetails` (string): Detalles del vehículo.
    - `reservationStart` (string): Hora de inicio de la reserva.
    - `reservationEnd` (string): Hora de fin de la reserva.
  - **Respuesta**:
    - `201 Created`: Información de la reserva creada.
    - `400 Bad Request`: No hay espacios disponibles.
    - `500 Internal Server Error`: Error al realizar la reserva.

- **DELETE `/parking/cancel/:id`**
  - **Descripción**: Cancela una reserva de estacionamiento.
  - **Parámetros de ruta**:
    - `id` (string): ID de la reserva.
  - **Respuesta**:
    - `200 OK`: Reserva cancelada.
    - `404 Not Found`: Reserva no encontrada.
    - `500 Internal Server Error`: Error al cancelar la reserva.

- **POST `/parking/enter`**
  - **Descripción**: Marca la entrada de un vehículo en un espacio de estacionamiento reservado.
  - **Parámetros del cuerpo**:
    - `vehicleDetails` (string): Detalles del vehículo.
    - `entryTime` (string): Hora de entrada.
  - **Respuesta**:
    - `200 OK`: Entrada registrada en el espacio reservado.
    - `404 Not Found`: No hay un espacio de estacionamiento disponible.
    - `500 Internal Server Error`: Error al registrar la entrada.

- **POST `/parking/exit/:id`**
  - **Descripción**: Marca la salida de un vehículo de un espacio de estacionamiento.
  - **Parámetros de ruta**:
    - `id` (string): ID del espacio de estacionamiento.
  - **Respuesta**:
    - `200 OK`: Salida registrada.
    - `404 Not Found`: El espacio ya está disponible o no se encontró.
    - `500 Internal Server Error`: Error al registrar la salida.

## Logs de Actividades

- **POST `/logs`**
  - **Descripción**: Crea un nuevo registro de actividad.
  - **Parámetros del cuerpo**:
    - `action` (string): Acción del log (por ejemplo, 'reservation', 'cancellation', 'entry', 'exit').
    - `userId` (integer): ID del usuario que realiza la acción.
    - `details` (string): Descripción de la actividad.
  - **Respuesta**:
    - `201 Created`: Registro creado.
    - `500 Internal Server Error`: Error al crear el log.

- **GET `/logs`**
  - **Descripción**: Recupera todos los registros de actividades (requiere autenticación de administrador).
  - **Respuesta**:
    - `200 OK`: Lista de registros de actividad.
    - `500 Internal Server Error`: Error al recuperar los registros.
