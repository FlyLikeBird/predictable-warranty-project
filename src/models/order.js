import { 
    getOrderList, getOrderDetail,
    addOrder, updateOrder, delOrder
} from '../services/orderService';

const initialState = {
    orderList:[],
    currentPage:1,
    isLoading:false,
    total:0,
    sensorList:[],
    // 获取可绑定的传感器列表
    unbindSensors:[],
    // 获取当前设备已绑定的传感器
    bindSensors:[]
};

export default {
    namespace:'order',
    state:initialState,
    effects:{
        *initOrder(action, { put, call }){
            yield put({ type:'userList/fetchUserList'});
            yield put({ type:'mach/fetchMachList'});
            yield put({ type:'fetchOrderList'});
        },
        *fetchOrderList(action, { put, call, select }){
            let { user:{ companyId }} = yield select();
            let { currentPage } = action.payload || {};
            currentPage = currentPage || 1;
            let { data } = yield call(getOrderList, { companyId, page:currentPage, pageSize:12 });
            if ( data && data.code === 200 ){
                yield put({ type:'getOrderListResult', payload:{ data:data.data, currentPage, total:data.total }});
            }
        },
        *addOrderAsync(action, { put, call, select, all }){
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
            // let { data } = yield call( forEdit ? updateOrder : addOrder, { ...values });
            // if ( data && data.code === 200 ){
            //     if ( resolve ) resolve();
            //     yield put({ type:'fetchOrderList' });
            // } else {
            //     if ( reject ) reject(data.message);
            // }
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
        }
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        getOrderListResult(state, { payload:{ data, currentPage, total }}){
            return { ...state, orderList:data, currentPage, total };
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
        reset(){
            return initialState;
        }
    }
}

