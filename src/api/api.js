import request from './../utils/request'
import qs from 'qs'
import COMMON_GLOBAL from './../utils/common'

export function getAction (url, parameter) {
  return request({
    url: COMMON_GLOBAL.APIURL + url + '?' + qs.stringify(parameter),
    method: 'get',
  })
}

export function postAction (url, parameter) {
  return request({
    url: COMMON_GLOBAL.APIURL + url,
    method: 'post',
    data: qs.stringify(parameter),
  })
}

