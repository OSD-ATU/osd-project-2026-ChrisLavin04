# Football Management System API

A REST API for managing football teams, players, matches, and users built with Express.js, TypeScript, and MongoDB.

## Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **MongoDB database** (either MongoDB Atlas cloud or local installation)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd football-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Fill in your MongoDB connection details:
   ```
   DB_CONN_STRING=your_mongodb_connection_string
   DB_NAME=FootballManagementSystem
   PORT=3000
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## Database Setup

### Option 1: MongoDB Atlas (Cloud - Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string from the Atlas dashboard
4. Add it to your `.env` file

### Option 2: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/`

## API Endpoints

- **Users**: `/api/users`
- **Players**: `/api/players`
- **Teams**: `/api/teams`
- **Matches**: `/api/matches`

## Testing

Run tests with:
```bash
npm test
```

## Technology Stack

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB Native Driver** - Database operations (not Mongoose)
- **Zod** - Schema validation
- **Jest** - Testing framework