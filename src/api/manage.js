import jsonp from 'jsonp'
import { getAction, postAction } from './api'
import { message } from 'antd'

const login = (params) => postAction('/login', params)

const getCategoryList = () => getAction('/manage/category/list')

const addCategory = (params) => postAction('/manage/category/add', params)

const editCategory = (params) => postAction('/manage/category/update', params)

const getProductList = (params) => getAction('/manage/product/list', params)

const getSearchProductList = (params) => getAction('/manage/product/search', params)

const updateProductStatus = (params) => postAction('/manage/product/updateStatus', params)

const getCategory = (params) => getAction('/manage/category/info', params)

const pictureUpload = (params) => postAction('/manage/img/upload', params)

const deletePicture = (params) => postAction('/manage/img/delete', params)

const addProduct = (params) => postAction('/manage/product/add', params)

const updateProduct = (params) => postAction('/manage/product/update', params)

const getRoleList = (params) => getAction('/manage/role/list', params)

const addRole = (params) => postAction('/manage/role/add', params)

const updateRole = (params) => postAction('/manage/role/update', params)

const getUserList = () => getAction('/manage/user/list')

const addUser = (params) => postAction('/manage/user/add', params)

const updateUser = (params) => postAction('/manage/user/update', params)

const deleteUser = (params) => postAction('/manage/user/delete', params)

const getProductById = (params) => getAction('/manage/product/info', params)

const getWeather = (city) => {
  return new Promise((resolve) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    jsonp(url, {}, (err, data) => {
      if (!err && data.error === 0) {
        const { dayPictureUrl, weather } = data.results[0].weather_data[0]
        resolve({ dayPictureUrl, weather })
      } else {
        message.error('获取天气信息失败')
      }
    })
  })
}

export {
  login,
  getCategoryList,
  addCategory,
  editCategory,
  getProductList,
  getSearchProductList,
  updateProductStatus,
  getCategory,
  pictureUpload,
  deletePicture,
  addProduct,
  updateProduct,
  getRoleList,
  addRole,
  updateRole,
  getUserList,
  addUser,
  updateUser,
  deleteUser,
  getProductById,
  getWeather
}