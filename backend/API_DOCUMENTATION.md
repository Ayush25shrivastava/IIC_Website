# 📚 Backend API Documentation

Base URL: `http://localhost:5000`

## 🔐 Authentication
**Base Path:** `/auth`

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/google` | Initiates Google OAuth login flow | No |
| `GET` | `/google/callback` | Callback URL for Google OAuth | No |

---

## 📅 Events
**Base Path:** `/api/events`

### Get All Events
**`GET /`**
- **Query Parameters:**
  - `category`: Filter by category (e.g., `Technical`)
  - `eventType`: Filter by type (`Solo`, `Team`)
  - `search`: Search by name or description
- **Auth:** No

### Get Event Details
**`GET /:id`**
- **Description:** Get full details of a specific event.
- **Auth:** No

### Get Event Participants
**`GET /:id/participants`**
- **Description:** Get a list of all participants and teams for an event.
- **Auth:** No

### Register for Event (Individual)
**`POST /:id/register`**
- **Description:** Register the currently logged-in user for a *Solo* event.
- **Auth:** **Yes** (Bearer Token)
- **Body:** None

---

## 👥 Teams
**Base Path:** `/api/teams`

### Create Team
**`POST /`**
- **Description:** Create a new team for a *Team* event.
- **Auth:** **Yes** (Bearer Token)
- **Body:**
  ```json
  {
    "eventId": "event_id_here",
    "teamName": "My Awesome Team",
    "leader": {
      "collegeRegNo": "REG123" // Optional if 'studentId' is set in user profile
    },
    "members": [
      {
        "name": "Member Name",
        "email": "member@email.com",
        "collegeRegNo": "REG456"
      }
    ]
  }
  ```

### Get Team Details
**`GET /:id`**
- **Description:** Get details of a specific team by ID.
- **Auth:** No

### Update Team
**`PUT /:id`**
- **Description:** Update team name or members (Leader only).
- **Auth:** No (Verified via body data)
- **Body:**
  ```json
  {
    "teamName": "New Name",
    "leaderEmail": "leader@email.com", 
    "leaderRegNo": "REG123",
    "members": [...] 
  }
  ```

### Delete Team
**`DELETE /:id`**
- **Description:** Delete a team (Leader only).
- **Auth:** No (Verified via body data)
- **Body:**
  ```json
  {
    "leaderEmail": "leader@email.com",
    "leaderRegNo": "REG123"
  }
  ```

### Get My Teams
**`POST /my-teams`**
- **Description:** Get all teams a user belongs to (as leader or member).
- **Auth:** No
- **Body:**
  ```json
  {
    "email": "user@email.com",
    "collegeRegNo": "REG123"
  }
  ```

---

## 👤 Users
**Base Path:** `/api/users`

### Get Profile
**`GET /profile`**
- **Description:** Get current user's profile.
- **Auth:** **Yes** (Bearer Token)

### Update Profile
**`PUT /profile`**
- **Description:** Update profile fields (college, phone, etc.).
- **Auth:** **Yes** (Bearer Token)
- **Body:**
  ```json
  {
    "collegeName": "IIT Delhi",
    "phone": "9876543210",
    "branch": "CSE"
  }
  ```

### Get User Registrations
**`GET /registrations`**
- **Description:** Get all events the user has registered for individually.
- **Auth:** **Yes** (Bearer Token)

### Get User Teams
**`GET /teams`**
- **Description:** Get all teams the user is part of.
- **Auth:** **Yes** (Bearer Token)

---

# 🚀 Getting Started

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas URL)

## Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration
Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
```

## Database Seeding
To populate the database with initial events (True Detective theme):
```bash
npm run seed:events
```

## Running the Server
```bash
npm start
```
The server will start on `http://localhost:5000`.

## Testing & Utilities
- **Run Automated Tests:**
  ```bash
  npm test
  ```
  Validates registration logic and uniqueness constraints.

- **List All Teams:**
  ```bash
  node scripts/listTeams.js
  ```
  Prints a formatted list of all registered teams and members directly from the database.

  node scripts/listEventParticipants.js "Event Name"
  
