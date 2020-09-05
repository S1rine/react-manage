import axios from 'axios'
import { message } from 'antd'
import GLOBAL from './../utils/common'

const request = axios.create({
  timeout: 5000
})

request.interceptors.response.use(
  (response) => {
    if (response) {
      if (
        response.data.status !== GLOBAL.CONFIG.CODE_SUCCESS
      ) {
        message.error(response.data.msg)
      }
      if (response.data.code === GLOBAL.CONFIG.CODE_USER_CONFLICT) {
        window.location.href = '/login'
        window.location.reload()
      }
      return response.data
    } else {
      return message.error('网络错误，请稍后再试！')
    }
  },
  (error) => {
    console.log('err' + error)
    return Promise.reject(error)
  }
)

export default request