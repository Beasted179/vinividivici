const { Client } = require('pg');
require('dotenv').config({ path: './.env'});

console.log(process.env)
const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

module.exports = {
  client,
};
