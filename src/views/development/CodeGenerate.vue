<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="tableName" :placeholder="$t('common.hint.input') + $t('codegenerate.tableName')" style="width: 15%; margin-right: 50px;" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t("common.button.search") }}
      </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" :disabled="list === null || list.length<1" @click="getStart">
        {{ $t("codegenerate.getStart") }}
      </el-button>
      <br>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" >
      <el-table-column align="center" :label="$t('codegenerate.name')">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('codegenerate.columnName')">
        <template slot-scope="scope">
          <span>{{ scope.row.columnName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('codegenerate.javaType')">
        <template slot-scope="scope">
          <span>{{ scope.row.javaType }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('codegenerate.defaultValue')">
        <template slot-scope="scope">
          <span>{{ scope.row.defaultValue }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('codegenerate.isPrimaryKey')">
        <template slot-scope="scope">
          <span>{{ scope.row.isPrimaryKey }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('codegenerate.isNull')">
        <template slot-scope="scope">
          <span>{{ scope.row.isNull }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('codegenerate.comment')">
        <template slot-scope="scope">
          <span>
            <el-input v-model="scope.row.comment" :value="scope.row.comment" size="small" style="width:100%" />
          </span>
          <!-- <span>{{ scope.row.comment }}</span> -->
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('codegenerate.queryOperation')" lign="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span>
            <el-select v-model="scope.row.operation" clearable :placeholder="$t('codegenerate.select')">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible" :title="$t('codegenerate.getStart')" :rules="rules">
      <el-form :model="info" ref="dataForm" :rules="rules" label-width="180px" label-position="left">
        <el-form-item :label="$t('codegenerate.tableName')" prop="tableName">
          <el-input v-model="info.tableName" :placeholder="$t('codegenerate.tableName')" />
        </el-form-item>
        <el-form-item :label="$t('codegenerate.name')" prop="modelName">
          <el-input v-model="info.modelName" :placeholder="$t('codegenerate.name')" />
        </el-form-item>
        <el-form-item :label="$t('codegenerate.packageName')" prop="packageName">
          <el-input v-model="info.packageName" :placeholder="$t('codegenerate.packageName')" />
        </el-form-item>
        <el-form-item :label="$t('codegenerate.modelDescription')" prop="modelDescription">
          <el-input v-model="info.modelDescription" :placeholder="$t('codegenerate.modelDescription')" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          {{ $t('permission.cancel') }}
        </el-button>
        <el-button type="primary" @click="generate">
          {{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getColumnsByTableName, generateAndDownload } from '@/api/development'

export default {
  name: 'CodeGanerate',
  components: { },
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
  data() {
    return {
      list: null,
      info: {
        tableName: '',
        pakageName: '',
        modelDescription: '',
        fieldInfos: [],
        modelName: ''
      },
      queryType: null,
      listLoading: false,
      dialogVisible: false,
      rules: {
        tableName: [{ required: true, message: this.$t('common.hint.input') + this.$t('codegenerate.tableName') }],
        modelName: [{ required: true, message: this.$t('common.hint.input') + this.$t('codegenerate.name') }],
        packageName: [{ required: true, message: this.$t('common.hint.input') + this.$t('codegenerate.packageName') }],
        modelDescription: [{ required: true, message: this.$t('common.hint.input') + this.$t('codegenerate.modelDescription') }]
      },
      tableName: '',
      options: [
        {
          value: '=',
          label: '='
        },
        {
          value: '>',
          label: '>'
        },
        {
          value: '<',
          label: '<'
        },
        {
          value: '>=',
          label: '>='
        },
        {
          value: '<=',
          label: '<='
        },
        {
          value: 'like_left',
          label: 'likeLeft'
        },
        {
          value: 'like_right',
          label: 'likeRight'
        },
        {
          value: 'like',
          label: 'like'
        },
        {
          value: 'not_empty',
          label: 'not_empty'
        },
        {
          value: 'is_null',
          label: 'is_null'
        },
        {
          value: 'hidden',
          label: 'hidden'
        }
      ]
    }
  },
  methods: {
    getList() {
      if (this.talbeName === null || this.tableName === '') {
        this.$notify({
          title: 'falie',
          message: this.$t('common.hint.input') + this.$t('codegenerate.tableName'),
          type: 'error',
          duration: 2000
        })
        return
      }
      this.listLoading = true
      getColumnsByTableName(this.tableName).then(response => {
        this.list = response.data
        this.info.tableName = this.tableName
        this.listLoading = false
      })
    },
    getStart() {
      this.dialogVisible = true
    },
    generate() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const requestData = this.info
          requestData.fieldInfos = this.list
          generateAndDownload(requestData).then((response) => {
            this.dialogVisible = false
            this.$notify({
              title: 'Success',
              message: this.$t('common.hint.success'),
              type: 'success',
              duration: 2000
            })
            console.log(response)
            var blob = new Blob([response.data], {
              type: 'application/file'
            })
            var url = window.URL.createObjectURL(blob)
            var a = document.createElement('a')
            a.href = url
            a.download = 'codes.zip'
            a.click()
          })
        }
      })
    },
    handleFilter() {
      this.getList()
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
