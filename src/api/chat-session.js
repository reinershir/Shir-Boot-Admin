import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/chatSession',
    method: 'get',
    params: data
  })
}

export function create(data) {
  return request({
    url: '/chatSession',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function update(data) {
  return request({
    url: '/chatSession',
    method: 'put',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}

export function deleteById(data) {
  return request({
    url: '/chatSession/' + data,
    method: 'delete'
  })
}
