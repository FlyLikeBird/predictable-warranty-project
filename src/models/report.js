import { 
    getRunningReport
} from '../services/reportService';

const initialState = {
    list:[],
    category:[
        { title:'加速度', unit:'g', dataIndex:'accelero/Peakmg', multi:true }, 
        { title:'平均速度', unit:'mm/s', dataIndex:'accelero/Rmsmg', multi:true },
        { title:'温度', unit:'℃', dataIndex:'temphumiSenval' },
        { title:'电压', unit:'V', dataIndex:'deviceBatteryvolt' },
        { title:'峭度', unit:'', dataIndex:'accelero/Kurtosis', multi:true },
        { title:'偏斜度', unit:'', dataIndex:'accelero/Skewness', multi:true },
        { title:'偏差度', unit:'', dataIndex:'accelero/Deviation', multi:true },
        { title:'峰值因子', unit:'', dataIndex:'accelero/Crestfactor', multi:true }
    ],
    dateColumn:[],
    currentPage:1,
    isLoading:false,
    total:0,
    detailInfo:{},
    chartInfo:{}
};

export default {
    namespace:'report',
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
        *fetchRunningReport(action, { put, select, call }){
            let { user:{ companyId, startDate, endDate }} = yield select();
            let { equipmentCode, currentPage } = action.payload || {};
            currentPage = currentPage || 1;
            let { data } = yield call(getRunningReport, { companyId, equipmentCode, beginDate:startDate.format('YYYY-MM-DD') + ' 00:00:00', endDate:endDate.format('YYYY-MM-DD') + ' 23:59:59', page:currentPage, pageSize:12 });
            if ( data && data.code === 200 ) {
                yield put({ type:'getRunningReportResult', payload:{ data:data.data, currentPage, total:data.total }});
            }
        }
        
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        getRunningReportResult(state, { payload:{ data, currentPage, total }}){
            let result = [], dateColumn = [];
            if ( data ) {
                Object.keys(data).forEach((key, index)=>{
                    if ( index === 0 ) {
                        if ( data[key] && data[key].length ) {
                            data[key].forEach(obj=>{
                                dateColumn.push(obj.recordTime);
                            })
                        }
                    }
                    result.push({ title:key, dateList:data[key] });
                })
            }
            
            return { ...state, list:result, dateColumn, currentPage, total };
        },
        
        reset(){
            return initialState;
        }
    }
}

