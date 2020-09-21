import { login } from '../api/manage'
import COMMON_GLOBAL from '../utils/common'
import { saveUser, removeUser } from '../utils/storageUtils'
import { SET_HEADER_TITLE, RECEIVE_USRE, SHOW_ERROR, LOGOUT } from './action-types'

export const setHeaderTitle = (headerTitle) => ({
  type: SET_HEADER_TITLE,
  data: headerTitle
})

export const receiveUser = (user) => ({
  type: RECEIVE_USRE,
  data: user
})

export const showError = (errMsg) => ({
  type: SHOW_ERROR,
  data: errMsg
})

export const logout = () => {
  removeUser()
  return {
    type: LOGOUT
  }
}

export function loginAction (params) {
  return async dispatch => {
    const { status, data, msg } = await login(params)
    if (status === COMMON_GLOBAL.CONFIG.CODE_SUCCESS) {
      const user = { ...data }
      saveUser(user)
      dispatch(receiveUser(user))
    } else {
      dispatch(showError(msg))
    }
  }
}