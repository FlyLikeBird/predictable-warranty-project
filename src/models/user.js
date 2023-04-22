import { routerRedux } from 'dva/router';
import { 
    login, userAuth, agentUserAuth, 
    fetchSessionUser, getNewThirdAgent, setCompanyLogo, 
    getWeather, getThirdAgentInfo, 
    getAlarmTypes, getTypeRule, setTypeRule
} from '../services/userService';
import { md5, encryptBy, decryptBy } from '../utils/encryption';
import moment from 'moment';

const companyReg =  /\?pid\=0\.\d+&&userId=(\d+)&&companyId=(\d+)&&mode=(\w+)/;
const agentReg = /\?agent=(.*)/;
const agentReg2 = /iot-(.*)/;

let date = new Date();
// 初始化socket对象，并且添加监听事件
function createWebSocket(url, fromAgent, dispatch){
    let ws = new WebSocket(url);
    // console.log(data);
    ws.onopen = function(){
        console.log('连接socket成功');
    };
    // ws.onclose = function(){
    //     console.log('socket close...');
    //     reconnect(url, data, companyId, dispatch);
    // };
    ws.onerror = function(){
        console.log('socket error...');
        reconnect(url, fromAgent, dispatch);
    };
    ws.onmessage = (e)=>{
        if ( dispatch ) {   
            if ( e.data && e.data.length > 10 ) {
                let data = JSON.parse(e.data);
                dispatch({ type:'user/setMsg', payload:{ data:data.data }})
            }                                 
        }
    }
    return ws;
}
let timer = null;
function reconnect(url, fromAgent, dispatch){
    if(reconnect.lock) return;
    reconnect.lock = true;
    timer = setTimeout(()=>{
        createWebSocket(url, fromAgent, dispatch);
        reconnect.lock = false;
    },5000)
}
let socket = null;
let menuData = [
    { menu_code:'global_monitor', menu_name:'监控中心', menu_id:1, child:[{ menu_code:'data_board', menu_name:'数据看板', menu_id:2 }]},
    { 
        menu_code:'mach_manage', 
        menu_name:'设备监控', 
        menu_id:3, 
        child:[
            { menu_code:'mach_manage_sensor', menu_name:'传感器', menu_id:100 },
            { menu_code:'mach_manage_archive', menu_name:'设备档案', menu_id:4 },
            { menu_code:'mach_manage_running', menu_name:'运行监控', menu_id:5 }
        ]
    },
    {
        menu_code:'alarm_manage',
        menu_name:'告警监控',
        menu_id:6,
        child:[
            { menu_code:'alarm_manage_list', menu_name:'告警列表', menu_id:7 },
            { menu_code:'alarm_manage_analysis', menu_name:'告警分析', menu_id:8 },
            { menu_code:'alarm_manage_setting', menu_name:'告警设置', menu_id:9 }
        ]
    },
    {
        menu_code:'data_report',
        menu_name:'数据报表',
        menu_id:10,
        child:[
            { menu_code:'data_report_running', menu_name:'运行报表', menu_id:11 },
            { menu_code:'data_report_cost', menu_name:'成本报表', menu_id:12 },
            { menu_code:'data_report_pdf', menu_name:'诊断报告', menu_id:16 }
        ]
    },
    {
        menu_code:'operation_manage',
        menu_name:'智慧运维',
        menu_id:13,
        child:[
            { menu_code:'operation_manage_maintain', menu_name:'保养计划', menu_id:14 },
            { menu_code:'operation_manage_order', menu_name:'工单列表', menu_id:15 }
        ]
    },
    {
        menu_code:'sys_manage',
        menu_name:'系统管理',
        menu_id:16,
        child:[
            { menu_code:'sys_manage_user', menu_name:'用户管理', menu_id:17 },
            // { menu_code:'sys_manage_role', menu_name:'角色权限', menu_id:18 },
            { menu_code:'sys_manage_log', menu_name:'系统日志', menu_id:19 },
            { menu_code:'sys_manage_pwd', menu_name:'修改密码', menu_id:20 },
            { menu_code:'sys_manage_fee', menu_name:'费率设置', menu_id:30 }
        ]
    }
]
const initialState = {
    userInfo:{},
    userMenu:[],
    companyList:[],
    // 全局的公司id
    companyId:'',
    currentCompany:{},
    currentMenu:{},
    // 配置动态路由
    routePath:[],
    routeConfig:{},
    authorized:false,
    isFrame:false,
    // socket实时告警消息
    msg:[],
    agentMsg:{},
    weatherInfo:'',
    // 全局属性告警类型
    alarmTypes:[],
    // 页面总宽度
    containerWidth:0,
    collapsed:false,
    pagesize:12,
    // 判断是否是中台打开的子窗口
    fromAgent:false,
    // 其他中台商ID，根据这个ID对登录页做特殊判断
    thirdAgent:{},
    newThirdAgent:{},
    // 浅色主题light 深色主题dark 
    theme:'light',
    startDate:moment(date),
    endDate:moment(date),
    timeType:'1',
    // 打开用户音频权限
    audioAllowed:false,
    // 小屏终端下 缩放比例 75%
    
};

export default {
    namespace:'user',
    state:initialState,
    subscriptions:{
        setup({ dispatch, history}) {
            history.listen(( location )=>{
                let pathname = location.pathname;
                // 登录接口
                if ( location.pathname === '/login' ) {
                    // let str = window.location.host.split('.');
                    // let matchResult = agentReg2.exec(str[0]);
                    // let temp = matchResult ? matchResult[1] : '';
                    // dispatch({ type:'fetchNewThirdAgent', payload:temp });
                    // return ;
                }
                if ( pathname !== '/login') {
                    new Promise((resolve, reject)=>{
                        dispatch({type:'userAuth', payload: { dispatch, query:location.search, resolve }})
                    })
                    .then(()=>{
                        // 更新当前页面路由的路径
                        dispatch({type:'setRoutePath', payload:pathname });                           
                    })   
                }
            })
        }
    },
    effects:{
        *userAuth(action, {call, select, put, all}){ 
            try {
                let { user: { userInfo, authorized, newThirdAgent }} = yield select();
                let { dispatch, query, resolve, reject } = action.payload || {};
                if ( !authorized ){
                    // 判断是否是服务商用户新开的公司标签页
                    let matchResult = companyReg.exec(query);
                    let companyId = matchResult ? matchResult[2] : ( localStorage.getItem('companyId') || null );
                    let userId = matchResult ? matchResult[1] : null;
                    let isFrame = matchResult && matchResult[3] === 'frame' ? true : false;
                    if ( localStorage.getItem('userId')) {
                        // localStorage中存储的状态设为全局状态
                        yield put({type:'setUserInfo', payload:{ 
                            data:{
                                userId:userId || localStorage.getItem('userId'),
                                userName:localStorage.getItem('userName'),
                                phone:localStorage.getItem('phone'),
                                companyId,
                                companyName:localStorage.getItem('companyName'),
                                menuList:JSON.parse(localStorage.getItem('menuList'))
                            }, 
                            fromAgent:matchResult ? true : false, 
                            isFrame 
                        }});
                        yield put({ type:'setContainerWidth' });
                        // yield put({type:'weather'});
                        if ( resolve && typeof resolve === 'function') resolve();
                        // websocket 相关逻辑
                        if ( !WebSocket ) {
                            window.alert('当前浏览器不支持websocket,推荐使用chrome浏览器');
                            return ;
                        }
                        let config = window.g;
                        if ( companyId ) {
                            socket = createWebSocket(`ws://${config.socketHost}:${config.socketPort}/websocket/${companyId}`, matchResult ? true : false, dispatch);
                        }
                       
                    } else {
                        yield put({ type:'loginOut'});
                    }                 
                } 
                if ( resolve && typeof resolve === 'function') resolve();
            } catch(err){
                console.log(err);
            }
        },
        // 中台用户登录时更新当前中台账号下所有企业用户的告警信息
        *updateAgentAlarm(action, { put, call, select }){
            let { data } = yield call(userAuth);
            if ( data && data.code === '0'){
                yield put({ type:'getAgentAlarm', payload:{ data:data.data }});
            }
        },
        *login(action,{ call, put, select }){
            try {
                let { values, resolve, reject } = action.payload || {};
                let { userName, password } = values;
                // password = md5(password, user_name);
                var { data }  = yield call(login, { userName, password });
                if ( data && data.code === 200 ){   
                    let {  companyId, companyName, userName, userId, phone, menuList, token } = data.data;
                    //  保存登录的时间戳,用户id,公司id 
                    localStorage.setItem('companyId', companyId);
                    localStorage.setItem('companyName', companyName);
                    localStorage.setItem('userId', userId);
                    localStorage.setItem('userName', userName);
                    localStorage.setItem('phone', phone);
                    localStorage.setItem('token', token);
                    localStorage.setItem('menuList', JSON.stringify( menuList || []));
                    yield put({ type:'setAudioAllowed' });
                    //  登录后跳转到默认页面               
                    // 跳转到项目列表页
                    yield put(routerRedux.push('/'));            
                } else {
                    if (reject) reject( data && data.message );
                }
            } catch(err){
                console.log(err);
            }
        },
        *weather(action,{call, put}){
            let { data } = yield call(getWeather);
            if ( data && data.code === '0' ) {
                yield put({type:'getWeather', payload:{data:data.data}});
            }
        },
        *loginOut(action, { call, put, select }){
            let { user:{ userInfo, thirdAgent }} = yield select();
            if ( socket && socket.close ){
                socket.close();
                socket = null;
            }
            if ( timer ) {
                clearTimeout(timer);
                timer = null;
            }
            yield put({type:'clearUserInfo'});
            yield put(routerRedux.push('/login'));
        },
        
        *fetchNewThirdAgent(action, { put, select, call}){
            let { data } = yield call(getNewThirdAgent, { agent_code:action.payload });
            if ( data && data.code === '0'){
                yield put({ type:'getNewThirdAgent', payload:{ data:data.data }});
            } else {

            }
        },
        
        *changeCompanyLogo(action, { put, call, select }){
            try {
                let { user:{ company_id }} = yield select();
                let { logoData, thumbLogoData, resolve, reject } = action.payload || {};
                let { data } = yield call(setCompanyLogo, { company_id, head_logo_path:logoData.filePath, mini_logo_path:thumbLogoData.filePath });
                if ( data && data.code === '0'){
                    let { user:{ currentCompany }} = yield select();
                    yield put({ type:'updateLogo', payload:{ ...currentCompany, head_logo_path:logoData.url, mini_logo_path:thumbLogoData.url }});
                    if ( resolve && typeof resolve === 'function') resolve();
                } else {
                    if ( reject && typeof reject === 'function') reject(data.msg);
                }
            } catch(err){   
                console.log(err);
            }
        }
    },
    reducers:{
        setUserInfo(state, { payload:{ data, fromAgent, isFrame }}){
            let { menuList, companyId } = data;
            let currentCompany = null;
            // let currentCompany = company_id ? companys.filter(i=>i.company_id == company_id)[0] : companys[0];
            // test
            menuList = menuData;
            let routeConfig = menuList.reduce((sum,menu)=>{
                sum[menu.menu_code] = {
                    menu_name:menu.menu_name,
                    menu_id:menu.menu_id,
                    menu_code:menu.menu_code,
                    children:menu.child && menu.child.length ? menu.child.map(i=>i.menu_id) : []
                }
                //  将菜单和子级菜单生成路由映射表
                if (menu.child && menu.child.length){
                    menu.child.map(subMenu=>{
                        sum[subMenu.menu_code] = {
                            menu_name:subMenu.menu_name,
                            menu_id:subMenu.menu_id,
                            menu_code:subMenu.menu_code,
                            parent:menu.menu_id
                        }                       
                    })
                }
                return sum;
            },{});
            // console.log(routeConfig);
            return { ...state, userInfo:data, userMenu:menuList, companyId, currentCompany:currentCompany || {}, routeConfig, fromAgent, authorized:true, isFrame };
        },
        setRoutePath(state, { payload }){
            let routes = payload.split('/').filter(i=>i);
            let { routeConfig } = state;  
            // console.log(routeConfig);
            let currentMenu;
            if ( payload === '/' ) {
                // 默认首页为数据看板页面
                currentMenu = routeConfig['data_board'];
                routes = [routeConfig['global_monitor'], routeConfig['data_board']];
            } else {
                currentMenu = routeConfig[routes[routes.length-1]] ? routeConfig[routes[routes.length - 1]] : {};
                
                routes = routes.map(route=>{
                    return routeConfig[route]
                });
            }
            console.log('change menu');
            return { ...state, routePath:routes, currentMenu : currentMenu || {} };
        },
        getAgentAlarm(state, { payload:{ data }}){
            return { ...state, userInfo:data };
        },
        getWeather(state, { payload :{data}}){
            return { ...state, weatherInfo:data }
        },
        setMsg(state, { payload : { data } }){
            // 根据count 字段判断是否需要更新告警信息
            return { ...state, msg:data };
        },
        setAgentMsg(state, { payload:{ data }}){
            return { ...state, agentMsg:data.detail };
        },
        setContainerWidth(state){
            let containerWidth = window.innerWidth;
            let containerHeight = window.innerHeight;
            return { ...state, containerWidth };
        },
        toggleTheme(state, { payload }) {
            return { ...state, theme:payload };
        },
        toggleTimeType(state, { payload }){
            let startDate, endDate;
            let date = new Date();
            if ( payload === '3'){
                // 小时维度
                startDate = endDate = moment(date);
            }
            if ( payload === '2'){
                // 日维度
                startDate = moment(date).startOf('month');
                endDate = moment(date).endOf('month');
            }
            if ( payload === '1'){
                // 月维度
                startDate = moment(date).startOf('year');
                endDate = moment(date).endOf('year');
            }
            if ( payload === '4' ){
                // 年维度
                startDate = moment(date).subtract(1,'years').startOf('year');
                endDate = moment(date);
            }
            if ( payload === '10' ){
                // 周维度  ，调整周的起始日从周日为周一
                startDate = moment(date).startOf('week').add(1, 'days');
                endDate = moment(date).endOf('week').add(1, 'days');
            }
            return { ...state, timeType:payload, startDate, endDate };
        },
        setDate(state, { payload:{ startDate, endDate }}){
            return { ...state, startDate, endDate };
        },
        toggleCollapsed(state){
            return { ...state, collapsed:!state.collapsed };
        },
        setThirdAgentInfo(state, { payload:{ data }}){
            return { ...state, thirdAgent:data };
        },
        getNewThirdAgent(state, { payload:{ data }}){
            return { ...state, newThirdAgent:data };
        },
        updateLogo(state, { payload }){
            return { ...state, currentCompany:payload };
        },
        setFromWindow(state, { payload:{ timeType, beginDate, endDate }}) {
            return { ...state, timeType, startDate:moment(new Date(beginDate)), endDate:moment(new Date(endDate))};
        },
        setAudioAllowed(state){
            return { ...state, audioAllowed:true };
        },
        getAlarmTypesResult(state, { payload:{ data }}){
            return { ...state, alarmTypes:data };
        },
        clearUserInfo(state){
            localStorage.clear();
            return initialState;
        }
    }
}

