<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.nickName" :placeholder="$t('user.hint.nickName')" style="width: 15%; margin-right: 50px;" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t("common.button.search") }}
      </el-button>
      <br>
      <el-button
        class="filter-item"
        style="margin:20px 0 20px 0;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate()"
      >
        {{ $t("common.button.create") }}
      </el-button>
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox>-->
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <!--<el-table-column width="180px" align="center" label="Date">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>-->

      <el-table-column v-if="false" width="330px" align="center" label="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('user.loginName')">
        <template slot-scope="scope">
          <span>{{ scope.row.loginName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('user.profile')">
        <template slot-scope="scope">
          <img style="width: 30px;height: 30px;" :src="scope.row.profile">
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" :label="$t('user.nickName')">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" :label="$t('user.email')">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" :label="$t('user.phoneNumber')">
        <template slot-scope="scope">
          <span>{{ scope.row.phoneNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column width="220px" align="center" :label="$t('user.createDate')">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>

      <el-table-column width="220px" align="center" :label="$t('user.updateDate')">
        <template slot-scope="scope">
          <span>{{ scope.row.updateDate }}</span>
        </template>
      </el-table-column>

      <el-table-column width="320px" align="center" :label="$t('user.remark')">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('user.status')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==null" type="success" effect="dark">{{ $t('common.status.enable') }}</el-tag>
          <el-tag v-if="scope.row.status==0" type="success" effect="dark">{{ $t('common.status.enable') }}</el-tag>
          <el-tag v-if="scope.row.status==1" type="danger" effect="dark">{{ $t('common.status.disable') }}</el-tag>
        </template>
      </el-table-column>

      <!--<el-table-column width="100px" label="Importance">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>-->

      <!--<el-table-column class-name="status-col" label="Count" width="110">
        <template slot-scope="{scope}">-->
      <!--<el-tag :type="row.status | statusFilter">
            {{ scope.status }}-->
      <!--</el-tag>-->
      <!-- </template>
      </el-table-column>-->

      <!--<el-table-column min-width="300px" label="Title">
        <template slot-scope="{row}">
          <router-link :to="'/example/edit/'+row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>-->

      <el-table-column align="center" :label="$t('common.button.operation')" lign="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <div>
            <el-button class="filter-item" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
              {{ $t('common.button.edit') }}
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row, $index)">
              {{ $t('common.button.delete') }}
            </el-button>
            <el-button size="small" type="primary" @click="handleResetPassword(row)">
              {{ $t('user.button.resetPassword') }}
            </el-button>
          </div>
          <div style="margin-top: 10px;">
            <el-button class="filter-item" type="primary" size="mini" icon="el-icon-check" @click="handleEnable(row, $index)">
              {{ $t('common.button.enable') }}
            </el-button>
            <el-button size="small" type="danger" icon="el-icon-close" @click="handleDisable(row, $index)">
              {{ $t('common.button.disable') }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-row>
        <el-col :span='12'>
          <el-form
            ref="dataForm"
            :rules="rules"
            :model="info"
            label-position="left"
            label-width="150px"
            style="margin-left:50px;"
          >
            <el-input v-show="false" v-model="info.id" />
            <el-form-item prop="loginName" :label="$t('user.loginName')">
              <el-input v-model="info.loginName" />
            </el-form-item>
            <el-form-item prop="nickName" :label="$t('user.nickName')">
              <el-input v-model="info.nickName" />
            </el-form-item>
            <el-form-item :label="$t('user.profile')" prop="profile">
              <el-input v-model="info.profile" />
            </el-form-item>
            <el-form-item v-if="dialogStatus === 'create'" prop="password" :label="$t('user.password')">
              <el-input v-model="info.password" type="password" placeholder="Please input Password" />
            </el-form-item>
            <el-form-item prop="email" :label="$t('user.email')">
              <el-input v-model="info.email" />
            </el-form-item>
            <el-form-item prop="phoneNumber" :label="$t('user.phoneNumber')">
              <el-input v-model="info.phoneNumber" />
            </el-form-item>
            <el-form-item prop="remark" :label="$t('user.remark')">
              <el-input v-model="info.remark" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span='12' style="padding-left:50px;padding-right:50px;">
          <el-table ref="roleTable" v-loading="roles.roleListLoading" :data="roles.roleList" border highlight-current-row @selection-change="selectRole">
            <el-table-column v-if="false" width="330px" align="center" label="id">
              <template slot-scope="scope">
                <span>{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column align="center" :label="$t('role.roleName')">
              <template slot-scope="scope">
                <span>{{ scope.row.roleName }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('role.description')">
              <template slot-scope="scope">
                <span>{{ scope.row.description }}</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="roles.total > 0"
            :total="roles.total"
            :page.sync="roles.page"
            :limit.sync="roles.pageSize"
            @pagination="getRoleList"
          />
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('common.button.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          {{ $t('common.button.save') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('user.button.resetPassword')" :visible.sync="resetPasswordDialogVisible">
      <el-form
        ref="resetForm"
        :model="pwd"
        :rules="rules"
        label-position="left"
        label-width="150px"
        style="width: 500px; margin-left:50px;"
      >
        <el-input v-show="false" v-model="pwd.user" />
        <el-form-item prop="newPassword" :label="$t('user.password')">
          <el-input v-model="pwd.newPassword" type="password" placeholder="Please input Password" />
        </el-form-item>
        <el-form-item prop="requiredPassword" :label="$t('user.requirePassword')">
          <el-input v-model="pwd.requiredPassword" type="password" placeholder="Please input your confirmation password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetPasswordDialogVisible = false">
          {{ $t('common.button.cancel') }}
        </el-button>
        <el-button type="primary" @click="resetPassword()">
          {{ $t('common.button.save') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, create, update, deleteById, enable, disable, resetPassword, roleList, getRoleByUser } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import md5 from 'js-md5'

export default {
  name: 'UserList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('user.requirePassword')))
      } else if (value !== this.pwd.newPassword) {
        callback(new Error(this.$t('user.unmatchPassword')))
      } else {
        callback()
      }
    }
    return {
      list: null,
      roles: {
        page: 1,
        pageSize: 10,
        roleList: null,
        total: 0,
        roleListLoading: true
      },
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        nickName: ''
      },
      dialogFormVisible: false,
      dialogVisible: false,
      resetPasswordDialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: this.$t('common.button.edit'),
        create: this.$t('common.button.create')
      },
      info: {
        id: '',
        nickName: '',
        profile: '',
        password: '',
        loginName: '',
        phoneNumber: '',
        email: '',
        remark: '',
        roleIds: [],
        status: 0
      },
      pwd: {
        user: '',
        newPassword: '',
        requiredPassword: ''
      },
      rules: {
        loginName: [{ required: true, message: this.$t('common.hint.input') + this.$t('user.loginName') }],
        nickName: [{ required: true, message: this.$t('common.hint.input') + this.$t('user.nickName') }],
        password: [{ required: true, message: this.$t('common.hint.input') + this.$t('user.password'), min: 6, max: 16, trigger: 'change' }],
        newPassword: [{ required: true, message: this.$t('common.hint.input') + this.$t('user.password'), min: 6, max: 16, trigger: 'change' }],
        requiredPassword: [{ required: true, validator: validatePassword, trigger: 'blue' }]
      }
    }
  },
  created() {
    this.getList()
    this.getRoleList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.getList()
    },
    resetTemp() {
      this.info = {
        id: '',
        nickName: '',
        password: '',
        loginName: '',
        phoneNumber: '',
        email: '',
        remark: '',
        status: 0
      }
    },
    selectRole(selection) {
      this.info.roleIds = []
      for (var i = 0; i < selection.length; i++) {
        this.info.roleIds.push(selection[i].id)
      }
    },
    getRoleList() {
      this.roles.roleListLoading = true
      if (this.roles.roleList === null) {
        roleList().then(response => {
          this.roles.roleList = response.data.records
          this.roles.total = response.data.total
          this.roles.roleListLoading = false
        })
      }
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['roleTable'].clearSelection()
        this.$refs['dataForm'].clearValidate()
      })
      this.resetTemp()
    },
    handleUpdate(row) {
      this.info = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.showPassword = false
      getRoleByUser(row.id).then(response => {
        this.$nextTick(() => {
          this.roles.roleList.forEach(roleRow => {
            var index = response.data.indexOf(roleRow.id)
            this.$refs['roleTable'].toggleRowSelection(roleRow, index !== -1)
          })
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    handleResetPassword(row) {
      this.pwd.user = row.id
      this.resetPasswordDialogVisible = true
      this.$nextTick(() => {
        this.$refs['resetForm'].clearValidate()
      })
    },
    handleDelete(row, index) {
      this.$confirm(this.$t('common.hint.confirm'), 'Hint', {
        confirmButtonText: this.$t('common.button.submit'),
        cancelButtonText: this.$t('common.button.cancel'),
        type: 'warning'
      }).then(() => {
        deleteById(row.id).then(response => {
          this.$notify({
            title: 'Success',
            message: response.message,
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
      })
    },
    handleEnable(row, index) {
      this.$confirm(this.$t('common.hint.confirm'), 'Hint', {
        confirmButtonText: this.$t('common.button.submit'),
        cancelButtonText: this.$t('common.button.cancel'),
        type: 'warning'
      }).then(() => {
        enable(row.id).then(response => {
          this.$notify({
            title: 'Success',
            message: response.message,
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      })
    },
    handleDisable(row, index) {
      this.$confirm(this.$t('common.hint.confirm'), 'Hint', {
        confirmButtonText: this.$t('common.button.submit'),
        cancelButtonText: this.$t('common.button.cancel'),
        type: 'warning'
      }).then(() => {
        disable(row.id).then(response => {
          this.$notify({
            title: 'Success',
            message: response.message,
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const pwd = this.info.password
          this.info.password = md5(pwd)
          const tempData = JSON.stringify(this.info)
          this.info.password = pwd
          create(tempData).then(() => {
            this.list.unshift(this.info)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: this.$t('common.hint.success'),
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const listData = JSON.stringify(this.info)
          // console.log(listData)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          update(listData).then((response) => {
            const index = this.list.findIndex(v => v.id === this.info.id)
            this.list.splice(index, 1, this.info)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: response.message,
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    resetPassword() {
      this.$refs['resetForm'].validate((valid) => {
        if (valid) {
          const origin = this.pwd.newPassword
          this.pwd.newPassword = md5(origin)
          const data = JSON.stringify(this.pwd)
          this.pwd.newPassword = origin
          resetPassword(data).then((response) => {
            this.resetPasswordDialogVisible = false
            this.$notify({
              title: 'Success',
              message: response.message,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
