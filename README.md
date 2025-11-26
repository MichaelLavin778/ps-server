# Pokemon Server (ps-server)

A Node.js RESTful API server for managing Pokemon data with JWT authentication and SQLite database.

## Features

- **RESTful API** with Express.js
- **JWT Authentication** for secure endpoints
- **SQLite Database** for Pokemon data storage
- **Organized Architecture**: handlers, processors, and database accessors
- **Two Main Endpoints**:
  - Get all Pokemon
  - Get Pokemon by number(s) with comma-delimited support

## Project Structure

```
ps-server/
├── src/
│   ├── database/
│   │   ├── db.js                  # Database initialization and management
│   │   └── pokemonAccessor.js     # Database access layer
│   ├── processors/
│   │   └── pokemonProcessor.js    # Business logic layer
│   ├── handlers/
│   │   ├── pokemonHandler.js      # Route handlers for Pokemon endpoints
│   │   └── authHandler.js         # Route handler for authentication
│   └── middleware/
│       └── jwtUtils.js             # JWT token generation and validation
├── server.js                       # Main server file
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/MichaelLavin778/ps-server.git
cd ps-server
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will start on port 3000 (or the port specified in the PORT environment variable).

## API Endpoints

### 1. Generate JWT Token (Public)

**POST** `/auth/token`

Generate a JWT token for authentication. In this demo, any username will generate a valid token.

**Request Body:**
```json
{
  "username": "ash"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

### 2. Get All Pokemon (Protected)

**GET** `/pokemon`

Retrieve all Pokemon from the database.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "number": 1,
      "name": "Bulbasaur",
      "type": "Grass/Poison",
      "hp": 45,
      "attack": 49,
      "defense": 49,
      "description": "A strange seed was planted on its back at birth."
    },
    ...
  ],
  "count": 10
}
```

### 3. Get Pokemon by Number(s) (Protected)

**GET** `/pokemon/:numbers`

Retrieve specific Pokemon by their number(s). Supports comma-delimited list for multiple Pokemon.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Examples:**
- Single Pokemon: `/pokemon/1`
- Multiple Pokemon: `/pokemon/1,4,7`
- Multiple Pokemon with spaces: `/pokemon/1, 4, 7`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "number": 1,
      "name": "Bulbasaur",
      "type": "Grass/Poison",
      "hp": 45,
      "attack": 49,
      "defense": 49,
      "description": "A strange seed was planted on its back at birth."
    }
  ],
  "count": 1,
  "requested": 1
}
```

If some Pokemon are not found:
```json
{
  "success": true,
  "data": [...],
  "count": 2,
  "requested": 3,
  "notFound": [999]
}
```

## Usage Examples

### Using cURL

1. **Generate a token:**
```bash
curl -X POST http://localhost:3000/auth/token \
  -H "Content-Type: application/json" \
  -d '{"username":"ash"}'
```

2. **Get all Pokemon:**
```bash
curl -X GET http://localhost:3000/pokemon \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

3. **Get specific Pokemon:**
```bash
# Single Pokemon
curl -X GET http://localhost:3000/pokemon/25 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Multiple Pokemon
curl -X GET http://localhost:3000/pokemon/1,4,7,25 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using JavaScript (fetch)

```javascript
// Generate token
const tokenResponse = await fetch('http://localhost:3000/auth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'ash' })
});
const { token } = await tokenResponse.json();

// Get all Pokemon
const allPokemon = await fetch('http://localhost:3000/pokemon', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const pokemonData = await allPokemon.json();

// Get specific Pokemon
const specificPokemon = await fetch('http://localhost:3000/pokemon/1,4,7', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const specificData = await specificPokemon.json();
```

## Database

The server uses SQLite and automatically:
- Creates the database file (`pokemon.db`) on first run
- Creates the `pokemon` table with the schema
- Seeds the database with 10 sample Pokemon (Kanto starters + Pikachu)

### Pokemon Schema

```sql
CREATE TABLE pokemon (
  number INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  hp INTEGER,
  attack INTEGER,
  defense INTEGER,
  description TEXT
)
```

## Architecture

The server follows a three-layer architecture:

1. **Handlers** (`src/handlers/`): Handle HTTP requests/responses and route logic
2. **Processors** (`src/processors/`): Contain business logic and data validation
3. **Database Accessors** (`src/database/`): Handle all database operations

Additionally:
- **Middleware** (`src/middleware/`): JWT authentication and other middleware functions

## Security

- JWT tokens expire after 24 hours
- Protected endpoints require valid JWT token in Authorization header
- JWT secret should be set via `JWT_SECRET` environment variable in production
- In production, implement proper user authentication instead of the demo token generation

## Environment Variables

- `PORT`: Server port (default: 3000)
- `JWT_SECRET`: Secret key for JWT signing (default: demo key for development)

## Sample Pokemon Data

The database is seeded with 10 Pokemon:
1. Bulbasaur (#1)
2. Ivysaur (#2)
3. Venusaur (#3)
4. Charmander (#4)
5. Charmeleon (#5)
6. Charizard (#6)
7. Squirtle (#7)
8. Wartortle (#8)
9. Blastoise (#9)
10. Pikachu (#25)

## License

ISC