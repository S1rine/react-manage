import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Layout } from 'antd'
import { connect } from 'react-redux'

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

class Admin extends Component {
  getUser = () => {
    const user = this.props.user
    const { history } = this.props
    if (!user._id) return history.replace('/login')
  }
  render () {
    this.getUser()
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

export default connect(
  state => ({ user: state.user }),
  {}
)(Admin)