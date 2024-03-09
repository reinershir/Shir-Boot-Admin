<template>
  <div class="app-container">
    <div class="filter-container">
      <el-upload
        class="filter-item"
        :action="uploadUrl"
        accept=".jsonl"
        :on-error="handleUploadError"
        :on-success="handleUploadSuccess"
        :on-exceed="handleExceed">
        <el-button size="small" type="primary">Upload FineTune File</el-button>
      </el-upload>
      <el-button style="margin-left:20px;" size="small" type="primary" icon="el-icon-s-open" class="filter-item" @click="getFineTuneJobs">Show FineTune Jobs</el-button>
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
      <el-table-column align="center" label="bytes">
        <template slot-scope="scope">
          <span>{{ scope.row.bytes }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="filename">
        <template slot-scope="scope">
          <span>{{ scope.row.filename }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="object">
        <template slot-scope="scope">
          <span>{{ scope.row.object }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="purpose">
        <template slot-scope="scope">
          <span>{{ scope.row.purpose }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="status">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column width="220px" align="center" label="created_at">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('common.button.operation')" lign="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <div>
            <el-button size="small" type="primary" class="filter-item" @click="handleCreateFineTune(row, $index)">Create FineTune Job</el-button>
            <el-button size="small" type="primary" @click="handleDetail(row, $index)">
              View
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row, $index)">
              Delete
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="FineTuneJobs" :visible.sync="jobsDialogVisible">
      <el-table v-loading="jobsLoading" :data="jobs" border fit highlight-current-row style="width: 100%">
        <el-table-column width="100%" align="center" label="id">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="fineTunedModel">
          <template slot-scope="scope">
            <span>{{ scope.row.fine_tuned_model }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="filename">
          <template slot-scope="scope">
            <span>{{ scope.row.filename }}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="center" label="object">
          <template slot-scope="scope">
            <span>{{ scope.row.object }}</span>
          </template>
        </el-table-column>

        <el-table-column width="120px" align="center" label="organizationId">
          <template slot-scope="scope">
            <span>{{ scope.row.organizationId }}</span>
          </template>
        </el-table-column>

        <el-table-column width="120px" align="center" label="data">
          <template slot-scope="scope">
            <span>{{ scope.row.data }}</span>
          </template>
        </el-table-column>

        <el-table-column width="120px" align="center" label="model">
          <template slot-scope="scope">
            <span>{{ scope.row.model }}</span>
          </template>
        </el-table-column>

        <el-table-column width="120px" align="center" label="status">
          <template slot-scope="scope">
            <span>{{ scope.row.status }}</span>
          </template>
        </el-table-column>

        <el-table-column width="120px" align="center" label="finishedAt">
          <template slot-scope="scope">
            <span>{{ scope.row.finishedAt }}</span>
          </template>
        </el-table-column>

        <el-table-column width="220px" align="center" label="created_at">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="jobsDialogVisible = false">
          {{ $t('common.button.cancel') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="Content" :visible.sync="detailDialogVisible">
      <div class="json-editor">
        <textarea ref="textarea" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">
          {{ $t('common.button.cancel') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>



<script>
import { getFineTuneFiles, getFineTunings, getFileContent, deleteFile, createFineTuneJob } from '@/api/chatgpt'
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/rubyblue.css'
require('script-loader!jsonlint')
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'

export default {
  name: 'FineTuneFiles',
  data() {
    return {
      list: null,
      jobs: null,
      jobsDialogVisible: false,
      detailDialogVisible: false,
      jobsLoading: false,
      jsonEditor: false,
      uploadUrl: process.env.VUE_APP_BASE_API+'gpt/models/uploadFile'
    }
  },
  created() {
    this.getList()
  },
  watch: {
    value(value) {
      const editorValue = this.jsonEditor.getValue()
      if (value !== editorValue) {
        this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
      }
    }
  },
  mounted() {
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode: 'application/json',
      gutters: ['CodeMirror-lint-markers'],
      theme: 'rubyblue',
      lint: true
    })

    this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
    this.jsonEditor.on('change', cm => {
      this.$emit('changed', cm.getValue())
      this.$emit('input', cm.getValue())
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      getFineTuneFiles().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    getValue() {
      return this.jsonEditor.getValue()
    },
    getFineTuneJobs() {
      this.jobsLoading = true
      this.jobsDialogVisible = true
      getFineTunings().then(response => {
        this.jobs = response.data
        this.jobsLoading = false
      })
    },
    handleExceed(files, fileList) {
      files.forEach(f => {
        console.log(f)
        if (f.fileName !== 'json' || f.fileName !== 'jsonl') {
          this.$message.warning('only jsonl file')
        }
      })
    },
    handleUploadError(err, file, fileList) {
      this.$message.error(err)
    },
    handleUploadSuccess(response, file, fileList) {
      if (response.code !== '00000') {
        this.$notify({
            title: 'Upload falied',
            message: response.message,
            type: 'falied',
            duration: 3000
        })
        return false
      }else{
        this.$notify({
            title: 'Upload success',
            message: response.message,
            type: 'success',
            duration: 2000
        })
        this.getList()
      }
    },
    handleDetail(row, index) {
      this.detailDialogVisible = true
      getFileContent(row.id).then(response => {
        console.log(response.data)
        this.jsonEditor.setValue(JSON.stringify(response.data, null, 2))
      })
    },
    handleDelete(row, index) {
      this.$confirm(this.$t('common.hint.confirm'), 'Hint', {
        confirmButtonText: this.$t('common.button.submit'),
        cancelButtonText: this.$t('common.button.cancel'),
        type: 'warning'
      }).then(() => {
        deleteFile(row.id).then(response => {
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
    handleCreateFineTune(row, index) {
      this.$confirm(this.$t('common.hint.confirm'), 'Hint', {
        confirmButtonText: this.$t('common.button.submit'),
        cancelButtonText: this.$t('common.button.cancel'),
        type: 'warning'
      }).then(() => {
        createFineTuneJob(row.id).then(response => {
          this.$notify({
            title: 'Success',
            message: response.message,
            type: 'success',
            duration: 2000
          })
        })
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


.json-editor {
  height: 100%;
  position: relative;

  ::v-deep {
    .CodeMirror {
      height: auto;
      min-height: 300px;
    }

    .CodeMirror-scroll {
      min-height: 300px;
    }

    .cm-s-rubyblue span.cm-string {
      color: #F08047;
    }
  }
}

</style>