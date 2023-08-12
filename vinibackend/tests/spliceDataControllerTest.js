require('dotenv').config()

const { spliceDataController } = require("../controllers/spliceDataController");
const seedData = require('../seeds/seedData');

async function spliceDataControllerTest() {
  try {
    const seedDataArrTest = await spliceDataController();
    console.log(seedDataArrTest);
  } catch (error) {
    console.error("Error:", error);
  }
}

spliceDataControllerTest()