# WordQuest

WordQuest is an English vocabulary learning app with a React frontend and a Node.js/Express backend.

## Project Structure

- `frontend/` React application
- `server/` Express API and MongoDB integration

## Main Features

- Word Archive practice by CEFR level
- Collocations page with filtering
- Testing page with random words and level-based scoring
- Email/password login and registration
- Optional Google OAuth login

## Requirements

- Node.js 18 or newer
- npm
- MongoDB database

## Setup

### 1) Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Start backend:

```bash
npm start
```

Backend runs on `http://localhost:5000`.

### 2) Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

Start frontend:

```bash
npm start
```

Frontend runs on `http://localhost:3000`.

## Frontend Routes

- `/` Home
- `/WordArch` Word Archive
- `/collocations` Collocations
- `/Testing` Testing
- `/Login` Login
- `/Registration` Registration

## Backend Endpoints

- `GET /` API health check
- `POST /api/register`
- `POST /api/login`
- `GET /api/userInfo`
- `GET /api/words`
- `POST /api/words`
- `POST /api/auth/google`

## Scripts

Frontend (`frontend/package.json`):
- `npm start`
- `npm run build`
- `npm test`

Backend (`server/package.json`):
- `npm start`

## Notes

- If `REACT_APP_GOOGLE_CLIENT_ID` is missing, the Google login button is disabled.
- If you change environment variables, restart the corresponding dev server.
