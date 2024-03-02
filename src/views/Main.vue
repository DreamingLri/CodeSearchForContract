<script setup>

import Title from "@/components/Title.vue";
import {ref} from "vue";
import request from "@/utils/request";


const textarea = ref('')
const text = ref()

function getContract() {
  request.get("https://api.etherscan.io/api?module=contract&action=getsourcecode&address="+textarea.value+"&apikey=7H5I68STDR37JYFKW9KSHK76NXUG4DZRHW").then(res=>{
    text.value =  res.result[0].SourceCode
    console.log(text.value)
  })
}

</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header height="40">
        <Title/>
      </el-header>
      <el-main style="justify-content: center; align-items: center">
        <el-input
            v-model="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入要查询的代码"
        />
        <el-button type="primary" @click="getContract">Primary</el-button>
        <el-scrollbar height="300px">
          <el-card style="max-width: 100%">
            <pre style="text-align: left">{{text}}</pre>
          </el-card>
        </el-scrollbar>

      </el-main>
    </el-container>
  </div>
</template>

<style scoped>

</style>