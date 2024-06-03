import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.less'
import App from './app'
import reportWebVitals from './reportWebVitals'
import { getPath } from 'utils'
const { shell } = window.require('electron')

// // 挂载调试工具到 window
window.whereIsApp = async () => {
  const path = await getPath()

  shell.openPath(path)
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
