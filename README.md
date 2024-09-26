# PM2 Manager API

## Description

The PM2 Manager API is a Node.js application that allows users to manage processes using PM2 (Process Manager 2). It provides endpoints to start, stop, restart, delete, and monitor the status of applications managed by PM2. Additionally, the API includes Swagger documentation for easy interaction and testing of the available endpoints.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Swagger Documentation](#swagger-documentation)
- [Environment Variables](#environment-variables)
- [License](#license)

## Features

- List all processes managed by PM2
- Start a new application with a specified script and parameters
- Stop, restart, or delete an application using its UUID
- Monitor the status of a process using its UUID
- Swagger documentation for easy API interaction

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/fgonga/pm2-api.git
   cd pm2-api
   ```

2. **Install the dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file** in the project root and add the following environment variables:

   ```bash
   PORT=3000         # Port for the API to listen on
   SERVER_IP=localhost # Server IP address
   ```

## Usage

1. **Start the application:**

   ```bash
   node server.js
   ```

2. **Access the API:**
   The API will be running on `http://localhost:3000` (or your specified server IP and port).

## API Endpoints

| Method | Endpoint           | Description                               |
|--------|--------------------|-------------------------------------------|
| GET    | `/processes`       | List all processes managed by PM2       |
| POST   | `/start`           | Start a new application                   |
| POST   | `/stop`            | Stop an application using UUID            |
| POST   | `/restart`         | Restart an application using UUID         |
| POST   | `/delete`          | Delete an application using UUID          |
| GET    | `/status/{uuid}`   | Monitor the status of a process using UUID|

### Request and Response Format

- **Start a new application:**

  **Request:**
  ```json
  {
    "script": "path/to/your/script.js",
    "params": ["arg1", "arg2"],
    "name": "optional-name"
  }
  ```

  **Response:**
  ```json
  {
    "status": "success",
    "message": "Process started successfully",
    "data": {
      "process details"
    }
  }
  ```

- **Stop, Restart, Delete, and Status Check:**

  **Request:**
  ```json
  {
    "uuid": "your-uuid"
  }
  ```

  **Response:**
  ```json
  {
    "status": "success",
    "message": "Process stopped successfully"
  }
  ```

## Swagger Documentation

The API includes Swagger documentation that provides a user-friendly interface for exploring and testing the API endpoints. Access the Swagger UI at:

```
http://localhost:3000/api-docs
```

## Environment Variables

- `PORT`: The port number on which the API will run (default: 3000).
- `SERVER_IP`: The server IP address (default: localhost).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Feel free to modify the content, add examples, or enhance the documentation as needed!
