# Spec: 单页阅读模式

## 概述

在现有竖向滚动模式基础上，新增"单页模式"。单页模式下，视口内一次只显示一张图片，用户通过鼠标滚轮或键盘方向键切换页面。

## 动机

- 竖向连续滚动适合快速浏览，但部分用户希望逐页精读
- 单页模式排除周围页面的视觉干扰，专注当前页
- 鼠标滚轮切换是漫画阅读器的标配交互

## 功能规格

### F1: 阅读模式切换

- 阅读器工具栏新增"单页"/"滚动"切换按钮
- 点击按钮在两种模式之间切换
- 模式切换时保持当前页码不变
- 模式偏好持久化到 `ReaderSettings`，重启后保留

### F2: 单页显示

- 单页模式下，视口一次只显示一张图片
- 图片在视口内居中（水平和垂直）
- 图片按 `object-fit: contain` 适配视口，保持原始宽高比
- 隐藏滚动条

### F3: 鼠标滚轮翻页

- 向下滚动滚轮 → 下一页
- 向上滚动滚轮 → 上一页
- 连续快速滚轮不会跳页（rAF 防抖，一次滚动只翻一页）
- 到达第一页/最后一页时，滚轮不再触发翻页

### F4: 方向键翻页

- 右箭头 → 下一页
- 左箭头 → 上一页
- 方向键在两种阅读模式下均生效
- 到达边界时无操作

### F5: 其他功能兼容

- 缩放选项在单页模式下隐藏或以不同方式生效（暂定：单页模式始终 `contain` 适配，缩放设置保留但在切回滚动模式时才生效）
- 背景色切换正常工作
- 全屏切换正常工作
- 阅读进度自动保存正常工作
- 首页/末页快捷键（Home/End）正常工作
- Esc 返回/F 全屏/加减号缩放等快捷键继续工作

## 数据模型变更

```typescript
// 新增
type ReadingMode = 'scroll' | 'single'

// ReaderSettings 新增字段
type ReaderSettings = {
  background: ReaderBackground
  zoomMode: ZoomMode
  zoomValue: number
  readingMode: ReadingMode  // 新增，默认 'scroll'
}
```

## 涉及的 UI 组件

### 工具栏变更

```
[返回] [标题 + 页码]           [缩放] [背景] [单页/滚动] [全屏]
```

新增一个按钮，文字在"单页"和"滚动"之间切换：
- 当前为滚动模式 → 显示"单页"
- 当前为单页模式 → 显示"滚动"

## 技术方案

### 滚轮处理

- 在 `.reader-viewport` 上注册 `wheel` 事件监听（`passive: false`）
- `event.preventDefault()` 阻止默认滚动行为
- 使用 `ticking` 标志 + `requestAnimationFrame` 防抖
- 通过 `scrollIntoView({ behavior: 'smooth', block: 'start' })` 导航到目标页

### 单页布局

- 通过 CSS class `.single-mode` 控制单页样式
- `.page-frame` 高度设为 `100%`（占满视口）
- 图片使用 `object-fit: contain` + `max-width/max-height: 100%`
- `scroll-snap-type: y mandatory` 作为辅助（在用户手动拖拽时捕捉到正确位置）

### 迁移兼容

`settings:get-reader` IPC handler 中，对旧数据展开默认值，确保 `readingMode` 字段存在：

```typescript
return {
  background: 'dark',
  zoomMode: 'fit-width',
  zoomValue: 1,
  readingMode: 'scroll',
  ...stored
}
```

## 验收标准

- [ ] 工具栏有"单页"/"滚动"切换按钮
- [ ] 切换到单页模式后，视口只显示一张图片，居中适配
- [ ] 鼠标滚轮向下 → 翻到下一页，向上 → 翻到上一页
- [ ] 快速连续滚轮不会跳页
- [ ] 左/右方向键在两种模式下都能翻页
- [ ] 阅读进度在单页模式下正确保存
- [ ] 重启应用后，阅读模式偏好保留
- [ ] 旧用户升级后默认使用滚动模式，不会报错
- [ ] 背景色切换、全屏、Home/End 快捷键在单页模式下正常工作
- [ ] 单页模式下缩放按钮可操作但视觉效果以降级方式处理（保留值，切回滚动模式后生效）

## 不改动

- 不新增依赖
- 不修改 preload（类型变更自动透传）
- 不修改 electron.d.ts（类型变更自动透传）
- 不改变现有滚动模式的任何行为
