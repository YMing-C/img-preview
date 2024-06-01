const { app } = window.require('electron').remote
const fs = window.require('fs')
const directoryFile = app.getPath('userData') + '/directory.json'

const defaultDirectory = []

export const writeDirectory = (config = defaultDirectory) => {
  fs.writeFileSync(directoryFile, JSON.stringify(config))
}

export const readDirectory = () => {
  if (!fs.existsSync(directoryFile)) {
    writeDirectory(defaultDirectory)
    return defaultDirectory
  }
  try {
    let directoryInfo = fs.readFileSync(directoryFile, 'utf8')
    directoryInfo = directoryInfo || '[]'
    directoryInfo = JSON.parse(directoryInfo)
    return directoryInfo
  } catch (err) {
    console.error('无法访问目录文件信息')
    return {}
  }
}
