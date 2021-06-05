const path = require("path");
const app = require("../app");
const db = require("../model/db");
const createFolderIfDontExist = require("../helpers/createDir");

require("dotenv").config();

const PORT = process.env.PORT || 3000;

const UPLOAD_DIR = process.env.UPLOAD_DIR;
const PUBLIC_DIR = process.env.PUBLIC_DIR;
const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;

db.then(() => {
  app.listen(PORT, async () => {
    await createFolderIfDontExist(UPLOAD_DIR);
    await createFolderIfDontExist(PUBLIC_DIR);
    await createFolderIfDontExist(path.join(PUBLIC_DIR, AVATARS_OF_USERS));

    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch((err) => {
  console.log(`Server not run. Error: ${err.message}`);
  process.exit(1);
});
