const { client } = require('../client.js');
const createTableScript = require('./create_table_script');

async function runCreateTableScript() {
  try {
    console.log("Step 1: Checking if the 'users' table exists...");

    // Check if the table already exists
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'users'
      );
    `;

    const result = await client.query(checkTableQuery);

    // If the table doesn't exist, create it
    if (!result.rows[0].exists) {
      console.log("Step 2: Table doesn't exist. Creating the 'users' table...");
      await client.query(createTableScript);
      console.log("Table created successfully.");
    } else {
      console.log("Step 2: Table already exists.");
    }
  } catch (error) {
    console.error("Error creating or checking table:", error);
  }
}

runCreateTableScript();

module.exports = { 
  runCreateTableScript
}
