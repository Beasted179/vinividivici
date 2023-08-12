
const {fetchCrimeIds, fetchMembers}= require("./dataController")

async function spliceDataController() {
    try {
      const membersArr = [];
      const seedDataArr = [];
      const crimeData = await fetchCrimeIds();
      const members = await fetchMembers();
  
      const crimeIds = crimeData.crimeexp;
      for (const memberId in members) {
        const member = members[memberId];
        membersArr.push({
          memberId: memberId,
          name: member.name,
          status: member.status.description,
        });
      }
  
      const reorderedMembersArr = [];
      for (const crimeId of crimeIds) {
        const matchingMember = membersArr.find(member => member.memberId === crimeId.toString());
        if (matchingMember) {
          reorderedMembersArr.push(matchingMember);
        }
      }
  
      const membersWithRank = reorderedMembersArr.map((member, index) => ({
        rank: index + 1, // Adding 1 to start with rank 1
        memberId: member.memberId,
        name: member.name,
        status: member.status,
      }));
  
      return membersWithRank;
    } catch (error) {
      console.error(error, "Could not create seedDataArr");
    }
  }
  



module.exports = {
  spliceDataController
};


