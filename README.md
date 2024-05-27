# img-preview

本地图片查看器

目前还比较粗糙，有很多地方需要优化

## TODO

- [x] 本地图片下拉加载预览
- [ ] 支持历史记录，将添加过的目录放入侧边栏
- [ ] 支持每个文件夹中查看的图片单独制定排序规则
- [ ] 将 BrowserWindow 修改为 preload 脚本形式
- [x] 引入 electron-builder 进行打包

## 问题记录

1. 安装 ts 后报错

   While resolving: react-scripts@5.0.1
   npm ERR! Found: typescript@5.4.5

   解决方案：将 TS 退回 5.0.3
