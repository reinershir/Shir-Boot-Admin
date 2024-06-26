/*
 * @Author: LaurenBerrys && 949154547@qq.com
 * @Date: 2024-04-20 21:25:18
 * @LastEditTime: 2024-04-22 14:20:11
 * @Description:
 */
import { EventSourcePolyfill } from 'event-source-polyfill'
import { getToken } from '@/utils/auth'
import store from '@/store'
class SSE {
    sse = undefined
    constructor() {
      //this.connect()
    }
    connect() {
      this.sse = new EventSourcePolyfill(
        process.env.VUE_APP_BASE_API + 'gpt/chat/connect',
        {
          headers: {
            'Access-Token': store.state.user.token,
            "Content-Type": "text/event-stream;charset=UTF-8",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
          timeout: 0,
          heartbeatTimeout: 10 * 60 * 1000,
        }
      )
    }
    open(callback) {
      if (this.sse === undefined) {
        this.connect()
      }
      this.sse.addEventListener('open', (event) => {
        callback(event)
      })
    }
    // 我要实现message函数，他会监听this.sse.addEventListener("message", (event) => { })我想在使用这个message函数的时候，message(event=>{})这里event就是监听到的数据
    message(callback) {
      this.sse.addEventListener('message', (event) => {
        const response = JSON.parse(event.data)
        callback(response)
        if(response === "[DONE]"){
          this.sse.close()
          this.sse = undefined
        }
      })
    }
    error(callback) {
      this.sse.addEventListener('error', (event) => {
        callback(event)
        this.sse.close()
        this.sse = undefined
      })
    }
    close(callback) {
      this.sse.addEventListener('close', (event) => {
        callback(event)
        this.sse.close()
        this.sse = undefined
      })
    }
}
export default new SSE()
