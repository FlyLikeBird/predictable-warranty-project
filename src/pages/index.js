import React, { useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import { connect } from 'dva';
import { Link, Route, Switch, Redirect } from 'dva/router';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import style from './IndexPage.css';
import Menu from '../components/Menu';
import Header from '../components/Header';

function isFullscreen(){
    return document.fullscreenElement    ||
           document.msFullscreenElement  ||
           document.mozFullScreenElement ||
           document.webkitFullscreenElement || false;
}

function ProjectIndex({ dispatch, user, children }){
    let { routePath, userMenu,  currentMenu, userInfo, authorized, fromAgent, currentCompany, collapsed, containerWidth, msg, theme } = user;
    const containerRef = useRef();
    useEffect(()=>{
        function handleResize(){
            dispatch({ type:'user/setContainerWidth'});
        }
        window.addEventListener('resize', handleResize);
        return ()=>{
            window.removeEventListener('resize', handleResize);
            
        }
    },[]);
    let isFulled = isFullscreen();
    return (  
        <div 
            ref={containerRef}
            className={
                theme === 'light' 
                ?
                style['container']
                :
                theme === 'dark' 
                ?
                style['container'] + ' ' + style['dark']
                :
                style['container']
            }
        > 
            {
                authorized
                ?
                <div style={{ height:'100%' }}>
                    <Header onDispatch={action=>dispatch(action)} routePath={routePath} userInfo={userInfo} msg={msg} theme={theme}  />
                    <div className={style['main-content']}>
                        {
                            collapsed 
                            ?
                            <div onClick={()=>{
                                dispatch({ type:'user/toggleCollapsed' });
                            }} style={{ cursor:'pointer', position:'absolute', zIndex:'2', left:'0', bottom:'1rem', background:'#fff', padding:'4px 6px' }}>
                                <MenuUnfoldOutlined style={{ color:'#777d88' }} />
                            </div>
                            :
                            null 
                        }
                        <div className={ theme==='dark' ? style['sidebar-container'] + ' ' + style['dark'] : style['sidebar-container']} style={{ width:collapsed ? '0' : '10%' }} >
                            <Menu userMenu={userMenu} currentMenu={currentMenu} userInfo={userInfo} theme={theme} />
                            <div onClick={()=>{
                                dispatch({ type:'user/toggleCollapsed' });
                            }} style={{ cursor:'pointer', position:'absolute', zIndex:'2', right:'1rem', bottom:'1rem', background:'#f7f8fa', padding:'4px 6px' }}>
                                <MenuFoldOutlined style={{ color:'#777d88' }} />
                            </div>
                        </div>
                        <div className={style['content-container']} style={{ width:collapsed ? '100%' : '90%' }}>                  
                            { children }        
                        </div>
                    </div>
                </div>
                :
                null
            } 
        </div>
    )
}

export default connect(({ user }) => ({ user }))( ProjectIndex );