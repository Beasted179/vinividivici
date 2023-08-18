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
const parseTableName = (tableName) => {
  if (tableName && tableName.length > 6) {
    const datePart = tableName.split('_')[1];
    const year = datePart.slice(0, 4);
    const month = datePart.slice(4, 6);
    const day = datePart.slice(6, 8);
    const hour = datePart.slice(8, 10);
    const minute = datePart.slice(10, 12);

    return {
      day,
      month,
      year,
      hour,
      minute,
    };
  }
  return null;
};
const compareTables = async (req, res) => {
  const tableNames = req.query.tableNames.split(',');

  try {
    const comparisonData = [];

    for (const tableName of tableNames) {
      const query = `SELECT * FROM ${tableName} ORDER BY rank;`;
      const result = await client.query(query);

      if (result.rows.length === 0) {
        throw new Error(`Table '${tableName}' not found`);
      }

      const tableInfo = parseTableName(tableName); // Extract year, month, and day from the table name
      if (tableInfo) {
        comparisonData.push({
          tableName: tableName,
          data: result.rows,
          creationTime: `${tableInfo.year}-${tableInfo.month}-${tableInfo.day} `,
        });
      } else {
        // Handle parsing error if needed
      }
    }

    const comparisonResult = [];
    comparisonData.sort((a, b) => {
      return a.creationTime.localeCompare(b.creationTime);
    });
    for (let i = 1; i < comparisonData.length; i++) {
      const currentTable = comparisonData[i];
      const previousTable = comparisonData[i - 1];

      const tableComparison = {
        tableName: currentTable.tableName,
        creationTime: currentTable.creationTime,
        comparison: [],
      };

      if (currentTable.data.length === previousTable.data.length) {
        tableComparison.comparison.push({
          note: `No rank changes between ${currentTable.tableName} and the previous table.`,
        });
      } else {
        for (let j = 0; j < currentTable.data.length; j++) {
          const currentRow = currentTable.data[j];
          const previousRow = previousTable.data.find(row => row.memberId === currentRow.memberId);

          if (previousRow) {
            const rankChange = currentRow.rank - previousRow.rank;
            let note = '';

            if (rankChange > 0) {
              note = `${currentRow.name} moved up by ${rankChange} ranks`;
            } else if (rankChange < 0) {
              note = `${currentRow.name} moved down by ${Math.abs(rankChange)} ranks`;
            }

            if (note) {
              tableComparison.comparison.push({
                name: currentRow.name,
                rankChange: rankChange,
                note: note,
              });
            }
          }
        }
      }

      comparisonResult.push(tableComparison);
    }

    console.log(comparisonResult, 'comparing');
    return comparisonResult
  } catch (error) {
    console.error('Error comparing tables:', error);
    res.status(500).json({ error: 'An error occurred while comparing tables' });
  }
};




module.exports = {
  fetchUser,
  fetchCrimeIds,
  fetchMembers,
  fetchTableData,
  compareTables,
  parseTableName
};
