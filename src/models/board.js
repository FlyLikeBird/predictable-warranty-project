import { 
    getBoardList, updateBoardList,
    getMachStatus, getSumAlarm,
    getMachWarningRank, 
    getMachWarningTrend
} from '../services/boardService';
import { } from '../services/alarmService';
import moment from 'moment';
// let list = [
//     { 
//         label:'总览看板', 
//         key:0,
//         dataCardList:[
//             { title:'电机总数', isSelected:true, value:43, unit:'台', params:[{ text:'运行中', value:32, unit:'', color:'#63d17d' }, { text:'停机中', value:11, unit:'' }] },
//             { title:'维保中电机数', isSelected:true, value:43, unit:'台', params:[{ text:'维修', value:32, unit:'' }, { text:'保养', value:11, unit:'' }] },
//             { title:'维保超时电机数', isSelected:true, value:43, unit:'台',  params:[{ text:'维修', value:32, unit:'' }, { text:'保养', value:11, unit:'' }] },
//             { title:'本月需维保电机数', isSelected:true, value:43, unit:'台', params:[{ text:'维修', value:32, unit:'' }, { text:'保养', value:11, unit:'' }] },
//             { title:'今日需维保电机数', isSelected:true, value:43, unit:'台', params:[{ text:'维修', value:32, unit:'' }, { text:'保养', value:11, unit:'' }] },
//             { title:'今日能耗成本', isSelected:true, value:3412, unit:'元', params:[{ text:'同比', value:34.5, unit:'%' }, { text:'环比', value:10.2, unit:'%' }] },

//         ],
//         chartCardList:[
//             { title:'电机成本趋势', key:'mach-cost', isSelected:true },
//             { title:'电机异常排名', key:'mach-alarm-rank', isSelected:true },
//             { title:'电机异常趋势', key:'mach-alarm-trend', isSelected:true },
//             { title:'实时告警', key:'realtime-alarm', isSelected:true },
//             { title:'平台告警趋势', key:'total-alarm', isSelected:true },
//             { title:'电机维保成本排名', key:'multi-cost', isSelected:true }
//         ]
//     }
// ]

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
            { key:'k', a:1 }
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
        'a':{ title:'电机总数', dataIndex:'plus', unit:'台', subTitle:[{ title:'运行中', dataIndex:'0', unit:'' },{ title:'停机中', dataIndex:'1', unit:'' }]},
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
    },
    chartMaps:{
        'A':'电机成本趋势',
        'B':'电机异常排名',
        'C':'电机异常趋势',
        'D':'实时告警',
        'E':'平台告警趋势',
        'F':'电机维保成本排名'
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
            let { user:{ startDate, endDate }} = yield select();
            yield put({ type:'fetchWarningRank', payload:{ startDate, endDate }});
            yield put({ type:'fetchWarningTrend', payload:{ startDate, endDate, timeType:'2' }});
            yield put({ type:'fetchSumWarning', payload:{ startDate, endDate, timeType:'2' }});
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
            let { data } = yield call(getMachWarningTrend, { companyId, timeType, beginDate:startDate.format('YYYY-MM-DD'), endDate:endDate.format('YYYY-MM-DD') });
            if ( data && data.code === 200 ) {
                yield put({ type:'getChartDataResult', payload:{ data:data.data, type:'C' }});
            }
        },
        *fetchSumWarning(action, { put, call, select }){
            let { user:{ companyId }} = yield select();
            let { startDate, endDate, timeType } = action.payload || {};
            let { data } = yield call(getMachWarningTrend, { companyId, timeType, beginDate:startDate.format('YYYY-MM-DD'), endDate:endDate.format('YYYY-MM-DD') });
            if ( data && data.code === 200 ) {
                yield put({ type:'getChartDataResult', payload:{ data:data.data, type:'E' }});
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

