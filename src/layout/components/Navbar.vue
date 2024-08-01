<template>
  <div class="navbar">
    <hamburger id="hamburger-container" v-if="!checkPermission(['user','普通用户'])" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" v-if="!checkPermission(['user','普通用户'])" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!-- <search id="header-search" class="right-menu-item" /> -->

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" v-if="!checkPermission(['user','普通用户'])" />

        <el-tooltip :content="$t('navbar.size')" effect="dark" placement="bottom" v-if="!checkPermission(['user','普通用户'])" >
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

        <lang-select class="right-menu-item hover-effect" v-if="!checkPermission(['user','普通用户'])" />

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar?(avatar+'?imageView2/1/w/80/h/80'):'https://www.pngkit.com/png/detail/126-1262807_instagram-default-profile-picture-png.png?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/profile/index">
            <el-dropdown-item>
              {{ $t('navbar.profile') }}
            </el-dropdown-item>
          </router-link> -->
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="handleUpdatePassword">
            <span style="display:block;">{{ $t('navbar.updatePassword') }}</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog :title="$t('navbar.updatePassword')" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="updatePasswordInfo"
        :rules="rules"
        label-position="left"
        label-width="150px"
        style="margin-left:50px;"
      >
        <el-form-item prop="password" :label="$t('user.oldPassword')">
          <el-input v-model="updatePasswordInfo.password" />
        </el-form-item>
        <el-form-item prop="newPassword" :label="$t('user.newPassword')">
          <el-input v-model="updatePasswordInfo.newPassword" />
        </el-form-item>
        <el-form-item prop="requiredPassword" :label="$t('user.requirePassword')">
          <el-input v-model="updatePasswordInfo.requiredPassword" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('common.button.cancel') }}
        </el-button>
        <el-button type="primary" @click="submitUpdatePassword">
          {{ $t('common.button.save') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import Search from '@/components/HeaderSearch'
import { updatePassword } from '@/api/user'
import checkPermission from '@/utils/permission' // 权限判断函数
import md5 from 'js-md5'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    Search
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('user.requirePassword')))
      } else if (value !== this.updatePasswordInfo.newPassword) {
        callback(new Error(this.$t('user.unmatchPassword')))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      updatePasswordInfo: {},
      rules: {
	      password: [{ required: true, message: this.$t('common.hint.input') + this.$t('user.password'), min: 6, max: 16, trigger: 'change' }],
        newPassword: [{ required: true, message: this.$t('common.hint.input') + this.$t('user.password'), min: 6, max: 16, trigger: 'change' }],
        requiredPassword: [{ required: true, validator: validatePassword, trigger: 'blue' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  methods: {
    checkPermission,
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleUpdatePassword() {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.updatePasswordInfo = {}
    },
    submitUpdatePassword() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = {}
          tempData.password = md5(this.updatePasswordInfo.password)
          tempData.newPassword = md5(this.updatePasswordInfo.newPassword)
          updatePassword(tempData).then(response => {
            this.$message({
              message: response.message,
              type: 'success'
            })
            this.dialogFormVisible = false
          })
        }
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.updatePassword()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
