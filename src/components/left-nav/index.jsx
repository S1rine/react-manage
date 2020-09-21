import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';

import { setHeaderTitle } from '../../redux/actions';

import { Menu, Icon } from 'antd'

import menuList from '../../config/menuConfig'
import logo from '../../assets/img/logo.png'
import './index.less'

const { SubMenu, Item } = Menu

class LeftNav extends Component {
  UNSAFE_componentWillMount () {
    this.getActiveKey()
    this.menuNodes = this.getMenuNodes(menuList)
  }
  getActiveKey = () => {
    const { pathname } = this.props.location
    this.activeKey = pathname
    if (pathname.indexOf('/product') === 0) {
      this.activeKey = '/product'
    }
  }
  getMenuNodes = (list) => {
    const path = this.props.location.pathname
    return list.reduce((pre, item) => {
      if (this.hasAuth(item)) {
        if (item.children) {
          const { activeKey } = this
          const isOpen = item.children.find(v => activeKey.indexOf(v.key) === 0)
          if (isOpen) {
            this.openKey = item.key
          }
          pre.push((
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              }
            >
              {
                this.getMenuNodes(item.children)
              }
            </SubMenu>
          ))
        } else {
          if (item.key === path || path.indexOf(item.key) === 0) {
            this.props.setHeaderTitle(item.title)
          }
          pre.push((
            <Item key={item.key}>
              <Link to={item.key} onClick={() => { this.props.setHeaderTitle(item.title) }}>
                <Icon type={item.icon}></Icon>
                <span>{item.title}</span>
              </Link>
            </Item>
          ))
        }
      }
      return pre
    }, [])
  }
  hasAuth = (item) => {
    const user = this.props.user
    if (!user._id) return false
    const menus = user.role.menus
    if (user.username === 'admin' || item.public || menus.indexOf(item.key) !== -1) {
      return true
    } else if (item.children) {
      return item.children.find(v => menus.indexOf(v.key) !== -1)
    }
    return false
  }
  render () {
    this.getActiveKey()
    const { openKey, menuNodes, activeKey } = this
    return (
      <div className="left_nav">
        <Link className="left_nav__link" to="/home">
          <img src={logo} alt="logo" />
          <h2>后台管理</h2>
        </Link>
        <Menu
          selectedKeys={[activeKey]}
          defaultOpenKeys={[openKey]}
          theme="dark"
          mode="inline"
        >
          {menuNodes}
        </Menu>
      </div>
    )
  }
}

export default connect(
  state => ({ user: state.user }),
  { setHeaderTitle }
)(withRouter(LeftNav))