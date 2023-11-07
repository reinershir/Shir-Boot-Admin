<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="tableName" :placeholder="$t('common.hint.input') + $t('codegenerate.tableName')" style="width: 15%; margin-right: 50px;" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t("common.button.search") }}
      </el-button>
      <br>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

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
          <span>{{ scope.row.comment }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.button.operation')" lign="center" width="260" class-name="small-padding fixed-width">
        <template>
          <el-select v-model="operation" clearable :placeholder="$t('codegenerate.select')">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getColumnsByTableName } from '@/api/development'

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
      listLoading: false,
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
          value: 'likeLeft',
          label: 'likeLeft'
        },
        {
          value: 'likeRight',
          label: 'likeRight'
        },
        {
          value: 'like',
          label: 'like'
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
        this.listLoading = false
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
