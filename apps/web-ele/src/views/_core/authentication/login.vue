<script lang="ts" setup>

import { AuthenticationLogin } from '@vben/common-ui';

import { useAuthStore } from '#/store';
import { ref,reactive,onMounted} from 'vue'
import { ElRow,ElCol,ElInput } from 'element-plus';
import { getCodeInfo } from '#/api';
defineOptions({ name: 'Login' });

const authStore = useAuthStore();

const captcha = ref('')
const randCodeData = reactive({
    randCodeImage: '',
    requestCodeSuccess: false,
    checkKey: null,
  });

function handleChangeCheckCode() {
    // formData.inputCode = '';
    //TODO 兼容mock和接口，暂时这样处理
    console.log('-authStore-',authStore)
   randCodeData.checkKey = 1629428467008; //new Date().getTime();
    getCodeInfo(randCodeData.checkKey).then((res) => {

      randCodeData.randCodeImage = res;
      randCodeData.requestCodeSuccess = true;
    });
  }
  //初始化验证码
  onMounted(() => {
    handleChangeCheckCode();
  });
</script>

<template>
  <AuthenticationLogin :loading="authStore.loginLoading" @submit="authStore.authLogin" :captcha="captcha" >
    <el-row >
      <el-col :span="12">
        <el-input v-model="captcha" placeholder="验证码" />
      </el-col>
      <el-col :span="8">
        <img
            v-if="randCodeData.requestCodeSuccess"
            style="margin-top: 2px; max-width: initial"
            :src="randCodeData.randCodeImage"
            @click="handleChangeCheckCode"
          />
          <img v-else 
          style="margin-top: 2px; 
          max-width: initial"
          src="data:image/png;base64,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" 
          @click="handleChangeCheckCode" />
      </el-col>
    </el-row>
  </AuthenticationLogin>
</template>
