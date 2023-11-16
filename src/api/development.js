import request from '@/utils/request'

export function getColumnsByTableName(tableName) {
  return request({
    url: `/development/codeGenerate/${tableName}/columns`,
    method: 'get'
  })
}

export function generateAndDownload(data) {
  return request({
    url: `/development/codeGenerate/codes`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    responseType: 'blob',
    data: data
  })
}
