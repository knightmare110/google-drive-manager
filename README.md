
# Knightmare Google Drive Integration

This project provides a full-stack solution for integrating with Google Drive, featuring a **React-based frontend** and an **Express-based backend**. It includes support for uploading, downloading, deleting files, and viewing file history. The project also utilizes **Yarn Workspaces** to manage dependencies for both the frontend and backend efficiently.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Running the Project](#running-the-project)
   - [Run both frontend and backend](#run-both-frontend-and-backend)
   - [Run backend only](#run-backend-only)
   - [Run frontend only](#run-frontend-only)
5. [Testing](#testing)
6. [Environment Variables](#environment-variables)
7. [Technologies Used](#technologies-used)
8. [Author](#author)

## Project Structure

The project is organized as follows:

```
knightmare-google-drive-integration/
│
├── backend/               # Backend service with Express
│   └── package.json
│
├── frontend/              # Frontend React application
│   └── package.json
│
├── node_modules/
├── package.json           # Root package.json with workspaces and dependencies
```

## Prerequisites

- **Node.js** (version 14.x or higher)
- **Yarn** (version 1.22.x or higher)
- **Google Cloud Credentials** (for Google Drive API integration)
- **AWS DynamoDB Credentials** (for history tracking)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/knightmare-google-drive-integration.git
```

2. Navigate into the project directory:

```bash
cd knightmare-google-drive-integration
```

3. Install dependencies for both frontend and backend using **Yarn Workspaces**:

```bash
yarn install
```

## Running the Project

### Run both frontend and backend

To run both the frontend and backend simultaneously, use the following command:

```bash
yarn start
```

This will run:
- Frontend at `http://localhost:3000`
- Backend at `http://localhost:5000`

### Run backend only

To run only the backend, use the following command:

```bash
yarn server
```

This will run the backend on `http://localhost:5000`.

### Run frontend only

To run only the frontend, use the following command:

```bash
yarn client
```

This will run the frontend on `http://localhost:3000`.

## Testing

This project uses **Jest** and **Testing Library** for testing both the backend and frontend.

To run tests for both frontend and backend, use:

```bash
yarn test
```

- To run backend tests only:

```bash
yarn workspace backend test
```

- To run frontend tests only:

```bash
yarn workspace frontend test
```

## Environment Variables

Create a `.env` file in the root of the `backend` directory with the following environment variables:

```bash
# Google API credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# AWS DynamoDB credentials
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=your-aws-region
AWS_DYNAMO_DB_TABLE_NAME=your-dynamodb-table-name

# JWT Secret for authentication
JWT_SECRET=your-jwt-secret
```

Make sure to replace the placeholders with your actual credentials.

## Technologies Used

- **Frontend:**
  - React
  - React Router
  - Tailwind CSS
  - Testing Library (React)

- **Backend:**
  - Express.js
  - Google Drive API
  - AWS DynamoDB
  - JWT (JSON Web Token) for authentication
  - Multer for file uploads
  - Supertest (for testing backend routes)
  
- **Testing:**
  - Jest
  - Testing Library (React and DOM)
  - AWS SDK Mock

## Author

- **Knightmare110**
- [knightmare.protagonist@gmail.com](mailto:knightmare.protagonist@gmail.com)

Feel free to reach out with any questions or contributions!
