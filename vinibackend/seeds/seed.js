require('dotenv').config({ path: '../.env' });
const { client } = require("../client");
const { runCreateTableScript } = require('../scripts/run_create_table_script');
const { getSplicedData } = require("./seedData")

async function seedDatabase() {
  try {
    await client.connect();
    
    // Drop and recreate the "users" table
    await client.query('DROP TABLE IF EXISTS users');
    await runCreateTableScript();
    const seedData = await getSplicedData()
  
    // Insert seed data into the "users" table
    const insertQuery = 'INSERT INTO users ("rank", "memberId", "name", "status") VALUES ($1, $2, $3, $4)';
    for (const data of seedData) {
      console.log(data)
      await client.query(insertQuery, [data.rank, data.memberId, data.name, data.status]);
    }

    console.log('Seed data inserted successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.end();
  }
}

seedDatabase().finally(() => {
  console.log('Seed process finished.');
});



