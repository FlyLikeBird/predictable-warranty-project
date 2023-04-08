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

export function getBindSensors(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/equipment/getSensorsRelational?' + str, { 
        method:'GET',
        }); 
}

export function delMach(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/equipment/updateEquipmentInfo', { 
        method:'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function bindSensor(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/equipment/addSensorsRelational', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function unbindSensor(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/equipment/removeSensorsRelational', { 
        method:'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

// 添加传感器信息
export function getSensorList(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/sensor/getSensorsList?' + str, { 
        method:'GET',
        }); 
}

export function addSensor(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/sensor/addSensors', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function updateSensor(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/sensor/updateSensors', { 
        method:'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function upload(data = {}){
    let token = apiToken();
    let formData = new FormData();
    formData.append('file', data.file);
    formData.append('uploadType', 'mach');
    // formData.append('uploadType', '')
    return request('/upload/fileUpload', { 
        method:'POST',
        body:formData
        }); 
}
