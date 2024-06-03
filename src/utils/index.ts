const { ipcRenderer } = window.require('electron')

let pathCache = ''

export const getPath = () => {
  if (pathCache) return Promise.resolve(pathCache)
  return new Promise((resolve, reject) => {
    ipcRenderer.send('get-user-data-path')
    ipcRenderer.once('read-user-data-path', (e, res) => {
      pathCache = res
      resolve(res)
    })
  })
}
