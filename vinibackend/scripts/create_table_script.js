const createTableScript = `
CREATE TABLE users (
  id serial primary key,
  rank integer,
  "memberId" varchar(255) not null,
  name varchar(255),
  status varchar(255)
);

`;

module.exports = createTableScript;