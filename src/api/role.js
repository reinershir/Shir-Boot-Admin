import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function fetchList(data) {
  return request({
    url: '/roles/list',
    method: 'get',
    params: data
  })
}

export function create(data) {
  return request({
    url: '/roles',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function update(data) {
  return request({
    url: `/roles`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function deleteById(id) {
  return request({
    url: `/roles/${id}`,
    method: 'delete'
  })
}

export function getMenuList() {
  return request({
    url: '/menus/list',
    method: 'get'
  })
}

export function getRolePermissions(data) {
  return request({
    url: `/roles/${data}/rolePermissions`,
    method: 'get'
  })
}