import { useGetSelectedDirectory } from 'context'
import styles from './index.module.less'
import { useMemo } from 'react'

const Home: React.FC = () => {
  const [selectedDirectory] = useGetSelectedDirectory()

  const urlList = useMemo(() => {
    return selectedDirectory?.list.map(c => `file://${c}`)
  }, [selectedDirectory?.list])

  return (
    <div className={styles.container}>
      {!!urlList?.length && (
        <div className={styles.imgBox}>
          {urlList?.map(c => (
            <img src={c} alt="" key={c} />
          ))}
        </div>
      )}
      {!selectedDirectory?.list?.length && <div className={styles.empty}>Hello img</div>}
    </div>
  )
}

export default Home
