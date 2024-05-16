<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
 import chatGPT from '@/views/ai/ChatGPT.vue'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard, chatGPT },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    // TODO: 根据用户角色动态加载对应组件
    this.currentRole = 'adminDashboard'
    if (!this.roles.includes('admin')) {
      // this.currentRole = 'editorDashboard'
      if(this.roles.includes('普通用户') || this.roles.includes('user')){
        this.currentRole = 'chatGPT'
      }else{
        this.currentRole = 'editorDashboard'
      }
    }
  }
}
</script>
