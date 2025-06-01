# Expenses App - Frontend (Next.js)

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-Application-black?style=for-the-badge&logo=next.js" alt="Next.js Application" />
  <img src="https://img.shields.io/badge/React-UI-61DAFB?style=for-the-badge&logo=react" alt="React UI" />
  <img src="https://img.shields.io/badge/TypeScript-Code-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Chakra%20UI-Styling-319795?style=for-the-badge&logo=chakraui" alt="Chakra UI" />
  <img src="https://img.shields.io/badge/Apollo%20Client-GraphQL-e535ab?style=for-the-badge&logo=apollographql" alt="Apollo Client" />
</p>

This is the frontend for the Expenses App, built with Next.js, React, and Chakra UI. It provides the user interface for managing personal expenses and interacts with the backend GraphQL API.

## ✨ Features

  * **User Authentication Pages**: UI for Login and Registration.
  * **Interactive Dashboard**: Overview of expenses, potentially with stats and charts.
  * **Expense Management**: Forms for creating and editing expenses.
  * **Dynamic Expense Table**: Displays expenses with features like:
      * Filtering by various criteria (name, category, currency, amount range, date range).
      * Sorting by different columns (name, amount, date).
      * Pagination for handling large datasets.
  * **Responsive Design**: Built with Chakra UI for adaptability across devices.
  * **Real-time Data Interaction**: Uses Apollo Client to communicate with the backend GraphQL API.

## 🛠️ Tech Stack

  * **Framework**: [Next.js](https://nextjs.org/) (with React)
  * **Language**: [TypeScript](https://www.typescriptlang.org/)
  * **UI Library**: [Chakra UI](https://chakra-ui.com/)
  * **GraphQL Client**: [Apollo Client](https://www.apollographql.com/docs/react/)
  * **Date Formatting**: [date-fns](https://date-fns.org/)
  * **Code Generation**: [GraphQL Code Generator](https://www.the-guild.dev/graphql/codegen) for GraphQL types.

## 🚀 Getting Started

There are two main ways to run this frontend:

### 1\. Local Development (Standalone Frontend)

This method is useful if you want to focus solely on frontend development and have the backend API running separately (either locally without Docker or its Dockerized version).

**Prerequisites:**

  * Node.js (v22 or later recommended)
  * npm (or yarn/pnpm)
  * A running instance of the backend API.

**Steps:**

1.  **Navigate to the frontend directory:**

    ```bash
    cd expenses-tracker/frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the `frontend` directory:

    ```bash
    # frontend/.env.local
    NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:3000/graphql 
    # Adjust if your backend runs on a different port locally
    ```

    This tells your Next.js app where to find the backend GraphQL API.

4.  **Generate GraphQL Types:**
    Ensure your frontend types are synchronized with the backend schema:

    ```bash
    npm run generate:graphql-types
    ```

    (This requires your backend GraphQL server to be running and accessible at the endpoint configured for codegen.)

5.  **Run the development server:**

    ```bash
    npm run dev
    ```

    The frontend will start, usually on [http://localhost:3001](https://www.google.com/search?q=http://localhost:3001).

### 2\. With Docker Compose (Full Stack)

This is the recommended way to run the entire application (frontend and backend) together in a consistent environment.

1.  **Refer to the Root README:**
    All instructions for building and running the application using Docker Compose are in the main `README.md` file in the project's root directory.

2.  **How it Works:**

      * The `docker-compose.yml` file in the root directory defines the `frontend` service.
      * It builds the frontend Docker image using `frontend/Dockerfile`.
      * It automatically sets the `NEXT_PUBLIC_GRAPHQL_ENDPOINT` environment variable for the frontend container to `http://backend:3000/graphql`, allowing it to communicate with the backend service within the Docker network.

## 📜 Available Scripts

In the `frontend/package.json`, you'll find the following scripts:

  * `npm run dev`: Starts the Next.js development server (usually on port 3001).
  * `npm run build`: Builds the Next.js application for production.
  * `npm run start`: Starts the Next.js production server (after running `npm run build`).
  * `npm run lint`: Lints the codebase using ESLint.
  * `npm run generate:graphql-types`: Generates TypeScript types from your backend's GraphQL schema. Run this whenever the backend schema changes.

## ⚙️ Environment Variables

The primary environment variable used by the frontend is:

  * `NEXT_PUBLIC_GRAPHQL_ENDPOINT`: The URL of the backend GraphQL API.
      * For local development, set this in `frontend/.env.local`.
      * For Docker Compose, this is set in the `docker-compose.yml` file.
      * For cloud deployments (e.g., AWS Amplify via CDK), this is set during the deployment process.

## 🔄 GraphQL Code Generation

This project uses GraphQL Code Generator to create TypeScript types from the backend's GraphQL schema. This ensures type safety when interacting with the API.

  * **Configuration:** `codegen.ts`
  * **Output:** `@/types/graphql.types.ts` (or similar path)
  * **Command:** `npm run generate:graphql-types`

Remember to run this command whenever there are changes to the backend GraphQL schema that affect the data the frontend consumes or sends.