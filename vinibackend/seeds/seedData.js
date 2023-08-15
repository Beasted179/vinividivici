const { spliceDataController } = require("../controllers/spliceDataController");

async function getSplicedData() {
  try {
    // Fetch or generate data using the spliceDataController
    const seedData = await spliceDataController();
    return seedData;
  } catch (error) {
    console.error("Error fetching spliced data:", error);
    throw error; // Re-throw the error to be caught by the caller
  }
}

module.exports = {
  getSplicedData,
};


  