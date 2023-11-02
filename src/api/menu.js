import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/menus/list',
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/menus',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function update(data) {
  return request({
    url: `/menus`,
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function deleteById(id) {
  return request({
    url: `/menus/${id}`,
    method: 'delete'
  })
}

export function moveMenu(data) {
  return request({
    url: `/menus/position`,
    method: 'patch',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}
