const { getDatabase } = require('./db');

/**
 * Get all pokemon from the database
 */
function getAllPokemon() {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const query = 'SELECT * FROM pokemon ORDER BY number';
    
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * Get pokemon by their numbers
 * @param {Array<number>} numbers - Array of pokemon numbers
 */
function getPokemonByNumbers(numbers) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const placeholders = numbers.map(() => '?').join(',');
    const query = `SELECT * FROM pokemon WHERE number IN (${placeholders}) ORDER BY number`;
    
    db.all(query, numbers, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * Get a single pokemon by number
 * @param {number} number - Pokemon number
 */
function getPokemonByNumber(number) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const query = 'SELECT * FROM pokemon WHERE number = ?';
    
    db.get(query, [number], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

module.exports = {
  getAllPokemon,
  getPokemonByNumbers,
  getPokemonByNumber
};
