const express = require('express');
const bodyParser = require('body-parser');
const { initializeDatabase, seedDatabase, closeDatabase } = require('./src/database/db');
const { authenticateToken } = require('./src/middleware/jwtUtils');
const pokemonHandler = require('./src/handlers/pokemonHandler');
const authHandler = require('./src/handlers/authHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Pokemon Server API',
    version: '1.0.0',
    endpoints: {
      auth: 'POST /auth/token - Generate JWT token',
      pokemon: {
        all: 'GET /pokemon - Get all pokemon (requires JWT)',
        byNumbers: 'GET /pokemon/:numbers - Get pokemon by number(s) (requires JWT)'
      }
    }
  });
});

// Authentication routes (public - no JWT required)
app.post('/auth/token', authHandler.handleGenerateToken);

// Pokemon routes (protected - JWT required)
app.get('/pokemon', authenticateToken, pokemonHandler.handleGetAllPokemon);
app.get('/pokemon/:numbers', authenticateToken, pokemonHandler.handleGetPokemonByNumbers);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Initialize and start server
async function startServer() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    
    console.log('Seeding database...');
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`\n======================================`);
      console.log(`Pokemon Server running on port ${PORT}`);
      console.log(`======================================`);
      console.log(`\nAPI Endpoints:`);
      console.log(`  POST http://localhost:${PORT}/auth/token - Generate JWT token`);
      console.log(`  GET  http://localhost:${PORT}/pokemon - Get all pokemon`);
      console.log(`  GET  http://localhost:${PORT}/pokemon/:numbers - Get pokemon by number(s)`);
      console.log(`\nNote: Pokemon endpoints require JWT authentication`);
      console.log(`======================================\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down server...');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down server...');
  await closeDatabase();
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;
