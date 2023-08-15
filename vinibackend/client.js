const { Client } = require('pg');
require('dotenv').config({ path: './.env'});
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  
  database: process.env.PGDATABASE
  
}

);
module.exports = {
  client,
};
