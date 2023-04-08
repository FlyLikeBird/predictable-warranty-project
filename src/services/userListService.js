import request from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { authToken, apiToken } from '../utils/encryption';

export function getUserList(data = {}){
    let token = apiToken();
    // data.token = token;
    let str = translateObj(data);
    return request('/sys/user/bmUserList?' + str, { 
        method:'GET',
        }); 
}

// 添加设备信息
export function addUser(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/sys/user/bmAddUser', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function updateUser(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/sys/user/bmUpdateUser', { 
        method:'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function delUser(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/sys/user/bmDeleteUserByIds', { 
        method:'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body:JSON.stringify(data.userIds)
        }); 
}

export function changePwd(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/sys/user/bmUpdateUserPassword', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getLogList(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/sys/log/getOperateLog?' + str, { 
        method:'GET',
    }); 
}

