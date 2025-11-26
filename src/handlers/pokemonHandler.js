const pokemonProcessor = require('../processors/pokemonProcessor');

/**
 * Handle GET /pokemon - Get all pokemon
 */
async function handleGetAllPokemon(req, res) {
  try {
    const result = await pokemonProcessor.processGetAllPokemon();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in handleGetAllPokemon:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Handle GET /pokemon/:numbers - Get pokemon by number(s)
 */
async function handleGetPokemonByNumbers(req, res) {
  try {
    const numbersParam = req.params.numbers;
    
    if (!numbersParam) {
      return res.status(400).json({
        success: false,
        error: 'Pokemon number(s) required'
      });
    }
    
    const result = await pokemonProcessor.processGetPokemonByNumbers(numbersParam);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in handleGetPokemonByNumbers:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = {
  handleGetAllPokemon,
  handleGetPokemonByNumbers
};
