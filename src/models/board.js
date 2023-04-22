import { 
    getBoardList, updateBoardList,
    getMachStatus, getSumAlarm,
    getMachWarningRank, 
    getMachWarningTrend,
    getCostTrend
} from '../services/boardService';
import { getAlarmTrend } from '../services/alarmService';
import moment from 'moment';

let list = [
    { 
        label:'总览看板', 
        key:0,
        dataCardList:[
            { key:'a', a:1 },
            { key:'b', a:1 },
            { key:'c', a:1 },
            { key:'d', a:1 },
            { key:'e', a:1 },
            { key:'f', a:1 },
            { key:'g', a:1 },
            { key:'h', a:1 },
            { key:'i', a:1 },
            { key:'j', a:1 },
            { key:'k', a:1 },
            { key:'l', a:1 },
            { key:'m', a:1 },
            { key:'n', a:1 }
        ],
        chartCardList:[
            { key:'A', a:1 },
            { key:'B', a:1 },
            { key:'C', a:1 },
            { key:'D', a:1 },
            { key:'E', a:1 },
            { key:'F', a:1 }
        ]
    }
]

const initialState = {
    boardList:list,
    currentIndex:0,
    fieldMaps:{
        'a':{ title:'设备总数', dataIndex:'plus', unit:'台', subTitle:[{ title:'运行中', dataIndex:'0', unit:'' },{ title:'停机中', dataIndex:'1', unit:'' }]},
        'b':{ title:'维保中电机数' },
        'c':{ title:'维保超时电机数' },
        'd':{ title:'本月需维保电机数' },
        'e':{ title:'今日需维保电机数' },
        'f':{ title:'今日预警', color:'#ff7d00', dataIndex:'warningCount', unit:'件', subTitle:[{ hasArrow:true, title:'同比', dataIndex:'yoy', unit:'%' }, { hasArrow:true, title:'环比', dataIndex:'chain', unit:'%' }] },
        'g':{ title:'今日告警', color:'#f53f3f', dataIndex:'warningCount', unit:'件', subTitle:[{ hasArrow:true, title:'同比', dataIndex:'yoy', unit:'%' }, { hasArrow:true, title:'环比', dataIndex:'chain', unit:'%' }] },
        'h':{ title:'本月预警', color:'#ff7d00', dataIndex:'warningCount', unit:'件', subTitle:[{ hasArrow:true, title:'同比', dataIndex:'yoy', unit:'%' }, { hasArrow:true, title:'环比', dataIndex:'chain', unit:'%' }] },
        'i':{ title:'本月告警', color:'#f53f3f', dataIndex:'warningCount', unit:'件', subTitle:[{ hasArrow:true, title:'同比', dataIndex:'yoy', unit:'%' }, { hasArrow:true, title:'环比', dataIndex:'chain', unit:'%'}] },
        'j':{ title:'本年预警', color:'#ff7d00', dataIndex:'warningCount', unit:'件', subTitle:[{ hasArrow:true, title:'同比', dataIndex:'yoy', unit:'%' }, { hasArrow:true, title:'环比', dataIndex:'chain', unit:'%'}] },
        'k':{ title:'本年告警', color:'#f53f3f', dataIndex:'warningCount', unit:'件', subTitle:[{ hasArrow:true, title:'同比', dataIndex:'yoy', unit:'%' }, { hasArrow:true, title:'环比', dataIndex:'chain', unit:'%'}] },
        'l':{ title:'今日成本', dataIndex:'totalCost', unit:'元', subTitle:[{ title:'电费成本', dataIndex:'eleCost', unit:'元'}, { title:'维保成本', dataIndex:'maintainCost', unit:'元'}] },
        'm':{ title:'本月成本', dataIndex:'totalCost', unit:'元', subTitle:[{ title:'电费成本', dataIndex:'eleCost', unit:'元'}, { title:'维保成本', dataIndex:'maintainCost', unit:'元'}] },
        'n':{ title:'本年成本', dataIndex:'totalCost', unit:'元', subTitle:[{ title:'电费成本', dataIndex:'eleCost', unit:'元'}, { title:'维保成本', dataIndex:'maintainCost', unit:'元'}] },
    },
    chartMaps:{
        'A':'设备成本趋势',
        'B':'设备异常排名',
        'C':'设备异常趋势',
        'D':'实时告警',
        'E':'平台告警趋势',
        'F':'设备维保成本排名'
    },
    // 数据卡片状态
    statusSourceData:{},
    // 图表卡片状态
    chartSourceData:{},

};
let date = new Date();
export default {
    namespace:'board',
    state:initialState,
    effects:{
        *initBoard(action, { put, select }){
            yield put({ type:'fetchBoardList'});
            yield put({ type:'fetchMachStatus', payload:{ type:['a'], map:['plus'] }});
            // 今日告警信息
            yield put({ type:'fetchSumAlarm', payload:{ type:['f', 'g'], map:['0', '1'], startDate:moment(date), endDate:moment(date) }});
            // 本月告警信息
            yield put({ type:'fetchSumAlarm', payload:{ type:['h', 'i'], map:['0', '1'], startDate:moment(date).startOf('month'), endDate:moment(date).endOf('month') }});
            // 本年告警信息
            yield put({ type:'fetchSumAlarm', payload:{ type:['j', 'k'], map:['0', '1'], startDate:moment(date).startOf('year'), endDate:moment(date).endOf('year') }});
            // 本月成本信息
            yield put({ type:'fetchMachCost', payload:{ type:'l', startDate:moment(date), endDate:moment(date), timeType:'3' }})
            yield put({ type:'fetchMachCost', payload:{ type:'m', startDate:moment(date).startOf('month'), endDate:moment(date).endOf('month'), timeType:'2' }})
            yield put({ type:'fetchMachCost', payload:{ type:'n', startDate:moment(date).startOf('year'), endDate:moment(date).endOf('year'), timeType:'1' }})
        },
        // 更新看板列表状态
        *updateBoardListAsync(action, { put, select, call }){
            let { user:{ companyId }} = yield select();
            let { resolve, reject, json } = action.payload || {};
            let { data } = yield call(updateBoardList, { companyId, dashboardsDetail:json });
            if ( data && data.code === 200 ){
                yield put({ type:'fetchBoardList' });
                if ( resolve ) resolve();
            } else {
                if ( reject ) reject(data.message);
            }
        },
        *fetchBoardList(action, { put, select, call }){
            let { user:{ companyId }} = yield select();
            let { data } = yield call(getBoardList, { companyId });
            if ( data && data.code === 200 ){
                yield put({ type:'getBoardListResult', payload:{ data:data.data }});
            }
        },
        // 数据卡片接口
        *fetchMachStatus(action, { put, call, select }){
            let { user:{ companyId }} = yield select();
            let { type, map } = action.payload || {};
            let { data } = yield call(getMachStatus, { companyId });
            if ( data && data.code === 200 ){
                yield put({ type:'getStatusDataResult', payload:{ data:data.data, type, map }});
            }            
        },
        *fetchSumAlarm(action, { put, call, select }){
            let { user:{ companyId }} = yield select();
            let { type, map, startDate, endDate } = action.payload || {};
            let { data } = yield call(getSumAlarm, { companyId, beginDate:startDate.format('YYYY-MM-DD'), endDate:endDate.format('YYYY-MM-DD')});
            if ( data && data.code === 200 ){
                yield put({ type:'getStatusDataResult', payload:{ data:data.data, type, map }})
            }
        },
        *fetchMachCost(action, { put, call, select }){
            let { user:{ companyId }} = yield select();
            let { startDate, endDate, timeType, type } = action.payload || {};
            let { data } = yield call(getCostTrend, { companyId, beginDate:startDate.format('YYYY-MM-DD'), endDate:endDate.format('YYYY-MM-DD'), timeType });
            if ( data && data.code === 200 ){
                yield put({ type:'getMachCostResult', payload:{ data:data.data, type }});
            }
        },
        // 图表卡片接口
        *fetchWarningRank(action, { put, call, select }){
            let { user:{ companyId } } = yield select();
            let { startDate, endDate } = action.payload || {};
            let { data } = yield call(getMachWarningRank, { companyId, beginDate:startDate.format('YYYY-MM-DD'), endDate:endDate.format('YYYY-MM-DD') });
            if ( data && data.code === 200 ) {
                yield put({ type:'getChartDataResult', payload:{ data:data.data, type:'B' }});
            }
        },
        *fetchWarningTrend(action, { put, call, select }){
            let { user:{ companyId }} = yield select();
            let { startDate, endDate, timeType } = action.payload || {};
            timeType = timeType === '10' ? '2' : timeType;
            let { data } = yield call(getMachWarningTrend, { companyId, timeType, beginDate:startDate.format('YYYY-MM-DD'), endDate:endDate.format('YYYY-MM-DD') });
            if ( data && data.code === 200 ) {
                yield put({ type:'getChartDataResult', payload:{ data:data.data, type:'C' }});
            }
        },
        *fetchAlarmTypes(action, { select, call, put }){
            let { user:{ companyId }} = yield select();
            let { startDate, endDate, timeType } = action.payload || {};
            timeType = timeType === '10' ? '2' : timeType;
            let { data } = yield call(getAlarmTrend, { companyId, timeType, beginDate:startDate.format('YYYY-MM-DD'), endDate:endDate.format('YYYY-MM-DD')});
            if ( data && data.code === 200 ){
                yield put({ type:'getChartDataResult', payload:{ data:data.data, type:'E' }});                
            }
        },  
        *fetchCostTrend(action, { put, call, select }){
            let { user:{ companyId }} = yield select();
            let { startDate, endDate, timeType } = action.payload || {};
            timeType = timeType === '10' ? '2' : timeType;
            let { data } = yield call(getCostTrend, { companyId, beginDate:startDate.format('YYYY-MM-DD'), endDate:endDate.format('YYYY-MM-DD'), timeType });
            if ( data && data.code === 200 ) {
                yield put({ type:'getChartDataResult', payload:{ data:data.data, type:'A'}});
            }
        }
    },
    reducers:{
        getBoardListResult(state, { payload:{ data }}){      
            return { ...state, boardList:data && data.dashboardsDetail ? JSON.parse(data.dashboardsDetail) : state.boardList };
        },
        setCurrentIndex(state, { payload }){
            return { ...state, currentIndex:payload };
        },
        getStatusDataResult(state, { payload:{ data, type, map }}){
            // 将汇总返回的字段根据KEY值分配给对应key的数据卡片
            let result = { ...state.statusSourceData };
            type.forEach((item, index)=>{
                if ( data[map[index]] ) {
                    // 分配data给对应key的卡片
                    result[item] = data[map[index]] || data;
                } else if ( map[index] === 'plus' ){
                    // 累加总设备数
                    let sum = 0;
                    Object.keys(data).forEach(key=>{
                        sum += data[key];
                    })
                    data.plus = sum;
                    result[item] = data;
                } else if ( map[index] === 'subtract' ){

                }
            });
            return { ...state, statusSourceData:result };
        },
        getMachCostResult(state, { payload:{ data, type }}){
            let result = { ...state.statusSourceData };
            let totalCost = 0, eleCost = 0, maintainCost = 0;
            data.forEach((item)=>{
                eleCost += ( item.electricityCost || 0 ) ;
                maintainCost += ( item.maintenanceCost || 0 );
            })
            result[type] = { totalCost:eleCost + maintainCost, eleCost, maintainCost };
            return { ...state, statusSourceData:result };
        },
        getChartDataResult(state, { payload:{ data, type }}){
            let result = { ...state.chartSourceData };
            result[type] = data;
            return { ...state, chartSourceData:result };
        },
       
        reset(){
            return initialState;
        }
    }
}

