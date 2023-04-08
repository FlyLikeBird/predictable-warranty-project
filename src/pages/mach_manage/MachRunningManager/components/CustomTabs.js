import React, { useState } from 'react';
import { Calendar } from 'antd';
import zhCN from 'antd/es/calendar/locale/zh_CN';
import RadarChart from './RadarChart';
import style from './CustomTabs.css';

const tabs = [{ label:'基本信息', key:1 }, { label:'健康评分', key:2 }, { label:'运行日历', key:3 }];

function CustomTabs({ currentMach }){
    const [currentKey, setCurrentKey] = useState(1);
    const infoList = [
        { label:'设备名称', value:currentMach.equipmentName }, { label:'品牌', value:currentMach.equipmentBrand }, { label:'型号', value:currentMach.equipmentModel }, 
        { label:'能耗', value:currentMach.load, unit:'kw' }, { label:'底座类型', value:currentMach.equipmentPedestal === 1 ? '硬性底座' : '柔性底座' }, { label:'转轴高度', value:currentMach.equipmentPivoting, unit:'mm' }
    ];
    return (
        <div className={style['tabs']}>
            <div className={style['tabs-nav']}>
                {
                    tabs.map((item)=>(
                        <div className={style['tabs-nav-item'] + ' ' + ( item.key === currentKey ? style['selected'] : '')} key={item.key} onClick={()=>setCurrentKey(item.key)}>{ item.label }</div>
                    ))
                }
            </div>
            <div className={style['tabs-content']}>
                {
                    currentKey === 1 
                    ?
                    <div className={style['flex-container']}>
                        {
                            infoList.map(item=>(
                                <div className={style['flex-item']}>
                                    <div className={style['flex-item-label']}>{ item.label }</div>
                                    <div className={style['flex-item-content']}>{ item.value + ( item.unit || '') }</div>
                                </div>
                            ))
                        }
                    </div>
                    :
                    currentKey === 2 
                    ?
                    <RadarChart />
                    :
                    <Calendar locale={zhCN} fullscreen={false} headerRender={()=>null} />
                }
            </div>
        </div>
    )
}

export default React.memo(CustomTabs);