# MP Heritage Portal - Backend API (Skeleton)

This directory contains the Express + Node.js backend setup for the MP Heritage project.

## Directory Structure

* **`src/config/`**: Database connection configurations.
* **`src/controllers/`**: Request handlers mapping endpoints to data logic.
* **`src/models/`**: MongoDB schema definitions using Mongoose.
* **`src/routes/`**: API endpoint routes definitions.
* **`src/middlewares/`**: Authorization, request auditing, and role checks.
* **`src/app.js`**: Main entry point initializing Express server.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   * Copy `.env.example` to `.env` and fill in secrets.

3. Run server:
   ```bash
   npm run dev
   ```
