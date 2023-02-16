import { defineConfig } from 'umi';
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  dva:{},
  antd:{},
  dynamicImport:{},
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
  hash:true,
  routes: [
    { path:'/login', component:'@/pages/login_page' },
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
        path:'/' ,
        component:'@/pages/index',
        routes:[
            // 设备监控模块
            // {
            //     path:'/mach_manage',
            //     routes:[
            //         { path:'/mach_manage/mach_manage_archive', component:'@/pages/mach_manage/MachArchiveManager'}
            //     ]
            // },
           
            // // 统计报表模块
            // {
            //     path:'/energy/stat_report',
            //     routes:[
            //         { path:'/energy/stat_report/energy_code_report', component:'@/pages/energy_manager/MeterReportManager'},
            //         { path:'/energy/stat_report/energy_cost_report', component:'@/pages/energy_manager/CostReportManager'},
            //         { path:'/energy/stat_report/extreme', component:'@/pages/stat_report/ExtremeReport/ExtremeReport'},
            //         { path:'/energy/stat_report/ele_report', component:'@/pages/stat_report/EleReport/index'},
            //         { path:'/energy/stat_report/sameReport', component:'@/pages/stat_report/SameRateReport/index'},
            //         { path:'/energy/stat_report/adjoinReport', component:'@/pages/stat_report/AdjoinRateReport/index'},
            //         { path:'/energy/stat_report/timereport', component:'@/pages/stat_report/TimeEnergyReport/index'},
            //     ]
            // },
            // // 信息管理
            // {
            //     path:'/energy/info_manage_menu',
            //     routes:[
            //         { path:'/energy/info_manage_menu/incoming_line', component:'@/pages/info_manager/IncomingLineManager'},
            //         { path:'/energy/info_manage_menu/quota_manage', component:'@/pages/info_manager/QuotaManager'},
            //         { path:'/energy/info_manage_menu/manual_input', component:'@/pages/info_manager/ManuallyPage/ManualInfoList'},
            //         { path:'/energy/info_manage_menu/manual_input/operateInfo/:id', component:'@/pages/info_manager/ManuallyPage/ManualManager'},
            //         { path:'/energy/info_manage_menu/manual_input/manualMeter/:id', component:'@/pages/info_manager/ManuallyPage/ManualManager'},
            //         { path:'/energy/info_manage_menu/free_manage', component:'@/pages/info_manager/BillingManager'},
            //         { path:'/energy/info_manage_menu/field_manage', component:'@/pages/info_manager/FieldManager'},
            //         { path:'/energy/info_manage_menu/worktime_manage', component:'@/pages/info_manager/WorktimeManager'},

            //     ]
            // },
            // // 系统配置
            // {
            //     path:'/energy/system_config',
            //     routes:[
            //         { path:'/energy/system_config/role_manage', component:'@/pages/system_config/RoleManager'},
            //         { path:'/energy/system_config/user_manage', component:'@/pages/system_config/AdminManager'},
            //         { path:'/energy/system_config/system_log', component:'@/pages/system_config/SystemLog'},
            //         { path:'/energy/system_config/update_password', component:'@/pages/system_config/UpdatePassword'}
            //     ]
            // },
            // 监控中心
            {
                path:'/global_monitor',
                routes:[
                    { path:'/global_monitor/data_board', component:'@/pages/global_monitor/data_board' }
                ]
            },
            {
                path:'/',
                component:'@/pages/global_monitor/data_board'
            }
        ]
    }
  ],
  fastRefresh: {},
});
