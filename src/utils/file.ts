import { getPath } from './index'
const fs = window.require('fs')

const defaultDirectory: any[] = []
export const writeDirectory = async (list: any[] = defaultDirectory) => {
  const directoryFile = (await getPath()) + '/directory.json'

  fs.writeFileSync(directoryFile, JSON.stringify(list))
}

export const readDirectory = async () => {
  const directoryFile = (await getPath()) + '/directory.json'
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
