require('dotenv').config()

const { fetchMembers } = require("../controllers/dataController");

async function fetchMembersTest() {
  try {
    const members = await fetchMembers();
    console.log(members);
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchMembersTest();

