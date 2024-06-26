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
    url: '/user/token',
    method: 'delete'
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
    params: data
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
    url: '/user/' + data,
    method: 'delete'
  })
}

export function enable(data) {
  return request({
    url: '/user/' + data + '/enable',
    method: 'patch'
  })
}

export function disable(data) {
  return request({
    url: '/user/' + data + '/disable',
    method: 'patch'
  })
}

export function resetPassword(data) {
  return request({
    url: '/user/password/reset',
    method: 'patch',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function getRoleByUser(userId) {
  return request({
    url: `/user/${userId}/roleIds`,
    method: 'get'
  })
}

export function roleList() {
  return request({
    url: '/roles/list',
    method: 'get'
  })
}

export function updatePassword(data) {
  return request({
    url: '/user/password',
    method: 'patch',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}