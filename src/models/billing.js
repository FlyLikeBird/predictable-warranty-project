import {  
    getRateInfo, editRateInfo
} from '../services/billingService';
import moment from 'moment';

const initialState = {
    isLoading:false,
    rateInfo:{}
};

export default {
    namespace:'billing',
    state:initialState,
    effects:{
        *fetchRateInfo(action, { select, call, put }){
            let { user:{ companyId }} = yield select();
            let { data } = yield call(getRateInfo, { companyId });
            if ( data && data.code === 200 ){
                yield put({ type:'getRateInfoResult', payload:{ data:data.data }})
            }
        },  
        *editRateAsync(action, { select, call, put }){
            let { user:{ userInfo }} = yield select();
            let { values, resolve, reject } = action.payload || {};
            let { data } = yield call(editRateInfo, { ...values, companyId:userInfo.companyId, companyName:userInfo.companyName});
            if ( data && data.code === 200 ){
                yield put({ type:'fetchRateInfo'});
                resolve();
            } else {
                reject(data.messsage);
            }
        }
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        getRateInfoResult(state, { payload:{ data }}){
            return { ...state, rateInfo:data || {}};
        },
        setPageNum(state, { payload }){
            return { ...state, pageNum:payload };
        },
        reset(state){
            return initialState;
        }
    }
}


