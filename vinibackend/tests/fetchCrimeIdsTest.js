require('dotenv').config();

const { fetchCrimeIds } = require("../controllers/dataController");
async function fetchCrimeIdsTest() {
  try {
    
    const crimeIds = await fetchCrimeIds();
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchCrimeIdsTest();
