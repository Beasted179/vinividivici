// Import the compareTables function and parseTableName function
const { compareTables, parseTableName } = require('../controllers/dataController');

// Simulate Express req and res objects for testing
const req = {
  query: {
    tableNames: 'users_20230816151141157,users_20230816154141157', // Provide the table names for testing
  },
};

const res = {
  json: (data) => {
    console.log('Response:', data);
  },
  status: (status) => {
    console.log('Status:', status);
    return {
      json: (data) => {
        console.log('Response:', data);
      },
    };
  },
};

// Call the compareTables function with test data
compareTables(req, res)
  .then((comparisonResult) => {
    console.log('Comparison result:');
    console.log(JSON.stringify(comparisonResult, null, 2));
    console.log('Comparison complete');
  })
  .catch((error) => {
    console.error('Error during comparison:', error);
  });

