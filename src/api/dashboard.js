import request from '@/utils/request'

export function getTodayCount() {
  return request({
    url: '/gpt/statistics/token/usage/today',
    method: 'get'
  })
}

export function getTotalUsage() {
  return request({
    url: '/gpt/statistics/token/usage/total',
    method: 'get'
  })
}

export function getChatCount() {
  return request({
    url: '/gpt/statistics/token/count/today',
    method: 'get'
  })
}
