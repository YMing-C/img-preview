const conf = {
  appId: 'com.ym.img.preview.client.release',
  productName: '图片查看器',
  files: ['main/**', 'build/**/*', 'package.json'],
  copyright: 'Copyright ©2024 ym',
  directories: {
    output: 'build_electron',
  },
  extends: null,
  win: {
    // 提权
    // requestedExecutionLevel: 'requireAdministrator',
    // icon: 'main/static/icon.ico',
    // eslint-disable-next-line
    artifactName: '${productName}_${version}.${ext}',
  },
  mac: {
    // icon: 'main/static/icon.ico',
  },
  linux: {
    // icon: 'main/static/icon.ico',
  },
  nsis: {
    // 一键安装
    oneClick: false,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: '',
  },
  publish: [
    {
      provider: 'generic',
      url: '',
    },
  ],
}

module.exports = conf
