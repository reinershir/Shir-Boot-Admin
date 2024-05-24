<template>
  <div class="chat-gpt">
    
    <div class="app-container">
      <div
        class="app-container-left"
        :style="{ 'background-color': this.$store.state.settings.theme }"
      >
        <div class="app-container-left-title">
          <span>Chat-gpt</span>
          <img src="@/assets/gpt.png" class="user-avatar" />
        </div>
        <span class="app-container-left-desc">打造你自己的人工智能助手</span>
        <div class="app-container-left-line">
          <el-button
            style="padding: 5px 30px; border-radius: 15px"
            @click="state = true"
          >
            <img src="@/assets/mark.png" style="width: 20px" />
            面具
          </el-button>
        </div>
        <div class="app-container-left-content">
          <div
            v-for="(item, index) in info"
            :key="index"
            :class="
              defaults.sessionId === item.sessionId
                ? 'app-container-left-item-active app-container-left-item'
                : 'app-container-left-item'
            "
            @click="handleGetHistory(item)"
          >
            {{ item.sessionName }}
            <div class="delete-mask" @click="handleDelete(item)">
              <i class="el-icon-close" />
            </div>
            <div class="rename-chat" @click="handleRename(item)">
              <i class="el-icon-edit" />
            </div>
          </div>
        </div>
        <div class="app-container-left-footer">
          <el-button @click="handleAdd"> 新的聊天 </el-button>
        </div>
      </div>
      <div v-if="state" class="app-container-right">
        <div class="app-container-right-box">
          <div
            v-for="(item, index) in mask"
            :key="index"
            style="margin-right: 30px"
          >
            <div class="mask" @click="handleSetModel(item)">
              {{ item.maskName }}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="app-container-right">
        <div class="app-container-right-title">
          <span>{{ defaults.name }}</span>
        </div>
        <div v-loading="loading" class="app-container-right-content">
          <div v-if="Message.length > 0 && pageNo > 1" class="loading">
            <el-tag
              type="info"
              style="cursor: pointer; margin-top: 5px"
              @click="handleLoad"
            >
              加载更多
            </el-tag>
          </div>
          <div
            v-for="(item, index) in Message"
            :key="index"
            class="app-container-right-item"
          >
            <div
              v-if="item.role === 'user'"
              class="app-container-right-item-user"
            >
              <div>
                <div
                  style="
                    display: flex;
                    justify-content: flex-end;
                    margin-bottom: 10px;
                  "
                >
                  <img
                    :src="avatar + '?imageView2/1/w/80/h/80'"
                    class="user-avatar"
                  />
                </div>
                <div style="display: flex; align-items: center">
                  {{ item.content }}
                </div>
              </div>
            </div>
            <div v-else class="app-container-right-item-assistant">
              <div>
                <img src="@/assets/gpt.png" class="user-avatar" />
              </div>
              <div>
                <vue-markdown :id="'chat-' + index" style="margin-top: 10px;" v-highlight :source="item.content"/>
              </div>
            </div>
          </div>
        </div>
        <div class="app-container-right-footer">
          <div style="display: flex">
            <el-tooltip
              class="item"
              placement="top-start"
              style="margin-right: 10px"
            >
              <template #content>
                是否开启上下文
                <el-switch v-model="contextState" />
              </template>
              <el-button icon="el-icon-reading" circle />
            </el-tooltip>
            <el-button icon="el-icon-s-tools" circle @click="handleSetting" />
          </div>
          <div class="app-container-right-footer-input">
            <el-input
              v-model="question"
              type="textarea"
              :rows="3"
              :autosize="{ minRows: 3, maxRows: 10 }"
              @keyup.enter.native="handleSend"
              placeholder="请输入内容"
            />
            <div class="app-container-right-footer-btn">
              <el-button type="primary" @click="handleSend" > 发送 </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="设置" :visible.sync="visible">
      <div class="app-dialog">
        <div class="app-dialog-item">
          <div>模型</div>
          <div>
            <el-select v-model="models" @change="handleCommand" >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.id"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="重命名" :visible.sync="renameVisible">
      <el-input v-model="renameName" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="renameVisible = false">取 消</el-button>
        <el-button type="primary" @click="Rename">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { chat, getModelList } from "@/api/chatgpt";
import { fetchList } from "@/api/mask";
import { fetchList as fetchChatHistory } from "@/api/chat-history";
import { fetchList as fetchChatSession, create as createChatSession, update as updateChatSession, deleteById as deleteChatSession} from "@/api/chat-session";
import SSE from "./sse";
import { mapGetters } from "vuex";

import VueMarkdown from 'vue-markdown'

export default {
  name: 'chatGPT',
  components: { VueMarkdown },
  data() {
    return {
      visible: false,
      contextState: true,
      renameVisible: false,
      loading: false,
      typing: false,
      connectFlag: false,
      renameName: "",
      selectMask: { prompt: "", maskName: ""},
      mask: [],
      info: [],
      defaults: {
        sessionId: "",
        sessionName: "新的聊天",
        model: "gpt-3.5-turbo",
        maskId: "",
        mask: "",
      },
      Message: [],
      question: "",
      pageNo: 1,
      state: false,
      models: "gpt-3.5-turbo",
      options: [],
      currentItemUuid: "",
      queue: [],
    };
  },
  computed: {
    ...mapGetters(["avatar"]),
  },
  created() {
    this.init();
  },
  destroyed() {
    this.typing = false
  },
  watch: {
    
  },
  // mounted() {
  //   this.init();
  // },
  methods: {
    handleDelete(item) {
      deleteChatSession(item.sessionId).then(response=>{
        this.info = this.info.filter((i) => i.sessionId !== item.sessionId);
      })
    },
    handleSetting() {
      this.visible = true;
    },
    handleRename(item){
      this.renameVisible = true;
      this.renameName = item.sessionName;
    },
    Rename() {
      const currentItem =  this.info.find(v => this.currentItemUuid === v.sessionId );
      if (currentItem) {
        const data = {}
        Object.assign(data,currentItem)
        data.sessionName = this.renameName;
        updateChatSession(data).then(response=>{
          currentItem.sessionName = this.renameName;
        })
      }
      this.renameVisible = false;
    },
    handleCommand(mod) {
      this.models = mod;
      const currentItem =  this.info.find(v => this.currentItemUuid === v.sessionId );
      if (currentItem) {
        currentItem.model = mod;
        localStorage.setItem("uuInfo", JSON.stringify(this.info));
      }
      
    },
    printText(item, content, speed = 50) {
      if (speed<10) {
        //dom.innerText += content
        item.content += content
        const appContainerRightContent = document.querySelector(
            ".app-container-right-content"
          )
        appContainerRightContent.scrollTop = appContainerRightContent.scrollHeight
      } else {
        let index = 0;
        //this.setCursorStatus(dom, "typing");
        const printInterval = setInterval(() => {
          //dom.innerText += content[index];
          
          const str = item.content
          const length = str.length
          if(index!=0){
            item.content = str.substr(0, length - 1);
          }
          const next = this.queue.shift(index)
          //console.log(next,"queue")
          item.content += next + "▌";
          index++;
          const appContainerRightContent = document.querySelector(
            ".app-container-right-content"
          );
          appContainerRightContent.scrollTop = appContainerRightContent.scrollHeight;
          //队列消耗完毕且AI返回完毕清除定时
          if (this.queue.length<1 && !this.typing) {
            //this.setCursorStatus(dom, "end");
            item.content = str.substr(0, length - 1);
            clearInterval(printInterval);
          }
        }, speed);
      }
    },
    // setCursorStatus(dom, status) {
    //   const classList = {
    //     loading: "typing blinker",
    //     typing: "typing",
    //     end: "",
    //   };
    //   dom.className = classList[status];
    // },
    async handleLoad() {
      this.loading = true;
      this.pageNo = this.pageNo - 1;
      const { data } = await fetchChatHistory({
        sessionId: this.sessionId,
        pageNo: this.pageNo,
      });
      data.records.map((item) => {
        this.Message.unshift({
          role: "assistant",
          content: item.answer,
        });
        this.Message.unshift({
          role: "user",
          content: item.question,
        });
      });
      this.Message.forEach((item, index) => {
        this.$nextTick(() => {
          this.content[index] = item.content
          //const chat = document.querySelector(`#chat-${index}`);
          //if (chat) this.printText(chat, item.content,index);
        });
      });
      this.loading = false;
      // console.log(data, "datadata");
    },
    async handleGetHistory(item) {
      this.state = false;
      //如果在打印中就点击其它对话框
      if(this.typing){
        this.completeEvent()
      }
      this.loading = true;
      this.Message = [];
      this.defaults = item;
      this.currentItemUuid = item.sessionId;
      if (item.mask) {
        this.selectMask.prompt = item.mask;
        this.selectMask.maskId = item.id
      }else {
        this.selectMask = {};
      }
      if (item.model) {
        this.models = item.model;
      }
      const { data } = await fetchChatHistory({
        sessionId: item.sessionId,
      });
      this.sessionId = item.sessionId;
      this.pageNo = data.pages;
      const { data: data2 } = await fetchChatHistory({
        sessionId: item.sessionId,
        pageNo: data.pages,
      });
      const arr = [];
      data2.records.map((item) => {
        arr.push({
          role: "user",
          content: item.question,
        });
        arr.push({
          role: "assistant",
          content: item.answer,
        });
      });
      
      this.content = [];
      arr.forEach((item, index) => {
        this.$nextTick(() => {
          this.content[index] = item.content
          //if (chat) this.content += item.content;
        });
      });
      this.Message = arr;
      this.$nextTick(() => {
        const appContainerRightContent = document.querySelector(
          ".app-container-right-content"
        );
        appContainerRightContent.scrollTop =
          appContainerRightContent.scrollHeight;
      });
      this.loading = false;
    },
    completeEvent(event) {
      this.typing = false
      const item = this.Message.find((v) => v.state);
      const index = this.Message.findIndex((v) => v.state);
      if (item) {
        item.state = false;
        if(event){
          this.queue.push(event.content)
        }
        // this.$nextTick(() => {
        //   //const chat = document.querySelector(`#chat-${index}`);
        //   this.printText(item, item.content,100);
        // });
      }
    },
    onMessageCallback(event) {
      if (event === "[DONE]") {
        this.completeEvent(event)
      } else if (event.content) {
        this.$nextTick(() => {
          const appContainerRightContent = document.querySelector(
            ".app-container-right-content"
          );
          appContainerRightContent.scrollTop =
            appContainerRightContent.scrollHeight;
        });
        const item = this.Message.find((v) => v.state);
       
        const index = this.Message.findIndex((v) => v.state);
        if (!item) {
          this.Message.push({
            role: "assistant",
            content: "",
            state: true
          });
          const str = (event.content + "").split('')
          str.forEach((v,i)=>{
            this.queue.push(v)
          })
        }else{
          const str = (event.content + "").split('')
          str.forEach((v,i)=>{
            this.queue.push(v)
          })
          if(!this.typing){
            this.typing = true
            this.$nextTick(() => {
              this.printText(item,event.content,30)
            });
          }
        }
      }
    },
    async init() {
      fetchChatSession(data).then(response=>{
        if (response.data.records.length<1 && this.info.length<1) {
          const first = this.handleAdd(this.defaults)
          if(first){
            this.currentItemUuid = frst.sessionId
          }
        }else{
          this.info = response.data.records
        }
      })
      // SSE.open((event) => {
      //   console.log(event, "open")
      //   this.connectFlag = true
      // })
      // SSE.message((event) => this.onMessageCallback(event));
      // SSE.error((event) => {
      //   console.log(event, "error");
      //   this.connectFlag = false
      // });
      // SSE.close((event) => {
      //   console.log(event, "close");
      //   this.connectFlag = false
      // });
      const { data } = await fetchList();
      this.mask = data.records;
      const { data: data2 } = await getModelList();
      //this.options = data2;
      data2.map((item) => {
        // console.log(item, "item")
        if (item.id.startsWith("gpt-3.5") || item.id.startsWith("gpt-4")) {
          this.options.push(item);
        }
      });
    },
    handleSetModel(mask) {
      this.selectMask = mask;
      this.state = false;
      this.handleAdd(mask);
    },
    handleAdd(mask) {
      const obj = {
        sessionName: mask.maskName ? mask.maskName : "新的聊天",
        model: this.models ? this.models : '',
        mask: mask.prompt,
        maskId: mask.id,
      };
      return createChatSession(obj).then(response=>{
        obj.sessionId = response.data.sessionId
        this.info.push(obj);
        return obj
      })
    },
    async handleSend() {
      if (!this.question) return;
      this.$nextTick(() => {
        const appContainerRightContent = document.querySelector(
          ".app-container-right-content"
        );
        appContainerRightContent.scrollTop =
          appContainerRightContent.scrollHeight;
      });
      
      const obj = {
        sessionId: this.currentItemUuid,
        prompt: this.question,
        model: this.models,
        mask: this.selectMask.prompt,
        enableContext: this.contextState,
      };
      SSE.open((event) => {
        if(this.question){
          this.Message.push({
            role: "user",
            content: this.question,
          });
          chat(obj).then((response) => {
            if (response.code === "00000") {
              this.question = null;
            }
          });
        }
        
      })
      SSE.message((event) => this.onMessageCallback(event));
      
    },
  },
};
</script>
<style>
.typing::after {
  content: "▌";
}

.blinker::after {
  animation: blink 1.2s step-end infinite;
  display: inline-block;
  width: 2px;
  height: 20px;
  margin-left: 2px;
  vertical-align: sub;
}

@keyframes blinker {
  0% {
    visibility: visible;
  }

  50% {
    visibility: hidden;
  }

  100% {
    visibility: visible;
  }
}
</style>
<style scoped lang="scss">
.delete-mask {
  display: none;
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.rename-chat {
  display: none;
  position: absolute;
  top: 10px;
  right: 40px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.app-dialog {
  border: 1px solid rgb(185, 182, 182);
  border-radius: 5px;
  height: 200px;
  display: flex;
  flex-direction: column;

  .app-dialog-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 20px;
    border-bottom: 1px solid rgb(185, 182, 182);
    font-size: 20px;
    font-weight: 600;
  }
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #caccd2;
  margin-right: 10px;
}

.chat-gpt {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-input__inner) {
  border-right-width: 0px;
}

:deep(.el-input) {
  border-right-width: 0px;
}

.app-container {
  width: 100%;
  height: 100%;
  display: flex;
  border-radius: 15px;

  .app-container-left {
    padding: 20px;
    width: 350px;
    border-radius: 15px 0 0 15px;
    height: 100%;
    display: flex;
    flex-direction: column;

    .app-container-left-title {
      width: 100%;
      display: flex;
      margin-bottom: 5px;
      justify-content: space-between;

      & > span:nth-child(1) {
        font-weight: 700;
      }
    }

    .app-container-left-desc {
      font-size: 12px;
      font-weight: 400;
      margin-bottom: 20px;
    }

    .app-container-left-line {
      margin-top: 20px;
    }

    .app-container-left-content {
      overflow-y: scroll;
      padding-bottom: 40px;
      display: flex;
      flex-direction: column;
      flex: 1;

      .app-container-left-item-active {
        background: #f2f6fc;
        border: 1px solid #76a7b5;
      }

      .app-container-left-item {
        margin-top: 10px;
        padding: 20px;
        background: white;
        border-radius: 15px;
        position: relative;

        &:hover {
          background: #f2f6fc;

          .delete-mask {
            display: block;
          }

          .rename-chat {
            display: block;
          }
        }

        &:active {
          background: #f2f6fc;
        }
      }
    }

    .app-container-left-footer {
      display: flex;
      height: 40px;
    }
  }

  .app-container-right {
    border: 1px solid #caccd2;
    border-radius: 0 15px 15px 0;
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;

    .app-container-right-box {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 100px;

      .mask {
        cursor: pointer;
        padding: 10px;
        border: 1px solid #caccd2;
        border-radius: 10px;

        &:hover {
          border: 1px solid #53b6d1;
        }
      }
    }

    .app-container-right-title {
      display: flex;
      flex-direction: column;
      font-size: 20px;
      font-weight: 600;
      padding: 20px;
    }

    .app-container-right-content {
      .loading {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      overflow-y: scroll;
      display: flex;
      flex: 1;
      border-top: 1px solid #caccd2;
      flex-direction: column;

      .app-container-right-item-user {
        width: 100%;
        display: flex;
        flex-direction: row-reverse;
      }

      .app-container-right-item {
        width: 100%;
        display: flex;
        padding: 20px;

        &:hover {
          background: #f2f6fc;
        }

        &:active {
          background: #f2f6fc;
        }
      }
    }

    .app-container-right-footer {
      border-top: 1px solid #caccd2;
      width: 100%;
      overflow-y: hidden;
      height: 150px;
      padding: 5px;
      display: flex;
      position: relative;
      flex-direction: column;

      .app-container-right-footer-input {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .app-container-right-footer-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        right: 10px;
        bottom: 50%;
        transform: translateY(50%);
      }
    }
  }
}
</style>
