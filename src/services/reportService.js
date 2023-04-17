import request from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { authToken, apiToken } from '../utils/encryption';

// 获取运行报表
export function getRunningReport (data = {}){
    let token = apiToken();
    // data.token = token;
    let str = translateObj(data);
    return request('/dataReport/getRunReport?' + str, { 
        method:'GET',
        }); 
}
