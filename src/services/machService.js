import request from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { authToken, apiToken } from '../utils/encryption';

export function getMachList(data = {}){
    let token = apiToken();
    // data.token = token;
    let str = translateObj(data);
    return request('/equipment/getEquipmentInfoList?' + str, { 
        method:'GET',
        }); 
}
// 获取设备运行状态
export function getMachRunningStatus(data = {}){
    let token = apiToken();
    // data.token = token;
    let str = translateObj(data);
    return request('/equipment/getEquipmentRuntimeStatus?' + str, { 
        method:'GET',
        }); 
}

export function getMachRunningParams(data = {}){
    let token = apiToken();
    // data.token = token;
    let str = translateObj(data);
    return request('/equipment/getEquipmentRuntimeMetrics?' + str, { 
        method:'GET',
        }); 
}

export function getMachRunningChart(data = {}){
    let token = apiToken();
    // data.token = token;
    let str = translateObj(data);
    return request('/equipment/getRuntimeTrend?' + str, { 
        method:'GET',
        }); 
}

export function getTplList(data = {}){
    let token = apiToken();
    // data.token = token;
    let str = translateObj(data);
    return request('/equipment/getEquipmentInfoTemplateList?' + str, { 
        method:'GET',
        }); 
}
// 添加设备信息
export function addMach(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/equipment/addEquipmentInfo', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function updateMach(data = {}){
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

export function delMach(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/equipment/deleteEquipmentInfo', { 
        method:'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getUnbindSensors(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/sensor/getSensorsChooseList?' + str, { 
        method:'GET',
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
export function getSensorModelList(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/sensor/getMeterModelList?' + str, { 
        method:'GET',
        }); 
}
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
export function delSensor(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/sensor/deleteSensors', { 
        method:'DELETE',
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
export function getFileBlob(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/upload/getFileByPath?' + str, { 
        method:'GET',
        }); 
}