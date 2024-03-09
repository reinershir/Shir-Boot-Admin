<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate()"
      >
        {{ $t("common.button.create") }}
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row default-expand-all style="width: 100%" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column v-if="false" align="center" label="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" align="center" label="level">
        <template slot-scope="scope">
          <span>{{ scope.row.level }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('menu.menuName')">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="url">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="icon">
        <template slot-scope="scope">
          <span>{{ scope.row.icon }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('menu.permissionCodes')">
        <template slot-scope="scope">
          <span>{{ scope.row.permissionCodes }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('menu.property')">
        <template slot-scope="scope">
          <span>{{ scope.row.property }}</span>
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

      <el-table-column align="center" :label="$t('common.button.operation')" lign="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <div>
            <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleUpdate(row)">
              {{ $t("common.button.edit") }}
            </el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleAddChild(row)">
              {{ $t("menu.addChild") }}
            </el-button>
            <el-button class="filter-item" type="primary" icon="el-icon-rank" @click="handleMove(row)">
              {{ $t("menu.moveMenu") }}
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row, $index)">
              {{ $t('common.button.delete') }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
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
        <el-input v-show="false" v-model="info.parentId" />
        <el-form-item v-if="dialogStatus === 'create' && info.parentId !== null" :label="$t('menu.parentMenu')">
          <el-input v-model="info.parentName" readonly />
        </el-form-item>
        <el-form-item prop="name" :label="$t('menu.menuName')">
          <el-input v-model="info.name" />
        </el-form-item>
        <el-form-item prop="url" label="url">
          <el-input v-model="info.url" />
        </el-form-item>
        <el-form-item prop="icon" label="icon">
          <el-input v-model="info.icon" />
        </el-form-item>
        <el-form-item prop="permissionCodes" :label="$t('menu.permissionCodes')">
          <el-input v-model="info.permissionCodes" />
        </el-form-item>
        <el-form-item prop="property" :label="$t('menu.property')">
          <el-input v-model="info.property" />
        </el-form-item>
        <el-form-item prop="description" :label="$t('common.label.description')">
          <el-input v-model="info.description" />
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
    <el-dialog :title="$t('menu.moveMenu')" :visible.sync="moveMenuDialogFormVisible">
      <div class="filter-container">
        <template>
          {{ $t('menu.position') }} :
          <el-radio v-model="position" label="1">{{ $t('menu.before') }}</el-radio>
          <el-radio v-model="position" label="2">{{ $t('menu.after') }}</el-radio>
          <el-radio v-model="position" label="3">{{ $t('menu.lastChild') }}</el-radio>
        </template>
      </div>
      <el-table v-loading="listLoading" :data="list" border fit highlight-current-row default-expand-all style="width: 100%" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @cell-click="cellClick">
      <el-table-column v-if="false" width="330px" align="center" label="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" width="330px" align="center" label="level">
        <template slot-scope="scope">
          <span>{{ scope.row.level }}</span>
        </template>
      </el-table-column>
        <el-table-column align="center" :label="$t('menu.menuName')">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="url">
          <template slot-scope="scope">
            <span>{{ scope.row.url }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="icon">
          <template slot-scope="scope">
            <span>{{ scope.row.icon }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('menu.permissionCodes')">
          <template slot-scope="scope">
            <span>{{ scope.row.permissionCodes }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('menu.property')">
          <template slot-scope="scope">
            <span>{{ scope.row.property }}</span>
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
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="moveMenuDialogFormVisible = false">
          {{ $t('common.button.cancel') }}
        </el-button>
        <el-button type="primary" @click="moveMenu()">
          {{ $t('common.button.save') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, create, update, deleteById, moveMenu } from '@/api/menu'

export default {
  name: 'MenuList',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      dialogFormVisible: false,
      dialogVisible: false,
      moveMenuDialogFormVisible: false,
      position: '2',
      selectedMoveMenu: {
        selectMenuId: null,
        targetMenuId: null,
        selectLevel: null,
        targetLevel: null
      },
      dialogStatus: '',
      textMap: {
        update: this.$t('common.button.edit'),
        create: this.$t('common.button.create')
      },
      info: {
        id: '',
        name: '',
        parentId: null,
        parentName: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('common.hint.input') + this.$t('menu.menuName') }]
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
        this.list = response.data
        this.listLoading = false
      })
    },
    resetTemp() {
      this.info = {
        id: null,
        name: '',
        parentId: null,
        parentName: '',
        description: ''
      }
      this.imgFiles = []
    },
    cellClick(row, column, cell, event) {
      this.selectedMoveMenu.targetMenuId = row.id
      this.selectedMoveMenu.targetLevel = row.level
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.resetTemp()
    },
    handleMove(row) {
      this.moveMenuDialogFormVisible = true
      this.selectedMoveMenu.selectMenuId = row.id
      this.selectedMoveMenu.selectLevel = row.level
      this.selectedMoveMenu.targetMenuId = null
    },
    moveMenu() {
      if (this.selectedMoveMenu.targetMenuId == null ) {
        this.$notify({
          title: 'faile',
          message: this.$t('menu.selectCell'),
          type: 'faile',
          duration: 2000
        })
        return
      }
      moveMenu({ moveId: this.selectedMoveMenu.selectMenuId, targetId: this.selectedMoveMenu.targetMenuId, position: this.position }).then(response => {
        this.moveMenuDialogFormVisible = false
        this.getList()
      })
    },
    handleAddChild(row) {
      this.resetTemp()
      const tempData = { parentId: row.id, parentName: row.name }
      this.info = Object.assign({}, tempData) // copy obj
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.info = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.showPassword = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
          this.getList()
        })
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const data = JSON.stringify(this.info)
          create(data).then((response) => {
            this.list.unshift(this.info)
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
