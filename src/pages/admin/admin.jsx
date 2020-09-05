import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Layout } from 'antd'

import memoryUtils from './../../utils/memoryUtils'

import LeftNav from '../../components/left-nav'
import Header from '../../components/header';
import './admin.less'

import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

const { Footer, Sider, Content } = Layout

export default class Admin extends Component {
  state = {
    user: {}
  }
  UNSAFE_componentWillMount () {
    this.getUser()
  }
  getUser = () => {
    const user = memoryUtils.user
    const { history } = this.props
    if (!user) return history.replace('/login')
    this.setState({ user })
  }
  render () {
    return (
      <Layout className="admin">
        <Sider width="250">
          <LeftNav />
        </Sider>
        <Layout>
          <Header />
          <Content className="content">
            <Switch>
              <Route path="/home" component={Home} />
              <Route path='/category' component={Category} />
              <Route path='/product' component={Product} />
              <Route path='/role' component={Role} />
              <Route path='/user' component={User} />
              <Route path='/charts/bar' component={Bar} />
              <Route path='/charts/line' component={Line} />
              <Route path='/charts/pie' component={Pie} />
              <Redirect to="/home" />
            </Switch>
          </Content>
          <Footer className="footer">
            推荐使用谷歌浏览器，可以获得更加页面操作体验
          </Footer>
        </Layout>
      </Layout>
    )
  }
}
