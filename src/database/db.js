const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../pokemon.db');

let db = null;

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log('Connected to SQLite database');
        createTables()
          .then(() => resolve(db))
          .catch(reject);
      }
    });
  });
}

function createTables() {
  return new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS pokemon (
        number INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        hp INTEGER,
        attack INTEGER,
        defense INTEGER,
        description TEXT
      )
    `, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log('Pokemon table created or already exists');
        resolve();
      }
    });
  });
}

function seedDatabase() {
  return new Promise((resolve, reject) => {
    const checkQuery = 'SELECT COUNT(*) as count FROM pokemon';
    
    db.get(checkQuery, [], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (row.count > 0) {
        console.log('Database already seeded');
        resolve();
        return;
      }
      
      const samplePokemon = [
        { number: 1, name: 'Bulbasaur', type: 'Grass/Poison', hp: 45, attack: 49, defense: 49, description: 'A strange seed was planted on its back at birth.' },
        { number: 2, name: 'Ivysaur', type: 'Grass/Poison', hp: 60, attack: 62, defense: 63, description: 'When the bulb on its back grows large, it appears to lose the ability to stand on its hind legs.' },
        { number: 3, name: 'Venusaur', type: 'Grass/Poison', hp: 80, attack: 82, defense: 83, description: 'Its plant blooms when it is absorbing solar energy.' },
        { number: 4, name: 'Charmander', type: 'Fire', hp: 39, attack: 52, defense: 43, description: 'Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.' },
        { number: 5, name: 'Charmeleon', type: 'Fire', hp: 58, attack: 64, defense: 58, description: 'When it swings its burning tail, it elevates the temperature to unbearably high levels.' },
        { number: 6, name: 'Charizard', type: 'Fire/Flying', hp: 78, attack: 84, defense: 78, description: 'Spits fire that is hot enough to melt boulders.' },
        { number: 7, name: 'Squirtle', type: 'Water', hp: 44, attack: 48, defense: 65, description: 'After birth, its back swells and hardens into a shell.' },
        { number: 8, name: 'Wartortle', type: 'Water', hp: 59, attack: 63, defense: 80, description: 'Often hides in water to stalk unwary prey.' },
        { number: 9, name: 'Blastoise', type: 'Water', hp: 79, attack: 83, defense: 100, description: 'A brutal Pokemon with pressurized water jets on its shell.' },
        { number: 25, name: 'Pikachu', type: 'Electric', hp: 35, attack: 55, defense: 40, description: 'When several of these Pokemon gather, their electricity could build and cause lightning storms.' }
      ];
      
      const insertQuery = 'INSERT INTO pokemon (number, name, type, hp, attack, defense, description) VALUES (?, ?, ?, ?, ?, ?, ?)';
      
      const insertPromises = samplePokemon.map((pokemon) => {
        return new Promise((resolveInsert, rejectInsert) => {
          db.run(insertQuery, [pokemon.number, pokemon.name, pokemon.type, pokemon.hp, pokemon.attack, pokemon.defense, pokemon.description], (err) => {
            if (err) {
              rejectInsert(err);
            } else {
              resolveInsert();
            }
          });
        });
      });
      
      Promise.all(insertPromises)
        .then(() => {
          console.log('Database seeded with sample Pokemon');
          resolve();
        })
        .catch(reject);
    });
  });
}

function getDatabase() {
  return db;
}

function closeDatabase() {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database connection closed');
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

module.exports = {
  initializeDatabase,
  seedDatabase,
  getDatabase,
  closeDatabase
};
