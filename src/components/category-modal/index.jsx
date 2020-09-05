import React, { Component } from 'react'
import { Modal, Input } from 'antd'

export default class CategoryModal extends Component {
  state = {
    title: '',
    id: '',
    name: '',
    modalVisible: false,
    confirmLoading: false,
    value: ''
  }
  UNSAFE_componentWillMount () {
    console.log('will mount')
  }
  init = () => {
    const { type, id, name } = this.props
    let title = ''
    if (type === 0) {
      // 新增分类
      title = '新增分类'
    } else {
      // 修改分类
      title = '修改分类'
    }
    this.setState({
      title,
      id,
      name
    })
  }
  handleOk = () => { }
  handleCancel = () => { }
  render () {
    console.log('render')
    // this.init()
    const { type, id, name } = this.props
    let title = ''
    if (type === 0) {
      // 新增分类
      title = '新增分类'
    } else {
      // 修改分类
      title = '修改分类'
    }
    this.setState({
      title,
      id,
      name
    })
    const { handleOk, handleCancel } = this
    const { modalVisible } = this.props
    const { value, confirmLoading } = this.state
    return (
      <Modal
        title={title}
        visible={modalVisible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Input value={value} placeholder="请输入分类名" />
      </Modal>
    )
  }
}
