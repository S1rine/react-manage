const DAMAINCONFIG = require('../config/index')

export default {
  PLAT_NAME: DAMAINCONFIG.PLAT_NAME,
  APIURL: process.env.NODE_ENV === 'development' ? '/api' : DAMAINCONFIG.BASE_API,
  CONFIG: {
    CODE_SUCCESS: 0, //成功
    CODE_USER_CONFLICT: '',
    CODE_VERIFY: ''
  }
}