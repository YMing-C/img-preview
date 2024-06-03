import React, { useState } from 'react'
import { FloatButton, Modal, Form, InputNumber } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import { FloatButtonsProps } from './interface'

const FloatButtons: React.FC<FloatButtonsProps> = ({ form }) => {
  const [open, setOpen] = useState<boolean>(false)

  const showModalHandler = () => {
    setOpen(true)
  }

  const closeModalHandler = () => {
    setOpen(false)
  }

  const okHandler = () => {
    closeModalHandler()
  }

  return (
    <>
      <FloatButton icon={<SettingOutlined />} onClick={showModalHandler} />
      <Modal
        width={650}
        title="设置"
        open={open}
        onCancel={closeModalHandler}
        cancelText="关闭"
        okButtonProps={{ style: { display: 'none' } }}>
        <Form form={form} layout="horizontal">
          <Form.Item label="图片宽度" name="imgWidth" initialValue={1200}>
            <InputNumber max={3000} min={500} controls={false} />
          </Form.Item>
          <Form.Item label="图片间隔" name="imgGap" initialValue={0}>
            <InputNumber max={40} min={0} controls={false} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default FloatButtons
