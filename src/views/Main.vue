<script setup>

import Title from "@/components/Title.vue";
import {ref} from "vue";

const textarea = ref('')
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
            placeholder="Please input"
        />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>

</style>