const pokemonAccessor = require('../database/pokemonAccessor');

/**
 * Process request to get all pokemon
 */
async function processGetAllPokemon() {
  try {
    const pokemon = await pokemonAccessor.getAllPokemon();
    return {
      success: true,
      data: pokemon,
      count: pokemon.length
    };
  } catch (error) {
    throw new Error(`Failed to retrieve pokemon: ${error.message}`);
  }
}

/**
 * Process request to get pokemon by number(s)
 * @param {string} numbersParam - Comma-delimited string of pokemon numbers
 */
async function processGetPokemonByNumbers(numbersParam) {
  try {
    // Parse and validate numbers
    const numbers = numbersParam
      .split(',')
      .map(n => n.trim())
      .filter(n => n.length > 0)
      .map(n => parseInt(n, 10));
    
    // Check for invalid numbers
    const invalidNumbers = numbers.filter(n => isNaN(n) || n < 1);
    if (invalidNumbers.length > 0) {
      throw new Error('Invalid pokemon number(s). All numbers must be positive integers.');
    }
    
    if (numbers.length === 0) {
      throw new Error('No valid pokemon numbers provided');
    }
    
    // Fetch pokemon
    const pokemon = await pokemonAccessor.getPokemonByNumbers(numbers);
    
    // Check if all requested pokemon were found
    const foundNumbers = pokemon.map(p => p.number);
    const notFoundNumbers = numbers.filter(n => !foundNumbers.includes(n));
    
    return {
      success: true,
      data: pokemon,
      count: pokemon.length,
      requested: numbers.length,
      notFound: notFoundNumbers.length > 0 ? notFoundNumbers : undefined
    };
  } catch (error) {
    throw new Error(`Failed to retrieve pokemon: ${error.message}`);
  }
}

module.exports = {
  processGetAllPokemon,
  processGetPokemonByNumbers
};
