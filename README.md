# WeRoad Checkout

WeRoad Checkout is a monorepo project designed to handle both the frontend and backend of the WeRoad checkout system. This project uses Nuxt.js for the frontend and NestJS for the backend. 

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed [pnpm](https://pnpm.io/installation)
- You have a running PostgreSQL database

## Getting Started

To get a local copy up and running, follow these steps.

### Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/fasenderos/wearoad.git
    cd wearoad
    ```

2. **Install dependencies and set up the project:**

    ```sh
    pnpm bootstrap
    ```

    The `pnpm bootstrap` command will:
    - Install all dependencies for the project
    - Seed the PostgreSQL database with initial data
    - Build both the frontend (Nuxt.js) and backend (NestJS)
    - Start the servers

## Usage

Once the project is set up and running, you can access the frontend and backend servers:

- Frontend (Nuxt.js): [http://localhost:3000](http://localhost:3000)
- Backend (NestJS): [http://localhost:3001](http://localhost:3001)
- GraphQL: [http://localhost:3001/graphql](http://localhost:3001/graphql)

## Scripts

Here are some useful scripts you can use during development:

- **Start the development servers:**

    ```sh
    pnpm start:dev
    ```

- **Build the project:**

    ```sh
    pnpm build
    ```

- **Seed the database:** 

    Populate the database with some `Travel` data
    ```sh
    pnpm seed
    ```

- **Clean all the project:**

    Remove any installed dependencies and distiributions files

    ```sh
    pnpm cleanall
    ```

- **Format the project:**

    ```sh
    // Runs the formatting check without modifying files.
    pnpm format

    // Applies file formatting corrections.
    pnpm format:fix
    ```

- **Lint the project:**

    ```sh
    // Runs linting without automatically fixing errors.
    pnpm lint

    // Runs linting and automatically fixes linting errors where possible.
    pnpm lint:fix
    ```

- **Lint and Format the project:**

    ```sh
    // Runs linting and formatting without automatically fixing errors.
    pnpm check

    // Runs linting and formatting and automatically fixes linting errors where possible and applies file formatting corrections.
    pnpm check:fix
    ```

## Environment Variables

Ensure you have the following environment variables set in your `.env` file in the `apps/backend` folder :

```sh
POSTGRES_HOST=postgresql_database_url
POSTGRES_PORT=postgresql_port
POSTGRES_USERNAME=postgresql_username
POSTGRES_PASSWORD=postgresql_password
POSTGRES_DATABASE=postgresql_database
```
If you do not provide a `.env` file or do not set these variables explicitly, the application will attempt to use the following default values:

```sh
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=weroad
```

# License
Distributed under the MIT License. See LICENSE for more information.
