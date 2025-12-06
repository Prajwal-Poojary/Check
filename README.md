# Personal Finance Management Backend

This is a Node.js backend for a Personal Finance Management Application as per the assignment requirements.

## Technologies Used
- **Node.js**: Runtime environment
- **Express**: Web framework
- **MySQL**: Database
- **Sequelize**: ORM for database management
- **JWT**: For secure authentication
- **Bcrypt**: For password hashing

## Prerequisites
- Node.js (v14 or higher)
- MySQL Server

## Setup Instructions

1.  **Clone the repository** (if applicable) or download the source code.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment Variables**:
    - The `.env` file is included in the root directory.
    - Update the `DB_USER` and `DB_PASSWORD` in `.env` to match your local MySQL configuration.
    - Ensure a database named `finance_db` exists or let Sequelize create the tables (it won't create the database itself, only tables).
    - **Step to create database**:
      Open MySQL Workbench or CLI and run:
      ```sql
      CREATE DATABASE finance_db;
      ```

4.  **Run the Server**:
    - Development mode (uses nodemon):
      ```bash
      npm run dev
    ```
    - Production start:
      ```bash
      npm start
    ```
    - The server will run on `http://localhost:3000`.

## API Documentation
The API endpoints are tested using Postman. A Postman collection file (`postman_collection.json`) is included in this repository. You can import it into Postman to test the API.

### Endpoints Overview

#### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login and get Token

#### Wallets
- `POST /api/wallets`: Create a wallet
- `GET /api/wallets`: List all wallets
- `DELETE /api/wallets/:id`: Delete a wallet

#### Transactions
- `POST /api/transactions`: Add income/expense
- `GET /api/transactions`: List transactions (filters: walletId, startDate, endDate)
- `DELETE /api/transactions/:id`: Delete a transaction

#### Budgets
- `POST /api/budgets`: Set budget for a category
- `GET /api/budgets`: View budgets and status

#### Reports
- `GET /api/report`: Get monthly financial summary

## Database Schema
- **Users**: Stores user credentials.
- **Wallets**: Stores wallet names and current balance.
- **Transactions**: Stores income/expense records linked to wallets.
- **Budgets**: Stores monthly limits per category.
