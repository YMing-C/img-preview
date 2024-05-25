const { ipcMain, dialog } = require("electron");

const openPathSelectDialog = () => {
  ipcMain.on("open-directory-select-dialog", async (event) => {
    try {
      // todo 这个地方怎么选择只有图片的文件夹
      const res = await dialog.showOpenDialog({
        properties: ["openDirectory"],
      });

      const path = res.filePaths[0];
      if (path) {
        console.log(1);
        event.reply("selected-directory", {
          path: path,
        });
      }
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = {
  openPathSelectDialog,
};
