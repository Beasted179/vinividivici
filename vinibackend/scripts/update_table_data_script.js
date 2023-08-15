require('dotenv').config({ path: '../.env' });
const { client } = require("../client");

const  {getSplicedData}  = require("../seeds/seedData");

const updateTableData = async () => {
  try {
    // Fetch the existing data from the "users" table
    const existingData = await client.query('SELECT * FROM users');

    // Generate a timestamp to use in the backup table name
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '');

    // Create the backup table name with the timestamp
    const backupTableName = `users_${timestamp}`;

    // Create the backup table with the same schema as the original table
    await client.query(`CREATE TABLE ${backupTableName} AS TABLE users`);

    const maxBackupTables = 10;
    const backupTables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_name LIKE 'users_%'
      ORDER BY table_name
    `);
   

    if (backupTables.rows.length > maxBackupTables) {
      const tablesToDelete = backupTables.rows.slice(0, backupTables.rows.length - maxBackupTables);
      for (const tableToDelete of tablesToDelete) {
        const tableName = tableToDelete.table_name;
        await client.query(`DROP TABLE ${tableName}`);
        console.log('Deleted backup table:', tableName);
      }
    }

    // Fetch the new data using the getSplicedData function
    const newData = await getSplicedData();

    const membersToUpdate = [];

    // Find members to update the status field
    for (const newDataEntry of newData) {
      const existingEntry = existingData.rows.find(existingDataEntry => existingDataEntry.memberId === newDataEntry.memberId);

      if (existingEntry && existingEntry.status !== newDataEntry.status) {
        membersToUpdate.push(newDataEntry);
      }
    }

    // Update existing members' status
    const updateQuery = 'UPDATE users SET "status" = $1 WHERE "memberId" = $2';
    for (const newDataEntry of membersToUpdate) {
      await client.query(updateQuery, [newDataEntry.status, newDataEntry.memberId]);
    }

    // Fetch the updated data after the updates
    const updatedData = await client.query('SELECT * FROM users ORDER BY "rank"');
    
    let currentRank = 1;
    for (const updatedDataEntry of updatedData.rows) {
      await client.query('UPDATE users SET "rank" = $1 WHERE "memberId" = $2', [currentRank, updatedDataEntry.memberId]);
      currentRank++;
    }

    console.log('Table updated successfully.');
    return { success: true, message: 'Table updated successfully.' };
  } catch (error) {
    console.error('Error updating table:', error);
    return { success: false, message: 'Error updating table.' };
  }
};
 
module.exports = {
  updateTableData
};







