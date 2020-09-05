import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

import { Component } from 'react'
import COMMON_GLOBAL from './utils/common'

Object.keys(COMMON_GLOBAL).forEach((key) => {
  Component.prototype[key] = COMMON_GLOBAL[key]
})

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
