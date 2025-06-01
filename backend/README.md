# Expenses App - Backend API

\<p align="center"\>
\<img src="[suspicious link removed]" alt="NestJS API" /\>
\<img src="[suspicious link removed]" alt="GraphQL API" /\>
\<img src="[suspicious link removed]" alt="PostgreSQL" /\>
\<img src="[suspicious link removed]" alt="Prisma ORM" /\>
\<img src="[suspicious link removed]" alt="Redis Cache" /\>
\<img src="[suspicious link removed]" alt="Docker" /\>
\</p\>

This is the backend service for the Expenses App, a robust and scalable server-side application built with NestJS. It provides a GraphQL API for managing user authentication and expense tracking, leveraging PostgreSQL for data persistence and Redis for caching.

-----

## Features ✨

  * **User Authentication**: Secure JWT-based authentication (Login/Register).
  * **Expense Management**: Full CRUD operations for user expenses.
  * **GraphQL API**: A comprehensive API for all data interactions.
  * **Database**: PostgreSQL for relational data storage, managed with Prisma ORM.
  * **Caching**: Redis integration for caching frequent queries, improving response times.
  * **Data Validation**: Input validation using `class-validator` and DTOs.
  * **Containerized**: Dockerized for consistent development and deployment environments.

-----

## Architecture Overview 🏗️

The backend follows a standard NestJS modular architecture:

1.  **Core Framework**: [NestJS](https://nestjs.com/) provides the fundamental structure, dependency injection, and modularity.
2.  **API Layer**: [GraphQL](https://graphql.org/) is used to define the API schema and handle queries/mutations. `@nestjs/graphql` and `@apollo/server` are used for integration.
3.  **Authentication**: Implemented using JWTs (`@nestjs/jwt`) and Passport.js (`@nestjs/passport`, `passport-jwt`). Passwords are hashed using `bcryptjs`.
4.  **Database Interaction**: [Prisma](https://www.prisma.io/) serves as the ORM, simplifying database access to PostgreSQL. The schema includes `User` and `Expense` models with defined relations and enums for `Currency` and `Category`.
5.  **Caching**: [Redis](https://redis.io/) (via `ioredis`) is used as a caching layer for the `findAll` expenses query to reduce database load and improve performance for frequently accessed data. Cache keys are generated based on user ID and query parameters (pagination, filter, sort). Cache invalidation occurs upon creating, updating, or deleting expenses for a user.
6.  **Configuration**: Environment variables are managed using `@nestjs/config`.
7.  **Validation**: DTOs are validated using `class-validator` and `class-transformer`.
8.  **Docker**: The application is containerized, with a multi-stage `Dockerfile` for optimized image size and an entrypoint script (`docker-entrypoint.sh`) that automatically runs Prisma migrations (`prisma migrate deploy`) on container startup.

-----

## Prerequisites 🛠️

  * [Node.js](https://nodejs.org/) (v22 or later recommended for local development without Docker)
  * [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
  * [Docker](https://www.docker.com/get-started) (if running with Docker Compose)
  * [Docker Compose](https://docs.docker.com/compose/install/) (if running with Docker Compose)
  * A running PostgreSQL instance (if running locally without Docker)
  * A running Redis instance (if running locally without Docker)

-----

## Getting Started 🚀

There are two ways to run the backend: using Docker Compose (recommended for ease of setup) or running locally.

### Option 1: Running with Docker Compose (Recommended)

This is the easiest way to get all services (backend, PostgreSQL, Redis) up and running with minimal configuration. Assumes you are in the root directory of the full-stack project where `docker-compose.yml` is located.

1.  **Clone the main project repository (if you haven't already):**

    ```bash
    git clone https://github.com/oanh-go-huynh/expenses-tracker.git
    cd expenses-tracker
    ```

2.  **Navigate to the backend directory and create a `.env` file:**
    Copy the example environment file and customize it, especially the `JWT_SECRET`.

    ```bash
    cd backend
    cp .env.example .env
    ```

    Edit `.env` and set your `JWT_SECRET`. The default `DATABASE_URL`, `REDIS_HOST`, and `REDIS_PORT` are pre-configured for Docker Compose.

3.  **Build and run the services:**
    From the **root directory of the full-stack project** (where `docker-compose.yml` is):

    ```bash
    docker-compose up --build -d backend
    ```

    If you want to run all services defined in `docker-compose.yml` (frontend, pgAdmin, etc.):

    ```bash
    docker-compose up --build -d
    ```

    The backend API will be available at `http://localhost:3000`.
    The GraphQL Playground will be accessible at `http://localhost:3000/graphql`.

### Option 2: Running Locally (Without Docker)

1.  **Navigate to the backend directory:**

    ```bash
    cd backend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up PostgreSQL and Redis:**
    Ensure you have PostgreSQL and Redis instances running and accessible.

4.  **Create a `.env` file:**
    Copy `.env.example` to `.env` and configure the following variables to point to your local instances:

    ```env
    DATABASE_URL="postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/YOUR_DB_NAME?schema=public"
    REDIS_HOST="localhost"
    REDIS_PORT=6379
    JWT_SECRET="yourSuperSecretKeyForLocalDev"
    PORT=3000
    ```

5.  **Run Prisma Migrations:**
    This will set up your database schema.

    ```bash
    npx prisma migrate deploy
    ```

    For development, if you make schema changes, use:

    ```bash
    npx prisma migrate dev
    ```

6.  **Generate Prisma Client:**

    ```bash
    npx prisma generate
    ```

7.  **Start the application:**

      * **Development mode (with hot-reloading):**
        ```bash
        npm run start:dev
        ```
      * **Production mode:**
        ```bash
        npm run build
        npm run start:prod
        ```

    The backend API will be available at `http://localhost:3000`.
    The GraphQL Playground will be accessible at `http://localhost:3000/graphql`.

-----

## Scripts 📜

Available `npm` scripts (from `package.json`):

  * `npm run build`: Compiles the TypeScript application.
  * `npm run format`: Formats code using Prettier.
  * `npm run start`: Starts the application (requires a prior build).
  * `npm run start:dev`: Starts the application in development mode with hot-reloading.
  * `npm run start:prod`: Starts the compiled application (for production).
  * `npm run lint`: Lints the codebase.
  * `npm run test`: Runs unit tests.
  * `npm run test:watch`: Runs unit tests in watch mode.
  * `npm run test:cov`: Generates a test coverage report.
  * `npm run test:e2e`: Runs end-to-end tests.

-----

## How Redis Caching Works 🧠

Redis is implemented in the `ExpensesService` to cache the results of the `findAll` operation, which is likely to be a frequent query.

1.  **Cache Key Generation**:

      * When `findAll` is called, a unique cache key is generated based on `userId`, pagination arguments (`limit`, `offset`), and stringified versions of the `filter` and `sort` arguments. This ensures that different query parameters result in different cache entries.
      * Example key: `expenses:user123:offset=0:limit=10:filter={"category":"FOOD"}:sort={"field":"date","direction":"desc"}`

2.  **Cache Retrieval**:

      * Before querying the database, the service first attempts to retrieve data from Redis using the generated key.
      * If data is found in the cache (`cachedResult`), it's parsed from JSON. A crucial step here is **rehydrating date strings** (for `date`, `createdAt`, `updatedAt`) back into JavaScript `Date` objects because `JSON.stringify` converts dates to strings.
      * The cached data (now with proper `Date` objects) is then returned, avoiding a database hit.

3.  **Cache Storage**:

      * If data is not found in the cache, it's fetched from the PostgreSQL database using Prisma.
      * The `result` (containing `items`, `totalCount`, `limit`, and `offset`) is then stored in Redis using `setex` (set with expiry).
      * A `CACHE_TTL_SECONDS` (Time To Live) is set (e.g., 60 seconds), after which the cache entry will automatically expire.

4.  **Cache Invalidation**:

      * To maintain data consistency, the cache for a specific user's expenses is invalidated whenever an expense is created, updated, or deleted by that user.
      * The `invalidateUserExpenseCaches` method finds all keys matching the pattern `expenses:${userId}:*` and deletes them from Redis. This ensures that subsequent `findAll` calls for that user will fetch fresh data from the database and then re-cache it.

This caching strategy helps to significantly reduce database load for common read operations and improves the overall performance and responsiveness of the API.