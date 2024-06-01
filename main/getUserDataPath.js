const { ipcMain, app } = require('electron')

const getPath = () => {
  const path = app.getPath('userData')

  ipcMain.on('get-user-data-path', event => {
    event.reply('read-user-data-path', path)
  })
}

module.exports = {
  getPath,
}
