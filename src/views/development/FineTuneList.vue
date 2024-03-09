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

      <el-table-column v-if="false" width="330px" align="center" label="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="fineTunedModel">
        <template slot-scope="scope">
          <span>{{ scope.row.fineTunedModel }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="finishedAt">
        <template slot-scope="scope">
          <span>{{ scope.row.finishedAt }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="model">
        <template slot-scope="scope">
          <span>{{ scope.row.model }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="data">
        <template slot-scope="scope">
          <span>{{ scope.row.data }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="trainingFile">
        <template slot-scope="scope">
          <span>{{ scope.row.trainingFile }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="status">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column width="220px" align="center" label="created_at">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getFineTunings } from '@/api/chatgpt'

export default {
  name: 'FineTuneList',
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
      getFineTunings().then(response => {
        this.list = response.data.data
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
