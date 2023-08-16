const fetch = require('node-fetch'); // Import the fetch library

const baseUrl = 'https://api.torn.com/user/?selections=basic&key=';

const validateApiKey = async apiKey => {
  console.log(apiKey, "hello")
  try {
    const response = await fetch(baseUrl + apiKey);
    const userData = await response.json();
    if (userData && userData.name) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
};

module.exports = {
  validateApiKey,
};

  