require('dotenv').config({ path: '../.env'});
const fetch = require('node-fetch'); // For making API calls
const {client} = require("../client")

const apiKey = process.env.PGAPIKEY;




async function fetchUser(apiKey) {
  console.log(apiKey)
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


module.exports = {
  fetchUser,
  fetchCrimeIds,
  fetchMembers
};
