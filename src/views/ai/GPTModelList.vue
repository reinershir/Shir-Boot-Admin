<template>
  <div class="app-container">
    <div class="filter-container">
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <!--<el-table-column width="180px" align="center" label="Date">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>-->

      <el-table-column width="330px" align="center" label="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="object">
        <template slot-scope="scope">
          <span>{{ scope.row.object }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="root">
        <template slot-scope="scope">
          <span>{{ scope.row.root }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="parent">
        <template slot-scope="scope">
          <span>{{ scope.row.parent }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="ownedBy">
        <template slot-scope="scope">
          <span>{{ scope.row.owned_by }}</span>
        </template>
      </el-table-column>

      <el-table-column width="220px" align="center" label="created">
        <template slot-scope="scope">
          <span>{{ scope.row.created | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.button.operation')" lign="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <div>
            <el-button size="small" type="danger" @click="handleDelete(row, $index)">
              {{ $t('common.button.delete') }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getModelList, deleteModel } from '@/api/chatgpt'

export default {
  name: 'GPTModelList',
  data() {
    return {
      list: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getModelList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleDelete(row, index) {
      this.$confirm(this.$t('common.hint.confirm'), 'Hint', {
        confirmButtonText: this.$t('common.button.submit'),
        cancelButtonText: this.$t('common.button.cancel'),
        type: 'warning'
      }).then(() => {
        deleteModel(row.id).then(response => {
          this.$notify({
            title: 'Success',
            message: response.message,
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
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
