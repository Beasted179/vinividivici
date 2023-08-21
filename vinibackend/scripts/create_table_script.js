const timestamp = getCurrentTimestamp(); // Assuming you have a function to generate the timestamp

    const tableName = `users_${timestamp}`; // Generate table name with timestamp

    const createTableScript = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id serial primary key,
        rank integer,
        "memberId" varchar(255) not null,
        name varchar(255),
        status varchar(255)
      );
    `;
    function getCurrentTimestamp() {
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      return `${year}${month}${day}${hours}${minutes}${seconds}`;
    }
    

module.exports = createTableScript;