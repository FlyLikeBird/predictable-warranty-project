import { 
    getOrderList, getOrderDetail,
    addOrder, updateOrder, delOrder,
    getMaintainList, getMaintainDetail
} from '../services/orderService';

const initialState = {
    orderList:[],
    currentPage:1,
    isLoading:false,
    total:0,
    optional:{},
    maintainList:[],
    maintainDetail:{}
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
        *fetchMaintainList(action, { put, call, select }){
            let { user:{ companyId }, order:{ optional }} = yield select();
            let { currentPage } = action.payload || {};
            currentPage = currentPage || 1;
            let params = { companyId, page:currentPage, pageSize:12 };
            Object.keys(optional).forEach(key=>{
                if(optional[key]){
                    params[key] = optional[key];
                }
            })
            yield put({ type:'toggleLoading'});
            let { data } = yield call(getMaintainList, params);
            if ( data && data.code === 200 ){
                yield put({ type:'getMaintainListResult', payload:{ data:data.data, currentPage, total:data.total }});
            }
        },
        *fetchMaintainDetail(action, { put, call, select }){
            let { equipmentCode } = action.payload || {};
            let { data } = yield call(getMaintainDetail, { equipmentCode });
        }
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        getOrderListResult(state, { payload:{ data, currentPage, total }}){
            return { ...state, orderList:data, currentPage, total };
        },
        getMaintainListResult(state, { payload:{ data, currentPage, total }}){
            return { ...state, maintainList:data, currentPage, total, isLoading:false };
        },
        setOptional(state, { payload }){
            return { ...state, optional:payload };
        },
        reset(){
            return initialState;
        }
    }
}

