# Node.js Project

This project is a Node.js application that includes a server, worker, and Hello World script. The application is configured to use TypeScript with `tsx` and `nodemon` for automatic reloading during development.

## Table of Contents

-   [Installation](#installation)
-   [Environment Variables](#environment-variables)
-   [Running the Application](#running-the-application)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/venkikgit/pt-emailservice.git
    cd yourproject
    ```

2. Install dependencies:

    ```bash
    nvm use
    npm install
    ```

3. Create a `.env` file in the root directory and add the required environment variables (see below).

## Environment Variables

The application requires the following environment variables:

-   `PORT`: The port on which the server will run.
-   `NODE_ENV`: The environment in which the application is running (e.g., `development`, `production`).
-   `SMTP_SERVICE`: The SMTP service used for sending emails.
-   `SMTP_USER`: The SMTP user for authentication.
-   `SMTP_PASS`: The SMTP password for authentication.
-   `REDIS_URL`: The URL for the Redis server.
-   `REDIS_PORT`: The port for the Redis server.
-   `aws_access_key_id`: AWS access key ID for SES.
-   `aws_secret_access_key`: AWS secret access key for SES.
-   `aws_ses_sender_email`: The sender email address for AWS SES.

Example `.env` file:

```env
PORT=3000
NODE_ENV=development
SMTP_SERVICE=Gmail
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
REDIS_URL=redis://localhost
REDIS_PORT=6379
aws_access_key_id=your-aws-access-key-id
aws_secret_access_key=your-aws-secret-access-key
aws_ses_sender_email=your-sender-email@example.com

```

## Running the Application

```
npx nodemon --exec tsx src/server.ts
npx nodemon --exec tsx worker.ts
npx nodemon --exec tsx helloWorld.ts

```
