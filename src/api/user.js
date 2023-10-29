import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/token',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getMenus(token) {
  return request({
    url: '/user/menus',
    method: 'get',
    params: { token }
  })
}

export function fetchList(data) {
  return request({
    url: '/user/list',
    method: 'get',
    data
  })
}

export function create(data) {
  return request({
    url: '/user',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function update(data) {
  return request({
    url: '/user',
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function deleteById(data) {
  return request({
    url: '/user/'+data,
    method: 'delete'
  })
}
