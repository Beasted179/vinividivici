const { updateTableData } = require('../scripts/update_table_data_script');

async function intervalFunction() {
  try {
    console.log('Interval triggered');
    
    const tableData = await updateTableData();
    console.log(tableData);
  } catch (error) {
    console.error('Error running updateTableData:', error);
  }
}

module.exports = {
  intervalFunction
};

