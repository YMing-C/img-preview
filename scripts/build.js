const path = require('path')
const fs = require('fs')
const shell = require('shelljs')
var argv = require('argh').argv
const versionConfig = require('../config/version.js')
const packageJSON = require('../package.json')

const argvArr = process.argv.filter((item, index) => index > 1)
const packageJSONFilePath = path.resolve(process.cwd(), './package.json')
const configFilePath = path.resolve(process.cwd(), `./config/builder.js`)
const { version, name } = versionConfig
const writePackageJSON = data => {
  fs.writeFileSync(packageJSONFilePath, JSON.stringify({ ...packageJSON, ...{ build: { ...data } } }, null, 2))
}

console.log('-------------------------------')
console.log('packageJSONFilePath:', packageJSONFilePath)
console.log('configFilePath:', configFilePath)
console.log('version:', version)
console.log('name:', name)
console.log('argvArr:', argvArr)
console.log('-------------------------------')

// 更新 package.json 中的 name 和 version
// writePackageJSON({ version, productName: name })

const mainBuildEnv = Object.keys(argv)
  .map(key => `${key}=${argv[key]}`)
  .join(' ')

const res = shell.exec(`react-app-rewired build ${argvArr.join(' ')}`)
if (res.code !== 0) process.exit(res.code)

const mainRes = shell.exec(`cross-env NODE_ENV=production ${mainBuildEnv} electron-builder --config ${configFilePath}`)
if (mainRes.code !== 0) process.exit(mainRes.code)

// 还原 package.json
writePackageJSON({})
