require('dotenv').config()

const { updateTableData } = require("../scripts/update_table_data_script");


async function updateTableDataTest() {
  try {
    const updatedTableArr = await updateTableData();
    console.log(updatedTableArr)
  } catch (error) {
    console.error("Error:", error);
  }
}

updateTableDataTest()