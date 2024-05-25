const { app } = require("electron");
const createWindow = require("./mainWIndow");
const { openPathSelectDialog } = require("./addPath");

const onReady = () => {
  createWindow();
  openPathSelectDialog();
};

app.whenReady().then(onReady);
