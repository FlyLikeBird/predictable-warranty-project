import { routerRedux } from 'dva/router';
import { 
    login, userAuth, agentUserAuth, 
    fetchSessionUser, getNewThirdAgent, setCompanyLogo, 
    getWeather, getThirdAgentInfo, 
    getCameraAccessToken,
    getAlarmTypes, getTypeRule, setTypeRule
} from '../services/userService';

let list = [
    { 
        label:'总览看板', 
        key:0,
        dataCardList:[
            { title:'电机总数', isSelected:true, value:43, unit:'台', params:[{ text:'运行中', value:32, unit:'', color:'#63d17d' }, { text:'停机中', value:11, unit:'' }] },
            { title:'维保中电机数', isSelected:true, value:43, unit:'台', params:[{ text:'维修', value:32, unit:'' }, { text:'保养', value:11, unit:'' }] },
            { title:'维保超时电机数', isSelected:true, value:43, unit:'台',  params:[{ text:'维修', value:32, unit:'' }, { text:'保养', value:11, unit:'' }] },
            { title:'本月需维保电机数', isSelected:true, value:43, unit:'台', params:[{ text:'维修', value:32, unit:'' }, { text:'保养', value:11, unit:'' }] },
            { title:'今日需维保电机数', isSelected:true, value:43, unit:'台', params:[{ text:'维修', value:32, unit:'' }, { text:'保养', value:11, unit:'' }] },
            { title:'今日能耗成本', isSelected:true, value:3412, unit:'元', params:[{ text:'同比', value:34.5, unit:'%' }, { text:'环比', value:10.2, unit:'%' }] },

        ],
        chartCardList:[
            { title:'电机成本趋势', }
        ]
    }
]
const initialState = {
    boardList:list,
    currentIndex:0
};

export default {
    namespace:'board',
    state:initialState,
    effects:{

        *fetchAlarmTypes(action, { put, call, select }){
            try {
                let { data } = yield call(getAlarmTypes);
                if ( data && data.code === '0'){
                    yield put({ type:'getAlarmTypesResult', payload:{ data:data.data }});
                }
            } catch(err){
                console.log(err);
            }
        },
        
    },
    reducers:{
        updateBoardList(state, { payload }){
            return { ...state, boardList:payload };
        }
    }
}

