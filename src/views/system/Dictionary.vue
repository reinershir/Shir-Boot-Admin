<template>
  <div class="app-container">
    <div class="filter-container">
	<el-input 
 	  v-model="listQuery.name" :placeholder="$t('common.hint.input') + '字典名'" style="width: 15%; margin-right: 50px;" />
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
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
	  <el-table-column v-if="false" align="center" label="id">
	        <template slot-scope="scope">
	          <span>{{ scope.row.id }}</span>
	        </template>
	  </el-table-column>
	  <el-table-column align="center" :label="$t('dictionary.name')">
	      <template slot-scope="scope">
	        <span>{{ scope.row.name }}</span>
	      </template>
	  </el-table-column>
	  <el-table-column align="center" label="Code">
	      <template slot-scope="scope">
	        <span>{{ scope.row.code }}</span>
	      </template>
	  </el-table-column>
	  <el-table-column align="center" label="Value">
	      <template slot-scope="scope">
	        <span>{{ scope.row.value }}</span>
	      </template>
	  </el-table-column>
    <el-table-column align="center" label="Type">
	      <template slot-scope="scope">
	        <span>{{ scope.row.type }}</span>
	      </template>
	  </el-table-column>
      <el-table-column align="center" :label="$t('common.button.operation')" lign="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button class="filter-item" type="primary" size="mini" icon="el-icon-edit" @click="handleUpdate(row)">
            {{ $t('common.button.edit') }}
          </el-button>
          <el-button size="small" type="danger" :disabled="row.type === 'SYSTEM'" icon="el-icon-delete" @click="handleDelete(row, $index)">
            {{ $t('common.button.delete') }}
          </el-button>
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
        style="margin-left:50px;"
      >
        <el-input v-show="false" v-model="info.id" />
        <el-form-item prop="name" :label="$t('dictionary.name')">
          <el-input v-model="info.name" />
        </el-form-item>
        <el-form-item prop="code" label="Code">
          <el-input v-model="info.code" :disabled="info.type === 'SYSTEM'"/>
        </el-form-item>
        <el-form-item prop="value" label="Value">
          <el-input v-model="info.value" />
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
import { fetchList, create, update, deleteById } from '@/api/dictionary'
import Pagination from '@/components/Pagination'

export default {
  name: 'dictionaryList',
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
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 20,
        name: ''
      },
      dialogFormVisible: false,
      dialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: this.$t('common.button.edit'),
        create: this.$t('common.button.create')
      },
      info: {
        id: null,
        name: null,
        code: null,
        value: null,
        type: "CUSTOM"
      },
      rules: {
	      name: [{ required: true, message: this.$t('common.hint.input') + this.$t('dictionary.name') }],
	      code: [{ required: true, message: this.$t('common.hint.input') + 'code' }],
	      value: [{ required: true, message: this.$t('common.hint.input') + 'value' }]
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
    handleFilter() {
      this.getList()
    },
    resetTemp() {
      this.info = {
      }
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.resetTemp()
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
          this.list.splice(index, 1)
        })
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          create(this.info).then(() => {
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