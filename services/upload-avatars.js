const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp"); // allows to change images (crop, resize etc.)
const createFolderIfDontExist = require("../helpers/createDir");

class Upload {
  constructor(PUBLIC_DIR, AVATARS_OF_USERS) {
    this.PUBLIC_DIR = PUBLIC_DIR;
    this.AVATARS_OF_USERS = AVATARS_OF_USERS;
  }

  async transformAvatar(pathFile) {
    const file = await Jimp.read(pathFile);

    await file
      .autocrop()
      .cover(
        250, // width
        250, // height
        Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(pathFile);
  }

  async saveAvatarToStatic({ userId, pathFile, name, oldFile }) {
    await this.transformAvatar(pathFile);

    const folderUserAvatar = path.join(
      this.PUBLIC_DIR,
      this.AVATARS_OF_USERS,
      userId
    );

    await createFolderIfDontExist(folderUserAvatar); // creates a folder for each user if it doesn't exist
    await fs.rename(pathFile, path.join(folderUserAvatar, name));

    await this.deleteOldAvatar(
      path.join(process.cwd(), path.join(this.PUBLIC_DIR), oldFile)
    );

    const avatarUrl = path.normalize(
      path.join(this.AVATARS_OF_USERS, userId, name)
    );

    return avatarUrl;
  }

  async deleteOldAvatar(pathFile) {
    try {
      await fs.unlink(pathFile);
    } catch (error) {
      console.error(error.message);
    }
  }
}

module.exports = Upload;
