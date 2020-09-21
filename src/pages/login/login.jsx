import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Form, Icon, Input, Button, message } from 'antd'
import { connect } from 'react-redux'

import { loginAction } from '../../redux/actions'
import logo from '../../assets/img/logo.png'
import './login.less'

import memoryUtils from './../../utils/memoryUtils'
import { saveUser } from './../../utils/storageUtils'
import { login } from './../../api/manage'

const Item = Form.Item

class Login extends Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, value) => {
      if (!err) {
        this.props.loginAction(value)
        // this.login(value)
      } else {
        console.log('验证失败')
      }
    })
  }
  login = async ({ username, password }) => {
    let params = {
      username,
      password
    }
    const { history } = this.props
    const { status, data } = await login(params)
    if (status === this.CONFIG.CODE_SUCCESS) {
      saveUser(data)
      memoryUtils.user = data
      message.success('登录成功')
      history.push('/')
    }
  }
  validatorPwd = (rule, value, callback) => {
    value = value.trim()
    if (!value) {
      callback('密码必须输入')
    } else if (value.length < 4) {
      callback('密码必须大于等于4位字符')
    } else if (value.length > 12) {
      callback('密码必须小于等于12位字符')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('用户名必须是英文、数字或下划线')
    } else {
      callback()
    }
  }
  render () {
    const user = this.props.user
    if (user._id) return <Redirect to="/" />
    const { handleSubmit, validatorPwd } = this
    const { getFieldDecorator } = this.props.form
    const { errMsg } = this.props.user
    return (
      <div className="login">
        <div className="login_header">
          <img src={logo} alt="logo" />
          <h2>React后台管理</h2>
        </div>
        <div className="login_content">
          {errMsg ? <div className="err_msg">{errMsg}</div> : null}
          <h2>用户登录</h2>
          <Form onSubmit={handleSubmit} className="login-form">
            <Item>
              {getFieldDecorator('username', {
                initialValue: '',
                rules: [
                  { required: true, whitespace: true, message: '请输入用户名' },
                  { min: 4, message: '用户名不能小于4个字符' },
                  { max: 12, message: '用户名不能大于12个字符' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线' }
                ]
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />
              )}
            </Item>
            <Item>
              {getFieldDecorator('password', {
                initialValue: '',
                rules: [
                  { validator: validatorPwd }
                ]
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
                />
              )}
            </Item>
            <Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Item>
          </Form>
        </div>
      </div>
    )
  }
}

const WrapperLogin = Form.create()(Login)

export default connect(
  state => ({ user: state.user }),
  { loginAction }
)(WrapperLogin)