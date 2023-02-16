import { routerRedux } from 'dva/router';
import { 
    login, userAuth, agentUserAuth, 
    fetchSessionUser, getNewThirdAgent, setCompanyLogo, 
    getWeather, getThirdAgentInfo, 
    getCameraAccessToken,
    getAlarmTypes, getTypeRule, setTypeRule
} from '../services/userService';
import { md5, encryptBy, decryptBy } from '../utils/encryption';
import moment from 'moment';

const reg = /\/info_manage_menu\/manual_input\/([^\/]+)\/(\d+)/;
const companyReg =  /\?pid\=0\.\d+&&userId=(\d+)&&companyId=(\d+)&&mode=(\w+)/;
const agentReg = /\?agent=(.*)/;
const agentReg2 = /iot-(.*)/;

let date = new Date();
// 初始化socket对象，并且添加监听事件
function createWebSocket(url, data, companyId, fromAgent, dispatch){
    let ws = new WebSocket(url);
    // console.log(data);
    ws.onopen = function(){
        if ( data.agent_id && !fromAgent ){
            ws.send(`agent:${data.agent_id}`);
        } else {
            ws.send(`com:${companyId}`);
        }
    };
    // ws.onclose = function(){
    //     console.log('socket close...');
    //     reconnect(url, data, companyId, dispatch);
    // };
    ws.onerror = function(){
        console.log('socket error...');
        reconnect(url, data, companyId, dispatch);
    };
    ws.onmessage = (e)=>{
        if ( dispatch ) {   
            let data = JSON.parse(e.data); 
            // console.log(data);
            if ( data.type === 'company'){
                dispatch({ type:'setMsg', payload:{ data }});
            } else if ( data.type === 'agent'){
                dispatch({ type:'setAgentMsg', payload:{ data }})
            }                       
        }
    }
    return ws;
}
function reconnect(url, data, companyId, dispatch){
    if(reconnect.lock) return;
    reconnect.lock = true;
    setTimeout(()=>{
        createWebSocket(url, data, companyId, dispatch);
        reconnect.lock = false;
    },2000)
}
let socket = null;
let menuList = [
    { menu_code:'global_monitor', menu_name:'监控中心', menu_id:1, child:[{ menu_code:'data_board', menu_name:'数据看板', menu_id:2 }, { menu_code:'3d', menu_name:'3D可视化', menu_id:10 }]},
    { menu_code:'mach_manage', menu_name:'设备监控', menu_id:3, child:[{ menu_code:'mach_manage_archive', menu_name:'设备档案', menu_id:4 }]}
]
const initialState = {
    userInfo:{},
    userMenu:[],
    companyList:[],
    // 全局的公司id
    company_id:'',
    currentCompany:{},
    currentMenu:{},
    // 配置动态路由
    routePath:[],
    routeConfig:{},
    authorized:false,
    isFrame:false,
    // socket实时告警消息
    msg:{},
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
    audioAllowed:false
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
                    let str = window.location.host.split('.');
                    let matchResult = agentReg2.exec(str[0]);
                    let temp = matchResult ? matchResult[1] : '';
                    dispatch({ type:'fetchNewThirdAgent', payload:temp });
                    return ;
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
                    let company_id = matchResult ? matchResult[2] : null;
                    let user_id = matchResult ? matchResult[1] : null;
                    let isFrame = matchResult && matchResult[3] === 'frame' ? true : false;
                    if ( user_id ){
                        localStorage.setItem('user_id', user_id);
                    }
                    // let { data } = yield call( matchResult ? agentUserAuth : userAuth, matchResult ? { app_type:1, company_id } : { app_type:1 } );
                    // if ( data && data.code === '0' ){
                        // 先判断是否是第三方代理商账户
                        // if ( !Object.keys(newThirdAgent).length ) {
                        //     let str = window.location.host.split('.');
                        //     let matchResult = agentReg2.exec(str[0]);
                        //     let temp = matchResult ? matchResult[1] : '';
                        //     yield put({ type:'fetchNewThirdAgent', payload:temp });
                        // }
                        // yield put.resolve({ type:'fetchAlarmTypes'});
                        yield put({type:'setUserInfo', payload:{ data:{}, company_id, fromAgent:matchResult ? true : false, isFrame } });
                        yield put({ type:'setContainerWidth' });
                        // yield put({type:'weather'});
                        if ( resolve && typeof resolve === 'function') resolve();
                        // websocket 相关逻辑
                        if ( !WebSocket ) {
                            window.alert('当前浏览器不支持websocket,推荐使用chrome浏览器');
                            return ;
                        }
                        // let config = window.g;
                        // let socketCompanyId = company_id ? company_id : data.data.companys.length ? data.data.companys[0].company_id : null ;
                        // socket = createWebSocket(`ws://${config.socketHost}:${config.socketPort}`, data.data, socketCompanyId, matchResult ? true : false, dispatch);
                        
                    // } else {
                    //     // 登录状态过期，跳转到登录页重新登录(特殊账号跳转到特殊登录页)
                    //     yield put({ type:'loginOut'});
                    // }
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
                let { user_name, password } = action.payload;
                let { user:{ thirdAgent} } = yield select();
                let { resolve, reject } = action;
                // if ( localStorage.getItem('user_id')){
                //     message.info('已有登录用户，请进入主页先退出再登录')
                //     return;
                // }
               
                password = md5(password, user_name);
                var { data }  = yield call(login, {user_name, password});
                if ( data && data.code === '0'){   
                    let { user_id, user_name, agent_id, companys } = data.data;
                    let companysMap = companys.map((item)=>{
                        return { [encodeURI(item.company_name)]:item.company_id };
                    })
                    let timestamp = parseInt(new Date().getTime()/1000);
                    //  保存登录的时间戳,用户id,公司id 
                    localStorage.setItem('timestamp', timestamp);
                    localStorage.setItem('user_id', user_id);
                    localStorage.setItem('user_name', user_name);
                    localStorage.setItem('companysMap', JSON.stringify(companysMap));
                    localStorage.setItem('agent_id', agent_id);
                    localStorage.setItem('third_agent', JSON.stringify(thirdAgent));
                    yield put({ type:'setAudioAllowed' });
                    //  登录后跳转到默认页面
                    // 如果是服务商用户则跳转到中台监控页
                    if ( agent_id ) {
                        yield put(routerRedux.push('/agentMonitor'));
                    } else {
                        // 跳转到项目列表页
                        yield put(routerRedux.push('/energy'));
                    }
                } else {
                    if (reject) reject( data && data.msg );
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
            yield put({type:'clearUserInfo'});
            yield put({ type:'fields/cancelAll'});
            yield put(routerRedux.push('/login'));
            if ( socket && socket.close ){
                socket.close();
                socket = null;
            }
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
        },
        *fetchSession(action, { put, call, select }){
            let { sid } = action.payload || {};
            let { data } = yield call(fetchSessionUser, { sid });
            if ( data && data.code === '0'){
                let { user:{ newThirdAgent }} = yield select();
                let { user_id, user_name, agent_id, companys } = data.data;
                let companysMap = companys.map((item)=>{
                    return { [encodeURI(item.company_name)]:item.company_id };
                })
                let timestamp = parseInt(new Date().getTime()/1000);
                //  保存登录的时间戳,用户id,公司id 
                localStorage.setItem('timestamp', timestamp);
                localStorage.setItem('user_id', user_id);
                localStorage.setItem('user_name', user_name);
                localStorage.setItem('companysMap', JSON.stringify(companysMap));
                localStorage.setItem('agent_id', agent_id);
                yield put({ type:'setUserInfo', payload:{ data:data.data, company_id:null, fromAgent:null, authorized:false }});
                yield put(routerRedux.push('/'));

            }
        },
        *fetchAlarmTypes(action, { put, call, select }){
            try {
                let { data } = yield call(getAlarmTypes);
                if ( data && data.code === '0'){
                    yield put({ type:'getAlarmTypesResult', payload:{ data:data.data }});
                }
            } catch(err){
                console.log(err);
            }
        }
    },
    reducers:{
        setUserInfo(state, { payload:{ data, company_id, fromAgent, isFrame }}){
            let { menuData, companys } = data;
            let currentCompany = null;
            // let currentCompany = company_id ? companys.filter(i=>i.company_id == company_id)[0] : companys[0];
            menuData = menuList;
            // test
            let routeConfig = menuData.reduce((sum,menu)=>{
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
            return { ...state, userInfo:data, userMenu:menuData, companyList:companys || [], company_id: currentCompany && currentCompany.company_id, currentCompany:currentCompany || {}, routeConfig, fromAgent, authorized:true, isFrame };
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
            if ( state.msg.count !== data.count ){
                return { ...state, msg:data };
            } else {
                return state;
            }
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
            if ( payload === '1'){
                // 小时维度
                startDate = endDate = moment(date);
            }
            if ( payload === '2'){
                // 日维度
                startDate = moment(date).startOf('month');
                endDate = moment(date).endOf('month');
            }
            if ( payload === '3'){
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

