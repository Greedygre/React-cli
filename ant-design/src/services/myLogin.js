import request from '@/utils/request';

export async function userlogin(params) {
  return request('/server/api/auth/login', {
    method: 'POST',
    data: params.payload
  });
}
