import React, { Component } from 'react'
import { Card, Button, Icon, Table, Modal, message } from 'antd'

import AddUpdateForm from './add-update-form'
import LinkButton from '../../components/link-button'

import { getCategoryList, addCategory, editCategory } from '../../api/manage'
/**
 * 分类管理
 */


export default class Category extends Component {
  state = {
    categoryId: '',
    categoryName: '',
    cateList: [],
    isEdit: false,
    tableLoading: false,
    modalVisible: false
  }
  UNSAFE_componentWillMount () {
    this.initColumns()
    this.getCateList()
  }
  initColumns = () => {
    const { editCategory } = this
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name'
      },
      {
        title: '操作',
        width: 300,
        render: (data) => <LinkButton data-item={JSON.stringify(data)} onClick={editCategory}>修改分类</LinkButton>
      }
    ]
  }
  getCateList = async () => {
    this.setState({ tableLoading: true })
    const { status, data } = await getCategoryList()
    this.setState({ tableLoading: false })
    if (status === this.CONFIG.CODE_SUCCESS) {
      const cateList = [...data]
      this.setState({ cateList })
    }
  }
  handleOk = () => {
    this.form.validateFields(async (err, value) => {
      if (!err) {
        const { isEdit } = this.state
        const { categoryName } = value
        let methods = addCategory
        let params = {
          categoryName
        }
        let action = '新增'
        if (isEdit) {
          const { categoryId } = this.state
          params = {
            ...params,
            categoryId
          }
          methods = editCategory
          action = '修改'
        }
        const { status } = await methods(params)
        this.closeModel()
        if (status === this.CONFIG.CODE_SUCCESS) {
          message.success(action + '成功')
          this.getCateList()
        }
      }
    })
  }
  openModal = () => {
    this.setState({ modalVisible: true })
  }
  closeModel = () => {
    this.form.resetFields()
    this.setState({
      categoryId: '',
      categoryName: '',
      isEdit: false,
      modalVisible: false
    })
  }
  handleCancel = () => {
    this.closeModel()
  }
  addCategory = () => {
    this.setState({ modalVisible: true, isEdit: false })
  }
  editCategory = (e) => {
    const item = JSON.parse(e.target.getAttribute('data-item'))
    const categoryId = item._id
    const categoryName = item.name
    this.setState({ categoryName, categoryId, modalVisible: true, isEdit: true })
  }
  getCateName = (value) => {
    const categoryName = value
    this.setState({ categoryName })
  }
  render () {
    const { columns, addCategory, handleOk, handleCancel } = this
    const { cateList, tableLoading, isEdit, modalVisible, categoryName } = this.state
    const extra = (
      <Button type="primary" onClick={addCategory}>
        <Icon type="plus" />
        <span>添加</span>
      </Button>
    )
    return (
      <Card extra={extra}>
        <Table
          columns={columns}
          dataSource={cateList}
          loading={tableLoading}
          pagination={{ defaultPageSize: 10, showQuickJumper: true }}
          rowKey="_id"
          bordered
        />
        <Modal
          maskClosable={false}
          title={isEdit ? '修改分类' : '新增分类'}
          visible={modalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <AddUpdateForm categoryName={categoryName} setForm={(form) => { this.form = form }} />
        </Modal>
      </Card>
    )
  }
}
