import request from '@/utils/request';
import md5 from "md5";
import qs from 'qs';

export async function getChatRoomChannel(params) {
  console.log("param===============");
  console.log(params);
  const req = '/server/api/game/getChatRoomChannel?userName='+params.payload.userName;
  console.log(req);
  return request(req, {
    method: 'GET'
  });
}


