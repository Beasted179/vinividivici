require('dotenv').config({ path: '../.env'});
const fetch = require('node-fetch'); // For making API calls
const {client} = require("../client")

const apiKey = process.env.PGAPIKEY;




async function fetchUser(apiKey) {
  try {
    const response = await fetch(`https://api.torn.com/user/?selections=&key=${apiKey}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Invalid API key');
      }
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.name) {
      throw new Error('Empty or unexpected response data');
    }

    return data.name;
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
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

      const sortedData = tableDataResult.rows.sort((a, b) => a.rank - b.rank); // Sort by rank
      return { tableName: tableName, data: sortedData };
    });

    const tableData = await Promise.all(tableDataPromises);
    return tableData;
  } catch (error) {
    console.error('Error fetching table data:', error);
    throw error;
  }
};

const compareTables = async (req, res) => {
  const tableNames = req.params.tableNames.split(',');

  try {
    await client.connect();

    const comparisonData = [];

    for (const tableName of tableNames) {
      const query = `SELECT * FROM ${tableName};`;
      const result = await client.query(query);

      if (result.rows.length === 0) {
        throw new Error(`Table '${tableName}' not found`);
      }

      comparisonData.push({
        tableName: tableName,
        data: result.rows,
      });
    }

    // Perform comparison logic here and add differences to comparisonData objects
    // For demonstration purposes, let's add a 'differences' field with a sample message
    for (const data of comparisonData) {
      data.differences = `Differences for ${data.tableName}`;
    }

    res.json(comparisonData);
  } catch (error) {
    console.error('Error comparing tables:', error);
    res.status(500).json({ error: 'An error occurred while comparing tables' });
  } finally {
    await client.end();
  }
};





module.exports = {
  fetchUser,
  fetchCrimeIds,
  fetchMembers,
  fetchTableData,
  compareTables
};
