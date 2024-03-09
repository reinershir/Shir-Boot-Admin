import request from '@/utils/request'

export function ask(data) {
  return request({
    url: '/gpt/chat?question=' + data,
    method: 'get'
  })
}

export function getModelList() {
  return request({
    url: '/gpt/models',
    method: 'get'
  })
}

export function deleteModel(data) {
  return request({
    url: '/gpt/models/fineTuning?model=' + data,
    method: 'delete'
  })
}

export function getFineTunings() {
  return request({
    url: '/gpt/models/fineTunings',
    method: 'get'
  })
}

export function getFineTuneFiles() {
  return request({
    url: '/gpt/models/files',
    method: 'get'
  })
}

export function getFileContent(data) {
  return request({
    url: '/gpt/models/files/' + data + '/content',
    method: 'get'
  })
}

export function deleteFile(data) {
  return request({
    url: '/gpt/models/file?fileId=' + data,
    method: 'delete'
  })
}

export function createFineTuneJob(data) {
  return request({
    url: '/gpt/models/fineTuning?fileId=' + data,
    method: 'post'
  })
}

export function connect() {
  return request({
    url: '/gpt/chat/connect',
    method: 'get',
    timeout: 0,
    responseType: 'stream'
  })
}

export function chat(data) {
  return request({
    url: '/gpt/chat',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}