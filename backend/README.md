# BankLedger

BankLedger is an Express and MongoDB API for user authentication, bank-account management, and ledger-based money transfers.

## Features

- User registration, login, and logout with JWT authentication
- Cookie- or Bearer-token protected account endpoints
- Account creation and balance calculation from immutable ledger entries
- Idempotent account-to-account transfers
- System-user endpoint for initial funding
- Registration and transaction email notifications through Gmail OAuth2

## Requirements

- Node.js
- MongoDB replica set (transactions use MongoDB sessions)
- Gmail OAuth2 credentials, if email notifications are enabled

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/bankledger
   JWT_SEC=replace-with-a-secure-secret

   EMAIL_USER=your-gmail-address
   CLIENT_ID=your-google-oauth-client-id
   CLIENT_SECRET=your-google-oauth-client-secret
   REFRESH_TOKEN=your-google-oauth-refresh-token
   ```

3. Start the server:

   ```bash
   node server.js
   ```

The API listens on `http://localhost:3000`.

## API endpoints

Authentication is required for all account and transaction routes. Send the JWT in the `token` cookie or in the `Authorization` header:

```http
Authorization: Bearer <token>
```

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a user. Body: `name`, `email`, `password` |
| POST | `/api/auth/login` | Log in. Body: `email`, `password` |
| POST | `/api/auth/logout` | Log out and blacklist the current token |
| POST | `/api/accounts` | Create an account for the authenticated user |
| GET | `/api/accounts` | List the authenticated user's accounts |
| GET | `/api/accounts/balance/:accountId` | Get an account balance |
| POST | `/api/transactions` | Transfer funds between accounts |
| POST | `/api/transactions/system/initial-funds` | Create an initial-funds transfer; requires a system user |

### Transfer request example

```json
{
  "fromAccount": "<source-account-id>",
  "toAccount": "<destination-account-id>",
  "amount": 500,
  "idempotencyKey": "unique-transfer-reference"
}
```

Each successful transfer creates matching immutable `DEBIT` and `CREDIT` ledger entries. Account balances are derived from those entries.

## Project structure

```text
server.js             Application entry point
src/app.js            Express configuration and route mounting
src/routes/           API route definitions
src/contollers/       Request handlers
src/models/           Mongoose models
src/middleware/       JWT authentication middleware
src/services/         Email notification service
src/db/               MongoDB connection setup
```
