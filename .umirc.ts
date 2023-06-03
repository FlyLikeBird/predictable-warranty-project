import { defineConfig } from 'umi';
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  dva: {},
  antd: {},
  dynamicImport: {},
  metas: [
    {
      httpEquiv: 'Cache-Control',
      content: 'no-cache',
    },
    {
      httpEquiv: 'Pragma',
      content: 'no-cache',
    },
    {
      httpEquiv: 'Expires',
      content: '0',
    },
  ],
  hash: true,
  routes: [
    { path: '/login', component: '@/pages/login_page' },
    // 代理商路由匹配
    // {
    //     path:'/agentMonitor',
    //     component:'@/pages/agent_manager/index',
    //     routes:[
    //         { path:'/agentMonitor', component:'@/pages/agent_manager/AgentMonitor'},
    //         { path:'/agentMonitor/entry', component:'@/pages/agent_manager/SceneEntry'},
    //         { path:'/agentMonitor/project', component:'@/pages/agent_manager/ProjectList'},
    //         { path:'/agentMonitor/alarm', component:'@/pages/agent_manager/AlarmManager'}
    //     ]
    // },
    {
      path: '/',
      component: '@/pages/index',
      routes: [
        // 设备监控模块
        {
          path: '/mach_manage',
          routes: [
            {
              path: '/mach_manage/mach_manage_sensor',
              component: '@/pages/mach_manage/SensorManager',
            },
            {
              path: '/mach_manage/mach_manage_archive',
              component: '@/pages/mach_manage/MachArchiveManager',
            },
            {
              path: '/mach_manage/mach_manage_running',
              component: '@/pages/mach_manage/MachRunningManager',
            },
          ],
        },
        // 告警监控模块
        {
          path: '/alarm_manage',
          routes: [
            {
              path: '/alarm_manage/alarm_manage_list',
              component: '@/pages/alarm_manage/AlarmList',
            },
            {
              path: '/alarm_manage/alarm_manage_analysis',
              component: '@/pages/alarm_manage/AlarmAnalysis',
            },
            {
              path: '/alarm_manage/alarm_manage_setting',
              component: '@/pages/alarm_manage/AlarmSetting',
            },
          ],
        },
        // 统计报表模块
        {
          path: '/data_report',
          routes: [
            {
              path: '/data_report/data_report_running',
              component: '@/pages/data_report/RunningReport',
            },
            {
              path: '/data_report/data_report_cost',
              component: '@/pages/data_report/CostReport',
            },
            {
              path: '/data_report/data_report_pdf',
              component: '@/pages/data_report/analysis_report',
            },
          ],
        },
        // 智慧运维
        {
          path: '/operation_manage',
          routes: [
            {
              path: '/operation_manage/operation_manage_maintain',
              component: '@/pages/operation_manage/MaintainManager',
            },
            {
              path: '/operation_manage/operation_manage_order',
              component: '@/pages/operation_manage/OrderManager',
            },
            {
              path: '/operation_manage/operation_manage_analysis',
              component: '@/pages/operation_manage/AnalysisManager',
            },
          ],
        },
        // 系统配置
        {
          path: '/sys_manage',
          routes: [
            {
              path: '/sys_manage/sys_manage_user',
              component: '@/pages/sys_manage/UserManager',
            },
            {
              path: '/sys_manage/sys_manage_role',
              component: '@/pages/sys_manage/RoleManager',
            },
            {
              path: '/sys_manage/sys_manage_log',
              component: '@/pages/sys_manage/LogManager',
            },
            {
              path: '/sys_manage/sys_manage_pwd',
              component: '@/pages/sys_manage/UpdatePwd',
            },
            {
              path: '/sys_manage/sys_manage_fee',
              component: '@/pages/sys_manage/FeerateManager',
            },
          ],
        },
        // 监控中心
        {
          path: '/global_monitor',
          routes: [
            {
              path: '/global_monitor/data_board',
              component: '@/pages/global_monitor/data_board',
            },
          ],
        },
        {
          path: '/',
          component: '@/pages/global_monitor/data_board',
        },
      ],
    },
  ],
  fastRefresh: {},
});
