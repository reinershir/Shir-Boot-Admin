<template>
  <div>
    <div style="width:75%;height:550px;border: 1px solid black;border-radius: 15px;float:left;">
      <div ref="markdownIt" class="md-body" :options="options" :content="content" />
    </div>

    <div ref="rightPanel" style="width:25%;float:left;border: 1px solid black;height:550px;border-radius: 15px;">
      <div class="tab-container">
        <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
          <el-tab-pane label="Common" name="COMMON">
            <el-alert
              title="This option is a general AI conversation, which will use search engines such as Google and Bing to answer your questions depending on the situation."
              type="success"/>
          </el-tab-pane>
          <el-tab-pane label="Chat PDF" name="PDF">
            <el-upload
              class="filter-item"
              :action="uploadUrl"
              accept=".pdf"
              :on-error="handleUploadError"
              :on-success="handleUploadSuccess"
              :on-exceed="handleExceed">
              <el-button size="small" type="primary">Upload PDF</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="Chat Web" name="WEB">
            <el-input v-model="currentFilePath" :placeholder="$t('common.hint.input') + 'HTTP address'" style="width: 100%;" />
          </el-tab-pane>
          <el-tab-pane label="Chat Python" name="python">
            <el-upload
              class="filter-item"
              :action="multiplyUploadUrl"
              accept=".py"
              multiple="true"
              :data="{'requestId':new Date().getTime()}"
              :on-error="handleUploadError"
              :on-success="handleUploadSuccess"
              :on-exceed="handleExceed">
              <el-button size="small" type="primary">Upload Python Files</el-button>
            </el-upload>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <div>
      <el-input
        type="textarea"
        :rows="3"
        :autosize="{ minRows: 3, maxRows: 6}"
        placeholder="Please input your question"
        v-model="question">
      </el-input>
      <br/>
      <el-button size="bigger" style="width:100%;margin-top:10px;" type="primary" plain @click="submitQuestion" @keyup.enter="submitQuestion">Send</el-button>

      <el-select v-model="selectModel" placeholder="Choise Model" @change="handleSelected">
        <el-option
          v-for="item in modelList"
          :key="item.id"
          :label="item.id"
          :value="item.id">
        </el-option>
      </el-select>
    </div>

  </div>
</template>

<script>

import { getModelList } from '@/api/chatgpt'
import { getToken } from '@/utils/auth' // get token from cookie
import { EventSourcePolyfill } from 'event-source-polyfill'

export default {
  components: {
    
  },
  data() {
    return {
      content: '',
      selectModel: '',
      modelList: [],
      tabMapOptions: [
        { label: 'Common', key: 'COMMON' },
        { label: 'Chat PDF', key: 'PDF' },
        { label: 'Chat Web', key: 'WEB' },
        { label: 'Chat Python', key: 'Python' }
      ],
      activeName: 'COMMON',
      uploadUrl: process.env.VUE_APP_BASE_API+'files/upload',
      multiplyUploadUrl: process.env.VUE_APP_BASE_API+'files/upload/multiply',
      currentFilePath: '',
      options: {
        markdownIt: {
          linkify: true,
          html: true,
          xhtmlOut: true,
          breaks: true,
          typographer: true
        },
        linkAttributes: {
          attrs: {
            target: '_blank',
            rel: 'noopener'
          }
        }

      },
      question: null
    }
  },
  mounted() {
    // this.createConnection()
    this.fetchModels()
  },
  methods: {
    submitQuestion() {
      const es = new EventSourcePolyfill(process.env.VUE_APP_PYTHON_API+"stream?userId=testUser&dataType=" + this.activeName + "&projectId=1001&question=" + this.question + "&path=" + this.currentFilePath,
      {
        heartbeatTimeout: 120000,
        openWhenHidden: true
        // headers: { 
        //   'Access-Token': getToken() 
        // },
        // timeout: 0
      })
      this.content = this.content + `<p class="chat-line">User: ${this.question}</p> <p>`
      this.question = null
      es.addEventListener('chat_response', event => {
        console.log(event)
        if (event.data){
          const response = JSON.parse(event.data)
          console.log(response)
          if(response.content === '[DONE]') {
            this.content = this.content + `</p>`
            es.close()
          }else if(response.content){
            this.content = this.content + response.content
            // this.$refs.markdownIt.scrollTop = this.$refs.markdownIt.scrollHeight
            // console.log(this.$refs.markdownIt + '+++++'+this.$refs.markdownIt.scrollHeight)
          }
        }
      })
      es.addEventListener('error', event => {
        if (event.readyState === EventSource.CLOSED) {
            console.log('event was closed')
        }
      })
      es.addEventListener('close', event => {
        console.log(event.type)
        es.close()
      })
    },
    handleSelected(selected) {
      this.selectModel = selected
      this.$message('switch model to ' + selected)
    },
    fetchModels() {
      getModelList().then(response => {
        this.modelList = response.data
      })
    },
    handleExceed(files, fileList) {
      files.forEach(f => {
        console.log(f)
      })
    },
    handleUploadError(err, file, fileList) {
      this.$message.error(err)
    },
    handleUploadSuccess(response, file, fileList) {
      if (response.code !== '00000') {
        this.$notify({
          title: 'Upload falied',
          message: response.message,
          type: 'falied',
          duration: 3000
        })
        return false
      } else{
        this.$notify({
          title: 'Upload success',
          message: 'successfully uploaded ' + file.name,
          type: 'success',
          duration: 2000
        })
        this.currentFilePath = response.message
        console.log(this.currentFilePath)
      }
    },
  }
}
</script>
<style>
.md-body {
  margin: 20px;
  font-size: 16px;
  line-height: 1.6;
  color: #444;
  word-break: break-word;
  word-wrap: break-word;
  white-space: pre-wrap;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  overflow-y:scroll;
  overflow-x:hidden;
  height:100%;
}

.md-body .chat-line {
  background-color: #f5f5f5;
  border-radius: 8px;
  min-height: 35px;
}

</style>