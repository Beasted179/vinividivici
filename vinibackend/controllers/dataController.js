require('dotenv').config({ path: '../.env'});
const fetch = require('node-fetch'); // For making API calls
const {client} = require("../client")

const apiKey = process.env.PGAPIKEY;




async function fetchUser(apiKey) {
  console.log(apiKey);
  try {
    const response = await fetch(`https://api.torn.com/user/?selections=&key=${apiKey}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    const data = await response.json();
    return data.name;
  } catch (error) {
    throw new Error('Error fetching data.');
  }
}


async function fetchCrimeIds() {
  try {
    const crimeUrl = "https://api.torn.com/faction/?selections=crimeexp&key=";
    console.log("Fetching crime data...");
    
    const response = await fetch(crimeUrl + apiKey);
    const data = await response.json();
   
    return data;
  } catch (error) {
    console.error('Error fetching crime data:', error);
    throw error;
  }
}
async function fetchMembers() {
  try {

    const members = "https://api.torn.com/faction/?selections=&key=";
    console.log("Fetching member data...");
    
    const response = await fetch(members + apiKey);
    const data = await response.json();
    
    return data.members;
  } catch (error) {
    console.error('Error fetching crime data:', error);
    throw error;
  }
}




// Modify the fetchTableData function
const fetchTableData = async () => {
  try {
    const query = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'`;

    const result = await client.query(query);

    const tableDataPromises = result.rows.map(async row => {
      const tableName = row.table_name;
      const tableDataQuery = `SELECT * FROM ${tableName}`;
      const tableDataResult = await client.query(tableDataQuery);
      return { tableName: tableName, data: tableDataResult.rows };
    });

    const tableData = await Promise.all(tableDataPromises);
    return tableData;
  } catch (error) {
    console.error('Error fetching table data:', error);
    throw error;
  }
};





module.exports = {
  fetchUser,
  fetchCrimeIds,
  fetchMembers,
  fetchTableData
};
