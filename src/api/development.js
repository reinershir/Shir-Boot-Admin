import request from '@/utils/request'

export function getColumnsByTableName(tableName) {
  return request({
    url: `/development/codeGenerate/${tableName}/columns`,
    method: 'get'
  })
}
