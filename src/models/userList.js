import { 
    getUserList, addUser, updateUser, delUser,
    changePwd,
    getLogList
} from '../services/userListService';

const initialState = {
    list:[],
    isLoading:false,
    currentPage:1,
    total:0,
    selectedRowKeys:[],
};

export default {
    namespace:'userList',
    state:initialState,
    effects:{
        *fetchUserList(action, { put, call, select }){
            let { user:{ companyId }} = yield select();
            let { currentPage } = action.payload || {};
            currentPage = currentPage || 1;
            yield put({ type:'toggleLoading'});
            let { data } = yield call(getUserList, { companyId, page:currentPage, pageSize:12 });
            if ( data && data.code === 200 ){
                yield put({ type:'getUserListResult', payload:{ data:data.data, total:data.total, currentPage }});
            }  
        },
        *addUserAsync(action, { call, put, select }){
            let { user:{ companyId }} = yield select();
            let { values, resolve, reject, forEdit } = action.payload || {};
            values.companyId = companyId;
            let { data } = yield call( forEdit ? updateUser : addUser, values);
            if ( data && data.code === 200 ){
                yield put({type:'fetchUserList' });
                if ( resolve ) resolve();
            } else {
                if ( reject ) reject(data.message);
            }
        },
        *delUserAsync(action, { call, put, all, select }){
            let { userList:{ selectedRowKeys }} = yield select();
            let { userId, resolve, reject } = action.payload;
            let { data }= yield call(delUser, { userIds:selectedRowKeys });
            if ( data && data.code === 200 ){
                if ( resolve ) resolve();
                yield put({ type:'fetchUserList' });
                yield put({ type:'setSelectedRowKeys', payload:[] });
            } else {
                reject(data.message);
            }
        },
        *updatePwdAsync(action, { call, put, select }){
            let { user:{ userInfo }} = yield select();
            let { values, resolve, reject } = action.payload; 
            let { data } = yield call(changePwd, { userId:userInfo.userId, userName:userInfo.userName, oldPassword:values.oldPassword, newPassword:values.newPassword });
            if ( data && data.code === 200 ) {
                if ( resolve && typeof resolve === 'function') resolve();
            } else {
                if ( reject ) reject(data.message);
            }
        },
        *fetchLogList(action, { call, put, select }){
            let { user:{ companyId }} = yield select();
            let { currentPage, operateType, operateUserName } = action.payload || {};
            currentPage = currentPage || 1;
            let params = { companyId, page:currentPage, pageSize:12 };
            if ( operateType ) {
                params.operateType = operateType;
            }
            if ( operateUserName ) {
                params.operateUserName = operateUserName;
            }    
            yield put({ type:'toggleLoading'});
            let { data } = yield call(getLogList, params);
            if ( data && data.code === 200 ){
                yield put({ type:'getLogListResult', payload:{ data:data.data, currentPage, total:data.total }});
            }
        }
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        setSelectedRowKeys(state, { payload }){
            return { ...state, selectedRowKeys:payload };
        },
        getUserListResult(state, { payload:{ data, total, currentPage }}){
            return { ...state, list:data, currentPage, total, isLoading:false };
        },
        getLogListResult(state, { payload:{ data, currentPage, total }}){
            return { ...state, list:data, currentPage, total, isLoading:false };
        },
        reset(){
            return initialState;
        }
    }
}

