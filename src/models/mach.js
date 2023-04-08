import { 
    getTplList,
    getMachRunningStatus, getMachRunningParams, getMachRunningChart,
    getMachList, addMach, updateMach, 
    getUnbindSensors, getBindSensors,
    getSensorList, addSensor, updateSensor,
    bindSensor, unbindSensor,
    upload
} from '../services/machService';

const initialState = {
    list:[],
    tplList:[],
    currentPage:1,
    isLoading:false,
    total:0,
    sensorList:[],
    // 获取可绑定的传感器列表
    unbindSensors:[],
    // 获取当前设备已绑定的传感器
    bindSensors:[],
    // 设备状态列表
    statusList:[],
    
    detailInfo:{},
    chartInfo:{}
};

export default {
    namespace:'mach',
    state:initialState,
    effects:{
        *initMachList(action, { put, call }){
            yield put({ type:'userList/fetchUserList'});
            yield put({ type:'fetchUnbindSensors'});
            yield put({ type:'fetchMachList'});
            yield put({ type:'fetchTplList'});
        },
        *fetchTplList(action, { put, call }){
            let { data } = yield call(getTplList);
            if ( data && data.code === 200 ){
                yield put({ type:'getTplListResult', payload:{ data:data.data }});
            }
        },
        *fetchMachList(action, { put, call, select }){
            let { user:{ companyId }} = yield select();
            let { currentPage, pageSize } = action.payload || {};
            currentPage = currentPage || 1;
            pageSize = pageSize || 12;
            yield put({ type:'toggleLoading'});
            let { data } = yield call(getMachList, { companyId, page:currentPage, pageSize });
            if ( data && data.code === 200 ){
                yield put({ type:'getMachListResult', payload:{ data:data.data, currentPage, total:data.total }});
            }
        },
        *fetchUnbindSensors(action, { put, call, select }){
            let { user:{ companyId }} = yield select();
            let { data } = yield call(getUnbindSensors, { companyId });
            if ( data && data.code === 200 ){
                yield put({ type:'getUnbindSensorsResult', payload:{ data:data.data }});
            }
        },
        *fetchBindSensors(action, { put, call, select }){
            let { equipmentCode } = action.payload || {};
            let { data } = yield call(getBindSensors, { equipmentCode });
            if ( data && data.code === 200 ) {
                yield put({ type:'getBindSensorsResult', payload:{ data:data.data }})
            }
        },
        *addMachAsync(action, { put, call, select, all }){
            let { user:{ companyId }} = yield select();
            let { values, resolve, reject, forEdit } = action.payload || {};
            values.companyId = companyId;
            if ( values.fileList && values.fileList.length ) {
                let imagePaths = yield all([
                    ...values.fileList.map(file=>call(upload, { file }))
                ]);
                if ( imagePaths && imagePaths.length ) {
                    imagePaths = imagePaths.map(i=>i.data.data);
                    values.equipmentPhotoPath = imagePaths[0].photoPath;
                } 
            }
            values.fileList = null;
            let { data } = yield call( forEdit ? updateMach : addMach, { ...values });
            if ( data && data.code === 200 ){
                // 判断是否有绑定的传感器
                if ( values.sensorList  ) {
                    let dataArr = yield all(
                        values.sensorList.map(item=>call( item.action === 'bind' ? bindSensor : unbindSensor, item.action === 'bind' ? { equipmentCode:values.equipmentCode, sensorCode:item.payload } : { equipmentSensorId:item.payload }))
                    );
                    if ( dataArr && dataArr.length ) {
                    } else {
                        if ( reject ) reject(data.message);
                    }
                }
                // 有可能执行解绑操作，重新获取未绑定的传感器列表
                yield put({ type:'fetchUnbindSensors'});
                if ( resolve ) resolve();
                yield put({ type:'fetchMachList'});
            } else {
                if ( reject ) reject(data.message);
            }
        },
        // 传感器
        *fetchSensorList(action, { put, call, select }){
            let { user:{ companyId }} = yield select();
            let { currentPage } = action.payload || {};
            currentPage = currentPage || 1;
            let { data } = yield call(getSensorList, { companyId, page:currentPage, pageSize:12 });
            if ( data && data.code === 200 ){
                yield put({ type:'getSensorResult', payload:{ data:data.data, currentPage }});
            }
        },
        *addSensorAsync(action, { put, call, select, all }){
            let { user:{ companyId }} = yield select();
            let { values, resolve, reject, forEdit, forDel } = action.payload || {};
            values.companyId = companyId;
            if ( forDel ) {
                values.deleteStatus = 1;
            }
            let { data } = yield call(forEdit ? updateSensor : addSensor, { ...values } );
            if ( data && data.code === 200 ){
                yield put({ type:'fetchSensorList'});
                if ( resolve ) resolve();
            } else {
                if ( reject ) reject(data.message);
            }
        },
        *fetchMachRunningStatus(action, { put, call, select }){
            let { user:{ companyId }} = yield select();
            let { data } = yield call(getMachRunningStatus, { companyId });
            if ( data && data.code === 200 ){
                yield put({ type:'getMachRunningStatusResult', payload:{ data:data.data } });
            }
        },
        *fetchMachRunningParams(action, { put, call, select }){
            let { user:{ companyId }} = yield select();
            let { currentMach } = action.payload || {};
            let { data } = yield call(getMachRunningParams, { companyId, equipmentCode:currentMach });
        },
        *fetchMachRunningChart(action, { put, call, select }){
            let { user:{ companyId, startDate, endDate }} = yield select();
            let { resolve, reject, equipmentCode, optionType } = action.payload || {};
            let { data } = yield call(getMachRunningChart, { companyId, equipmentCode, optionType, beginDate:startDate.format('YYYY-MM-DD'), endDate:endDate.format('YYYY-MM-DD')});
            if ( data && data.code === 200 ) {
                resolve(data.data);
            } else {
                reject(data.message);
            }
        }
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        getMachListResult(state, { payload:{ data, currentPage, total }}){
            return { ...state, list:data, currentPage, total, isLoading:false };
        },
        getBindSensorsResult(state, { payload:{ data }}){
            return { ...state, bindSensors:data };
        },
        getUnbindSensorsResult(state, { payload:{ data }}){
            return { ...state, unbindSensors:data };
        },
        getSensorResult(state, { payload:{ data, currentPage, total }}){
            return { ...state, sensorList:data, currentPage, total };
        },
        getTplListResult(state, { payload:{ data }}){
            return { ...state, tplList:data };
        },
        getMachRunningStatusResult(state, { payload:{ data }}){
            return { ...state, statusList:data };
        },
        reset(){
            return initialState;
        }
    }
}

