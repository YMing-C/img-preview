const concurrently = require("concurrently");

const argv = process.argv.filter((item, index) => index > 1);

concurrently([
  `wait-on tcp:127.0.0.1:3000 && npm run start:main`,
  `npm run start:web ${argv.join(" ")}`,
]);
