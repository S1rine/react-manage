import React, { PureComponent } from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'

import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/contants'
import AddForm from './add-form'
import AuthForm from './auth-form'
import { formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import { addRole, updateRole, getRoleList } from '../../api/manage'

/*
角色路由
 */
export default class Role extends PureComponent {
  authRef = React.createRef()
  state = {
    roleList: [], // 所有角色的列表
    isShowAdd: false, // 是否显示添加界面
    isShowAuth: false, // 是否显示设置权限界面
  }
  /* 
  初始化table列数组
  */
  initColumn = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        // render: create_time => formateDate(create_time)
        render: formateDate
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formateDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      },
      {
        title: '操作',
        render: (role) => <LinkButton onClick={() => this.showAuth(role)}>设置权限</LinkButton>
      },
    ]
  }
  /* 
  显示权限设置界面
  */
  showAuth = (role) => {
    // 将当前需要设置的角色保存到组件对象上
    this.role = role
    this.setState({
      isShowAuth: true
    })
  }
  /* 
  异步获取角色列表显示
  */
  getRoleList = async () => {
    const { status, data } = await getRoleList()
    if (status === this.CONFIG.CODE_SUCCESS) {
      const roleList = [...data]
      this.setState({
        roleList
      })
    }
  }
  /*
  添加角色
   */
  addRole = () => {
    // 进行表单验证, 只能通过了才向下处理
    this.form.validateFields(async (error, values) => {
      if (!error) {
        // 隐藏确认框
        this.setState({
          isShowAdd: false
        })
        const { roleName } = values
        let params = {
          roleName
        }
        const { status, data } = await addRole(params)
        if (status === this.CONFIG.CODE_SUCCESS) {
          message.success('添加角色成功')
          const role = data
          this.setState(state => ({
            roleList: [...state.roleList, role]
          }))
        }
      }
    })
  }
  /*
  给角色授权
   */
  updateRole = async () => {
    // 隐藏确认框
    this.setState({
      isShowAuth: false
    })

    const { role } = this
    // 更新role对象相关属性
    role.menus = this.authRef.current.getMenus()
    role.auth_time = Date.now()
    role.auth_name = memoryUtils.user.username
    // 请求更新角色
    const { status } = await updateRole(role)
    if (status === this.CONFIG.CODE_SUCCESS) {
      message.success('角色授权成功')
      this.getRoleList()
    }
  }

  UNSAFE_componentWillMount () {
    this.initColumn()
    this.getRoleList()
  }
  render () {
    const { roleList, isShowAdd, isShowAuth } = this.state
    const role = this.role || {}

    const title = (
      <Button type='primary' onClick={() => this.setState({ isShowAdd: true })}>
        创建角色
      </Button>
    )

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={roleList}
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE }}
        />

        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({ isShowAdd: false })
            this.form.resetFields()
          }}
        >
          <AddForm
            setForm={(form) => this.form = form}
          />
        </Modal>

        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({ isShowAuth: false })
          }}
        >
          <AuthForm ref={this.authRef} role={role} />
        </Modal>
      </Card>
    )
  }
}
