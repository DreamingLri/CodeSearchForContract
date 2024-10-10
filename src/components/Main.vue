<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import request from "../utils/request";
import { ElMessage } from "element-plus";

const search_code = ref('')
const search_result = ref()
const selected_code = ref<string[]>([])

function getContract() {
  request.get("https://api.etherscan.io/api?module=contract&action=getsourcecode&address=" + search_code.value + "&apikey=7H5I68STDR37JYFKW9KSHK76NXUG4DZRHW").then(res => {
    if (res.data.message === 'OK') {
      search_result.value = res.data
      formatToList(search_result.value?.result[0].SourceCode)
    } else {
      ElMessage.warning(res.data.result)
    }
  })
}

interface FileContent {
  content: string;
}

interface FileObject {
  [key: string]: FileContent;
}

const contract_list = ref<{ key: string; value: any }[]>([])
function formatToList(text: any) {
  if (text.charAt(0) !== '{') {
    if (selected_code.value.length !== 0) {
      selected_code.value = []
    }
    selected_code.value.push(text)
    return
  }
  if (contract_list.value.length !== 0) {
    contract_list.value = []
  }
  if (selected_code.value.length !== 0) {
    selected_code.value = []
  }
  let list = text.slice(1, -1)
  let json: FileObject = JSON.parse(list)
  for (const [key, value] of Object.entries(json.sources)) {
    let obj = {
      key: key,
      value: value.content
    }
    const exists = contract_list.value.some((item) => item.key === obj.key);
    if (!exists) {
      contract_list.value.push(obj);
    }
  }
  console.log(contract_list.value);
}
</script>

<template>
  <div class="common-layout">
    <el-container style="height: 100vh">
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="400px" style="padding: 0 20px">
          <div>
            <div>
              <p class="title">Contract Address</p>
              <el-input v-model="search_code" style="max-width: 600px" placeholder="0x.." class="input-with-select">
                <template #append>
                  <el-button :icon="Search" @click="getContract" />
                </template>
              </el-input>
            </div>
            <div v-if="contract_list.length !== 0">
              <p class="title">Choose Contract Files</p>
              <el-card style="border-radius: 10px;" shadow="never">
                <el-scrollbar max-height="200px">
                  <el-checkbox-group v-model="selected_code">
                    <el-checkbox v-for="item in contract_list" :key="item.value" :label="item.key" :value="item.value">
                      <el-popover placement="top-start" trigger="hover" :content="item.key">
                        <template #reference>
                          {{ item.key }}
                        </template>
                      </el-popover>
                    </el-checkbox>
                  </el-checkbox-group>
                </el-scrollbar>
              </el-card>
            </div>
            <div v-if="selected_code.length !== 0">
              <div style="display:flex;">
                <p class="title">Contract Code</p>
                <div style="align-items: center; display: flex; margin-left: 10px;">
                  <el-icon>
                    <Search />
                  </el-icon>
                </div>
              </div>
              <el-card style="height: 300px;">
                <el-scrollbar max-height="300px">
                  <div v-if="selected_code">
                    <div v-for="code in selected_code" :key="code" v-highlight>
                      <pre style="white-space: pre-wrap;"><code>{{ code }}</code></pre>
                    </div>
                  </div>
                </el-scrollbar>
              </el-card>
            </div>
          </div>
        </el-aside>
        <el-main style="padding: 0 20px">
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.word-break {
  margin-bottom: 20px;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}

.title {
  height: 20px;
}
</style>