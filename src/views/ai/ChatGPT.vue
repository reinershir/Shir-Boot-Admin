<template>
  <div>
    <div style="width:100%;height:550px;border: 1px solid black;border-radius: 15px;">
      <markdown-it-vue ref="markdownIt" class="md-body" :options="options" :content="content" />
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
import MarkdownItVue from 'markdown-it-vue'
import { connect, chat, getModelList } from '@/api/chatgpt'
import 'markdown-it-vue/dist/markdown-it-vue.css'
import { getToken } from '@/utils/auth' // get token from cookie
import { EventSourcePolyfill } from 'event-source-polyfill';

export default {
  components: {
    MarkdownItVue
  },
  data() {
    return {
      content: '',
      selectModel: '',
      modelList: [],
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
    this.createConnection()
    this.fetchModels()
  },
  methods: {
    createConnection() {
      let es = new EventSourcePolyfill(process.env.VUE_APP_BASE_API+'gpt/chat/connect',
      { 
        headers: { 
          'Access-Token': getToken() 
        },
        timeout: 0
      })
      es.addEventListener('message', event => {
          // console.log(event);
          if(event.data){
            const response = JSON.parse(event.data)
            if(event.data == '\"[DONE]\"'){
              this.content = this.content + `</p>`
            }else if(response.content){
              this.content = this.content + response.content
              // this.$refs.markdownIt.scrollTop = this.$refs.markdownIt.scrollHeight
              // console.log(this.$refs.markdownIt + '+++++'+this.$refs.markdownIt.scrollHeight)
            }
          }
          
      });
      es.addEventListener('error', event => {
          if (event.readyState == EventSource.CLOSED) {
              console.log('event was closed');
          };
      });
      es.addEventListener('close', event => {
          console.log(event.type);
          es.close();
      });
    },
    submitQuestion() {
      if (this.question) {
        this.content = this.content + `<p class="chat-line">User: ${this.question}</p> <p>`
        chat({prompt:this.question,model:this.selectModel}).then(response => {
          if(response.code == '00000'){
            this.question = null
          }
        })
      }
    },
    handleSelected(selected) {
      this.selectModel = selected
      this.$message('switch model to ' + selected);
    },
    fetchModels() {
      getModelList().then(response => {
        this.modelList = response.data
      })
    }
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