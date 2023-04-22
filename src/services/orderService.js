import request from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { authToken, apiToken } from '../utils/encryption';

export function getOrderList(data = {}){
    let token = apiToken();
    // data.token = token;
    let str = translateObj(data);
    return request('/workTickets/getEquipmentWorkTicketsList?' + str, { 
        method:'GET',
        }); 
}

export function getOrderDetail(data = {}){
    let token = apiToken();
    // data.token = token;
    let str = translateObj(data);
    return request('/workTickets/getEquipmentWorkTickets?' + str, { 
        method:'GET',
        }); 
}
// 添加工单信息
export function addOrder(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/workTickets/addEquipmentWorkTickets', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function updateOrder(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/workTickets/updateEquipmentWorkTickets', { 
        method:'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}


export function delOrder(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/workTickets/deleteEquipmentWorkTickets', { 
        method:'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
// 保养计划
export function getMaintainList(data = {}){
    let token = apiToken();
    // data.token = token;
    let str = translateObj(data);
    return request('/wisdomOM/getUpkeepProject?' + str, { 
        method:'GET',
        }); 
}
export function getMaintainDetail(data = {}){
    let token = apiToken();
    // data.token = token;
    let str = translateObj(data);
    return request('/wisdomOM/getUpkeepProjectDetail?' + str, { 
        method:'GET',
        }); 
}