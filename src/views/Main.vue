<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import request from "../utils/request";
import { ElMessage } from "element-plus";
import post_code from "../utils/code_analysis";
import format_tag from '../utils/format';
import { isEmpty } from 'element-plus/es/utils/types.mjs';

const search_code = ref('')
const search_result = ref()
const selected_code = ref<string[]>([])
const code_analysis = ref('')
const code_tags = ref<string[]>([])
const code_message = ref<Record<string, string>[]>([])
const code_message_list = ref<Record<string, string>[]>([])


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

function autoCopy() {
  const valueToCopy = selected_code.value.toString();
  navigator.clipboard.writeText(valueToCopy)
    .then(() => {
      ElMessage.success('Copy successfully');
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
      ElMessage.error('Failed to copy');
    });
}

async function send_code() {
  let res = await post_code(code_analysis.value)
  code_tags.value = res.tags
  code_message.value = res.message
}

function add_message(tag: string) {
  for (const [_, value] of Object.entries(code_message.value)) {
    if (!code_message_list.value.includes(value) && Object.keys(value)[0] === tag) {
      code_message_list.value.push(value)
    }
  }
  // console.log(code_message_list.value);  
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
  // console.log(contract_list.value);
}
</script>

<template>
  <div class="common-layout">
    <el-container style="height: 100vh">
      <el-header style="height: 100px; border-bottom: 1px solid #e1e3e1;">
        <div style="display: flex; justify-content: center; margin-top: 20px;">
          <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">CodeSearchForContract</h1>
        </div>
      </el-header>
      <el-container style="background-color: #fafbfc">
        <el-aside width="400px" style="padding: 0 20px; border-right: 1px solid #e1e3e1;">
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
                  <el-icon @click="autoCopy">
                    <CopyDocument />
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
          <p class="title">Code Analysis</p>
          <el-input v-model="code_analysis" style="display: flex;" :rows="8" type="textarea"
            placeholder="Please input" />
          <div style="margin-top: 20px;" />
          <el-button :icon="Search" circle @click="send_code" />
          <div style="margin-top: 20px;" />
          <div class="flex gap-2">
            <el-tag v-for="tag in code_tags" :key="tag" :disable-transitions="false" :type="format_tag(tag)"
              @click="add_message(tag)">
              {{ tag }}
            </el-tag>
          </div>
          <div style="margin-top: 20px;" />
          <div v-if="!isEmpty(code_message_list)">
            <el-card shadow="hover">
              <div v-for="message in code_message_list" :key="Object.keys(message)[0]" class="flex" style="margin-top: 20px;">
                <el-tag :type="format_tag(Object.keys(message)[0])">
                  {{ Object.keys(message)[0] }}
                </el-tag>
                <div style="margin-left: 10px;">
                  {{ Object.values(message)[0] }}
                </div>
              </div>
            </el-card>
          </div>
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
  height: 40px;
  line-height: 40px;
}
</style>