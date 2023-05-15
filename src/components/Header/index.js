import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import {
  Dropdown,
  Menu,
  Button,
  Badge,
  Popover,
  Radio,
  Modal,
  Tag,
  Switch,
} from 'antd';
import {
  createFromIconfontCN,
  AlertOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  HomeOutlined,
} from '@ant-design/icons';
// import ScrollTable from '@/pages/page_index/components/ScrollTable';
import style from './Header.css';
import { getToday } from '@/utils/parseDate';
import avatarBg from '../../../public/avatar-bg.png';
import LogoImg from '../../../public/logo.png';

let timer;
let closeTimer = null;
const weekObj = {
  0: '周日',
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
};
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2314993_bryih7jtrtn.js',
});
function isFullscreen() {
  return (
    document.fullscreenElement ||
    document.msFullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    false
  );
}

function enterFullScreen(el) {
  try {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
    // let func = el.requestFullscreen || el.msRequestFullscreen || el.mozRequestFullscreen || el.webkitRequestFullscreen ;
    // if ( func && typeof func === 'function' ) func.call(el);
  } catch (err) {
    console.log(err);
  }
}

function cancelFullScreen(el) {
  // let func = el.cancelFullsceen || el.msCancelFullsceen || el.mozCancelFullsceen || el.webkitCancelFullsceen
  //         || document.exitFullscreen || document.msExitFullscreen || document.mozExitFullscreen || document.webkitExitFullscreen ;
  // if ( func && typeof func === 'function' ) func();
  if (typeof document.exitFullscreen === 'function') {
    document.exitFullscreen();
  }
}

let week = new Date().getDay();
const Header = ({ onDispatch, msg, routePath, userInfo, theme }) => {
  const [curTime, updateTime] = useState(getToday(2));
  const [muted, setMuted] = useState(true);
  const containerRef = useRef();
  useEffect(() => {
    timer = setInterval(() => {
      updateTime(getToday(2));
    }, 1000);
    function handleAudio() {
      setMuted(false);
      document.onclick = null;
    }
    document.onclick = handleAudio;
    return () => {
      clearInterval(timer);
      timer = null;
    };
  }, []);
  useEffect(() => {
    // 兼容两种情况：
    //  1.登录时通过登录button获取到交互权限
    //  2.刷新时监听整个文档的click事件，当有click时才触发audio的play();
    let audio = document.getElementById('my-audio');
    if (audio) {
      // if ( msg.count ){
      //     try {
      //         if ( !muted ){
      //             audio.currentTime = 0;
      //             audio.play();
      //             closeTimer = setTimeout(()=>{
      //                 audio.pause();
      //             },5000)
      //         } else {
      //             audio.pause();
      //         }
      //     } catch(err){
      //         console.log(err);
      //     }
      // } else {
      //     if ( audio && audio.pause ) audio.pause();
      // }
    }
  }, [msg, muted]);
  // console.log(currentCompany);
  let isFulled = isFullscreen();
  return (
    <div
      ref={containerRef}
      className={
        theme === 'dark'
          ? style['container'] + ' ' + style['dark']
          : style['container']
      }
    >
      <div className={style['content-container']}>
        <div style={{ width: '12%', padding: '0 1rem' }}>
          {/* <img src={LogoImg} style={{ width:'50px' }} /> */}
          <span style={{ fontSize: '1.4rem', margin: '0 0.5rem' }}>
            预测性维护
          </span>
        </div>
        <div
          style={{
            width: '88%',
            display: 'inline-flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: '2rem',
          }}
        >
          <div style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
            <span>
              <HomeOutlined />
            </span>
            {routePath && routePath.length
              ? routePath.map((item, index) => (
                  <span key={index}>
                    <span style={{ margin: '0 4px' }}>/</span>
                    <span style={{ color: 'rgba(0, 0, 0, 0.65)' }}>
                      {item.menu_name}
                    </span>
                  </span>
                ))
              : null}
          </div>
          <div className={style['weather-container']}>
            {isFulled ? (
              <FullscreenExitOutlined
                style={{ fontSize: '1.2rem', margin: '0 10px' }}
                onClick={() => {
                  cancelFullScreen();
                }}
              />
            ) : (
              <FullscreenOutlined
                style={{ fontSize: '1.2rem', margin: '0 10px' }}
                onClick={() => {
                  enterFullScreen(document.getElementById('root'));
                }}
              />
            )}
            <span>{curTime + '  ' + `(${weekObj[week]})`}</span>
            {/* <span style={{ margin:'0 10px'}}>{ weatherInfo.city }</span>
                            <span>{ weatherInfo.weather }</span> */}
            <span style={{ margin: '0 10px' }}>|</span>

            <AlertOutlined style={{ marginRight: '6px', fontSize: '1.2rem' }} />
            {/* <Popover content={<ScrollTable data={ msg.detail || []}/>}> */}
            <Badge
              count={msg.length}
              onClick={() =>
                onDispatch(routerRedux.push('/alarm_manage/alarm_manage_list'))
              }
            />
            {/* </Popover> */}
            <IconFont
              style={{ fontSize: '1.2rem', margin: '0 10px' }}
              type={muted ? 'iconsound-off' : 'iconsound'}
              onClick={() => {
                setMuted(!muted);
              }}
            ></IconFont>
            <span style={{ margin: '0 10px' }}>|</span>

            <span
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#8888ac',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundImage: `url(${avatarBg})`,
              }}
            ></span>
            <span>{userInfo.userName}</span>
            {/* <Tag color="blue">{ userInfo.role_name }</Tag> */}
            <span style={{ cursor: 'pointer' }}>
              <Tag
                color="#2db7f5"
                onClick={() => {
                  onDispatch({ type: 'user/loginOut' });
                }}
              >
                退出
              </Tag>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

function areEqual(prevProps, nextProps) {
  if (
    prevProps.routePath !== nextProps.routePath ||
    prevProps.msg !== nextProps.msg ||
    prevProps.theme !== nextProps.theme
  ) {
    return false;
  } else {
    return true;
  }
}

export default React.memo(Header, areEqual);
