/**
 * 图标生成脚本
 *
 * 从 SVG 源文件生成多尺寸 ICO（Windows）和 PNG（通用/Linux）。
 * ICO 包含 16/32/48/64/128/256 六种尺寸，确保在不同缩放比例下清晰显示。
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const svgPath = resolve(__dirname, '..', 'build', 'icon.svg')
const svgBuffer = readFileSync(svgPath)

const sizes = [16, 32, 48, 64, 128, 256]

/** 生成各尺寸 PNG buffer */
async function generatePNGs() {
  return Promise.all(
    sizes.map((size) =>
      sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toBuffer()
        .then((data) => ({ size, data }))
    )
  )
}

/** 将多个 PNG 打包为多分辨率 ICO 文件 */
function packICO(pngs) {
  // 文件头：2字节保留 + 2字节类型(1=ICO) + 2字节图片数量
  const count = pngs.length
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)   // reserved
  header.writeUInt16LE(1, 2)   // type: ICO
  header.writeUInt16LE(count, 4) // image count

  // 每个条目标头 16 字节
  const entrySize = 16
  const dataOffset = 6 + count * entrySize
  const entries = Buffer.alloc(count * entrySize)

  const imageBuffers = []
  let offset = dataOffset

  pngs.forEach(({ size, data }, i) => {
    const entry = entries.subarray(i * entrySize, (i + 1) * entrySize)
    // 尺寸：256 记为 0
    entry.writeUInt8(size === 256 ? 0 : size, 0)  // width
    entry.writeUInt8(size === 256 ? 0 : size, 1)  // height
    entry.writeUInt8(0, 2)   // color palette (0 = no palette, PNG)
    entry.writeUInt8(0, 3)   // reserved
    entry.writeUInt16LE(1, 4)   // color planes
    entry.writeUInt16LE(32, 6)  // bits per pixel
    entry.writeUInt32LE(data.length, 8)  // image size
    entry.writeUInt32LE(offset, 12)      // image offset

    imageBuffers.push(data)
    offset += data.length
  })

  return Buffer.concat([header, entries, ...imageBuffers])
}

async function main() {
  console.log('生成各尺寸 PNG...')
  const pngs = await generatePNGs()
  console.log(`已生成 ${pngs.length} 种尺寸`)

  // 写入多分辨率 ICO
  const icoBuffer = packICO(pngs)
  const icoPath = resolve(__dirname, '..', 'build', 'icon.ico')
  writeFileSync(icoPath, icoBuffer)
  console.log(`已写入 ${icoPath} (${icoBuffer.length} bytes)`)

  // 写入 512x512 PNG（用于安装程序等）
  const png512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer()
  const pngPath = resolve(__dirname, '..', 'build', 'icon.png')
  writeFileSync(pngPath, png512)
  console.log(`已写入 ${pngPath} (${png512.length} bytes)`)

  console.log('图标生成完成')
}

main().catch((err) => {
  console.error('生成失败:', err)
  process.exit(1)
})
