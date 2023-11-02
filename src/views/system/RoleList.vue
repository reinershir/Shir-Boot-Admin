<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.nickName" :placeholder="$t('role.roleName')" style="width: 15%; margin-right: 50px;" />
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

      <el-table-column align="center" :label="$t('common.label.createDate')">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.label.updateDate')">
        <template slot-scope="scope">
          <span>{{ scope.row.updateDate }}</span>
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

      <el-table-column align="center" :label="$t('common.button.operation')" lign="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <div>
            <el-button class="filter-item" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
              {{ $t('common.button.edit') }}
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row, $index)">
              {{ $t('common.button.delete') }}
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
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="info"
        label-position="left"
        label-width="150px"
        style="width: 400px; margin-left:50px;"
      >
        <el-input v-show="false" v-model="info.id" />
        <el-form-item prop="roleName" :label="$t('role.roleName')">
          <el-input v-model="info.roleName" />
        </el-form-item>
        <el-form-item prop="description" :label="$t('role.description')">
          <el-input v-model="info.description" />
        </el-form-item>
        <el-form-item :label="$t('role.menu')">
          <el-tree ref="tree" :check-strictly="checkStrictly" :data="menuData" :props="defaultProps" show-checkbox node-key="id" class="permission-tree" :default-checked-keys="defaultCheckedList"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('common.button.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          {{ $t('common.button.save') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, create, update, deleteById, getMenuList, getRolePermissions } from '@/api/role'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'RoleList',
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
    return {
      list: null,
      menuData: null,
      defaultCheckedList: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        roleName: null
      },
      dialogFormVisible: false,
      dialogVisible: false,
      checkStrictly: false,
      resetPasswordDialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: this.$t('common.button.edit'),
        create: this.$t('common.button.create')
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      info: {
        id: '',
        roleName: '',
        description: '',
        menuIds: []
      },
      rules: {
        roleName: [{ required: true, message: this.$t('common.hint.input') + this.$t('role.roleName') }]
      }
    }
  },
  created() {
    this.getList()
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
    getMenus() {
      getMenuList().then(response => {
        this.menuData = response.data
      })
    },
    handleFilter() {
      this.getList()
    },
    resetTemp() {
      this.info = {
        id: '',
        roleName: '',
        description: ''
      }
      this.imgFiles = []
    },
    handleCreate() {
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
        this.defaultCheckedList = []
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.getMenus()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.resetTemp()
    },
    handleUpdate(row) {
      this.info = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      if(this.menuData === null){
        this.getMenus()
      }
      getRolePermissions(row.id).then(response => {
        let selectedNodes = []
        response.data.forEach((item) => {
          selectedNodes.push(item.menuId)
        })
        console.log(this.selectedNodes)
        this.checkStrictly = true
        this.$nextTick(() => {
          this.defaultCheckedList = selectedNodes
          this.$refs.tree.setCheckedNodes(this.defaultCheckedList)
          // set checked state of a node not affects its father and child nodes
          this.checkStrictly = false
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    handleDelete(row, index) {
      this.$confirm(this.$t('common.hint.confirm'), 'Hint', {
        confirmButtonText: this.$t('common.button.submit'),
        cancelButtonText: this.$t('common.button.cancel'),
        type: 'warning'
      }).then(() => {
        deleteById(row.id).then(response => {
          if (response.code === '00000') {
            this.$notify({
              title: 'Success',
              message: response.message,
              type: 'success',
              duration: 2000
            })
            this.list.splice(index, 1)
          } else {
            this.$notify({
              title: 'Faile',
              message: response.message,
              type: 'faile',
              duration: 2000
            })
          }
        })
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const checkedKeys = this.$refs.tree.getCheckedKeys()
          this.info.menuIds = checkedKeys
          const data = JSON.stringify(this.info)
          create(data).then(() => {
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
          const checkedKeys = this.$refs.tree.getCheckedKeys()
          this.info.menuIds = checkedKeys
          const listData = JSON.stringify(this.info)
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
