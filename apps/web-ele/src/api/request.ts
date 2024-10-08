/**
 * 该文件可自行根据业务逻辑进行调整
 */
import type { HttpResponse } from '@vben/request';

import { useAppConfig } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import { RequestClient } from '@vben/request';
import { useAccessStore } from '@vben/stores';

import { ElMessage } from 'element-plus';

import { useAuthStore } from '#/store';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

function createRequestClient(baseURL: string) {
  const client = new RequestClient({
    baseURL,
    // 为每个请求携带 Authorization
    makeAuthorization: () => {
      return {
        // 默认
        key: 'Authorization',
        tokenHandler: () => {
          const accessStore = useAccessStore();
          return {
            refreshToken: `${accessStore.refreshToken}`,
            token: `${accessStore.accessToken}`,
      
          };
        },
        unAuthorizedHandler: async () => {
          const accessStore = useAccessStore();
          const authStore = useAuthStore();
          accessStore.setAccessToken(null);

          if (preferences.app.loginExpiredMode === 'modal') {
            accessStore.setLoginExpired(true);
          } else {
            // 退出登录
            await authStore.logout();
          }
        },
      };
    },
    makeErrorMessage: (msg) => ElMessage.error(msg),

    makeRequestHeaders: () => {
      const accessStore =useAccessStore()
      return {
        // 为每个请求携带 Accept-Language
        'Accept-Language': preferences.app.locale,
        'x-access-token':`${accessStore.accessToken}`,

      };
    },
  });
  client.addResponseInterceptor<HttpResponse>((response) => {
    const { data: responseData, status } = response;
  //  console.log('responseData',responseData,status)
    const { code,message,result} = responseData;
    const hasSuccess = responseData && Reflect.has(responseData, 'code') && (code === 0|| code === 200);
    // console.log('-code-',code,'-data-',data,'-message-',msg)
    // if (status >= 200 && status < 400 && code === 0) {
    //   return result;
    // }
    if (hasSuccess) {
  
      return result;
    }
    // throw new Error(`Error ${status}: ${message}`);
  });
  return client;
}

export const requestClient = createRequestClient(apiURL);
