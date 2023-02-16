import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { Link } from 'umi';
import { Menu, Tooltip, Button } from 'antd';
import { InteractionOutlined, UserOutlined, BarsOutlined, DashboardOutlined, ThunderboltOutlined, FileTextOutlined, SettingOutlined, SearchOutlined, FormOutlined, AreaChartOutlined, AccountBookOutlined, BarChartOutlined, PrinterOutlined, ScheduleOutlined, ProfileOutlined, PullRequestOutlined, AlertOutlined, DesktopOutlined } from '@ant-design/icons';
import style from './Menu.css';

const { SubMenu } = Menu;
const IconsObj = {
    'global_monitor':<DesktopOutlined />,
    'ele_monitor_menu':<DashboardOutlined />,
    'agent_monitor':<DesktopOutlined />,
    'agent_company':<BarsOutlined />,
    'user_manage':<UserOutlined />,
    'energy_manage':<AccountBookOutlined />,
    'coal_manage':<InteractionOutlined />,
    'info_manage_menu':<FormOutlined />,
    'mach_manage':<PullRequestOutlined />,
    'system_log':<ProfileOutlined />,
    'ele_quality':<ThunderboltOutlined />,
    'energy_eff':<BarChartOutlined />,
    'alarm_manage':<AlertOutlined />,
    'stat_report':<FileTextOutlined />,
    'system_config':<SettingOutlined />,
    'analyze_manage':<SearchOutlined />
}

// let stationMaps = {
//     // 配电房子站
//     '83':'localhost:8100',
//     '121':'localhost:8003'
// }
let stationMaps = {
    // 配电房子站
    '83':'pr',
    '121':'acs',
}

const MenuComponent = ({ userMenu, currentMenu, userInfo, theme })=>{
    const [openKeys, setOpenKeys] = useState([]);
    useEffect(()=>{
        setOpenKeys( currentMenu.children ? [currentMenu.menu_id + '' ] : [currentMenu.parent + '']);
    },[currentMenu]);

    let option = {
        mode:'inline',
        className: theme === 'dark' ? style['container'] + ' ' + style['dark'] : style['container'],
        selectedKeys:[currentMenu.menu_id + ''],
        openKeys
    }
    return (
            <Menu
                {...option}
            >                
                {
                    userMenu.map(item => (
                        item.child && item.child.length
                        ?
                        <SubMenu 
                            key={item.menu_id}
                            onTitleClick={()=>{
                                if ( openKeys.filter(i=>i == item.menu_id).length ) {
                                    setOpenKeys([]);
                                    return;
                                } else {
                                    setOpenKeys([item.menu_id + '']);   
                                }
                                if ( item.menu_id !== currentMenu.menu_id ) {
                                    // 选中父级菜单默认选中第一项子级菜单
                                    history.push(`/${item.menu_code}/${item.child[0].menu_code}`);
                                }
                            }} 
                            title={
                            <div>
                                { IconsObj[item.menu_code] }
                                <span className={style['menu-name']}>{ item.menu_name }</span>
                                <span className={style['arrow-button']}></span>
                            </div>
                        } >                      
                            {
                                item.child.map(sub => (
                                    
                                    <Menu.Item key={sub.menu_id}>
                                        {
                                            item.menu_id === 79 
                                            ?
                                            <Tooltip placement="right" title={                                               
                                                <Button type='primary' size='small' onClick={(e)=>{
                                                    if ( stationMaps[sub.menu_id]){
                                                        e.stopPropagation();
                                                        // 兼容第三方服务商的location跳转
                                                        let temp = location.host.split('-');
                                                        let prefix = temp.length === 2 ? temp[1].split('.')[0] : '';
                                                        let linkPath = ( prefix ? stationMaps[sub.menu_id] + '-' + prefix : stationMaps[sub.menu_id] ) + '.h1dt.com';
                                                        // let linkPath = ( prefix ? stationMaps[sub.menu_id] + '-' + prefix : stationMaps[sub.menu_id] ) + '';
                                                        window.open(`http://${linkPath}?pid=${Math.random()}&&userId=${userInfo.user_id}&&companyId=${company_id}&&mode=full`);
                                                    }                                          
                                                }}>{`进入${sub.menu_name}`}</Button>
                                            }>
                                                <Link to={`/${item.menu_code}/${sub.menu_code}`} >{sub.menu_name}</Link>
                                            </Tooltip>
                                            :
                                            <Link to={`/${item.menu_code}/${sub.menu_code}`} >{sub.menu_name}</Link>

                                        }
                                                                           
                                    </Menu.Item>
                                   
                                ))
                            }
                        </SubMenu>
                        :
                        <Menu.Item key={item.menu_id}>
                            { IconsObj[item.menu_code] }
                            <span>
                                <Link to={`/${item.menu_code}`} >{ item.menu_name }</Link>
                            </span>
                        </Menu.Item>
                    ))
                }   
            </Menu>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.userMenu !== nextProps.userMenu || prevProps.currentMenu !== nextProps.currentMenu || prevProps.userInfo !== nextProps.userInfo || prevProps.theme !== nextProps.theme ) {
        return false;
    } else {
        return true;
    }
}

export default React.memo(MenuComponent, areEqual);