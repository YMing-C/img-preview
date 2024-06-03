import { useGetSelectedDirectory } from 'context'
import styles from './index.module.less'
import { useMemo } from 'react'
import { FloatButtons } from './components'
import { Form } from 'antd'

const Home: React.FC = () => {
  const [selectedDirectory] = useGetSelectedDirectory()
  const [form] = Form.useForm()
  const imgWith = Form.useWatch('imgWidth', form)
  const imgGap = Form.useWatch('imgGap', form)

  const urlList = useMemo(() => {
    return selectedDirectory?.list.map(c => `file://${c}`)
  }, [selectedDirectory?.list])

  return (
    <div className={styles.container}>
      {!!urlList?.length && (
        <div className={styles.imgBox} style={{ gap: `${imgGap}px` ?? 0 }}>
          {urlList?.map(c => (
            <img src={c} alt="" key={c} style={{ width: imgWith ?? 'auto' }} />
          ))}
        </div>
      )}
      {!selectedDirectory?.list?.length && <div className={styles.empty}>Hello img</div>}
      <FloatButtons form={form} />
    </div>
  )
}

export default Home
