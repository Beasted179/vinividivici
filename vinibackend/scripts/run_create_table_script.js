// run_create_table_script.js
const {client} = require("../client.js")


const createTableScript = require('./create_table_script');

async function runCreateTableScript() {

  try {
    await client.query(createTableScript);
    console.log('Table created successfully.');
  } catch (error) {
    console.error('Error creating table:', error);
  }
}
module.exports = {
    runCreateTableScript
}

