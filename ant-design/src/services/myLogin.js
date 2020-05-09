import request from '@/utils/request';
import md5 from "md5";
import qs from 'qs';

export async function userlogin(params) {
  return request('/server/api/auth/login', {
    method: 'POST',
    data: params.payload
  });
}

export async function userRegister(params) {
  return request('/server/api/auth/register', {
    method: 'POST',
    data:
      {
        name: params.payload.username,
        password: md5(params.payload.password),
        sex: 0
     }

  });
}
