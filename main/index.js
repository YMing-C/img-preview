const { app } = require("electron");
const createWindow = require("./mainWIndow");

const onReady = () => {
  createWindow();
};

app.whenReady().then(onReady);
