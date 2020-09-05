import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal, message } from 'antd'

import LinkButton from '../link-button'

import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
import { removeUser } from '../../utils/storageUtils'
import { formateDate } from '../../utils/dateUtils'

import { getWeather } from '../../api/manage'

import './index.less'

const { confirm } = Modal

class Header extends Component {
  state = {
    currentTime: formateDate(Date.now()),
    dayPicureUrl: '',
    weather: ''
  }
  UNSAFE_componentWillMount () {
    this.getUser()
    this.getWeather()
    this.timeId = setInterval(() => {
      this.setState({
        currentTime: formateDate(Date.now())
      })
    }, 1000)
  }
  componentWillUnmount () {
    clearInterval(this.timeId)
  }
  getUser = () => {
    const user = memoryUtils.user
    if (user) {
      this.user = user.username
    }
  }
  getWeather = async () => {
    const { dayPictureUrl, weather } = await getWeather('杭州')
    this.setState({ dayPictureUrl, weather })
  }
  getTitle = () => {
    let title = ''
    let path = this.props.location.pathname
    menuList.forEach(item => {
      if (item.key === path) {
        title = item.title
      } else if (item.children) {
        const cItem = item.children.find(v => path.indexOf(v.key) === 0)
        if (cItem) title = cItem.title
      }
    })
    return title
  }
  logout = () => {
    confirm({
      title: '确定要退出吗？',
      maskClosable: false,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        return new Promise((resolve) => {
          const { history } = this.props
          removeUser()
          memoryUtils.user = null
          setTimeout(() => {
            resolve()
            history.replace('/login')
          }, 1000)
        })
      },
      onCancel: () => {
        message.info('取消退出')
      }
    })
  }
  render () {
    const { user, logout } = this
    const { currentTime, dayPictureUrl, weather } = this.state
    const title = this.getTitle()
    return (
      <div className="header">
        <div className="header_top">
          <span className="welcome">欢迎，{user}</span>
          <LinkButton onClick={logout}>
            退出
        </LinkButton>
        </div>
        <div className="header_bottom">
          <div className="header_bottom__left">{title}</div>
          <div className="header_bottom__right">
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt="weather" />
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)