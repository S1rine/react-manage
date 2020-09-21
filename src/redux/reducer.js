import { combineReducers } from 'redux'
import { getUser } from '../utils/storageUtils'
import { SET_HEADER_TITLE, RECEIVE_USRE, SHOW_ERROR, LOGOUT } from './action-types'

const initialTItle = '首页'

const headerTitle = (state = initialTItle, { type, data }) => {
  switch (type) {
    case SET_HEADER_TITLE:
      return data
    default:
      return state
  }
}

const initUser = getUser()

const user = (state = initUser, { type, data }) => {
  switch (type) {
    case RECEIVE_USRE:
      return data
    case SHOW_ERROR:
      return { ...state, errMsg: data }
    case LOGOUT:
      return {}
    default:
      return state
  }
}

export default combineReducers({
  headerTitle,
  user
})