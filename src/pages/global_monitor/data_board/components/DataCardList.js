import React, { useState, useEffect, useRef  } from 'react';
import { Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import style from '@/pages/IndexPage.css';


function DataCardList({ list, data, fieldMaps }){
    const containerRef = useRef();
    useEffect(()=>{
        let container = containerRef.current;
        function handleScroll(event){
            event.preventDefault();
            container.scrollLeft += event.deltaY
        }
        if ( container ){
            container.addEventListener('wheel', handleScroll);
        }
    },[]);
   
    return (
        // 高度高于外部容器，确认横向滚动条被外部容器隐藏掉
        <Tooltip title='通过滚轮滑动查看'>
            <div ref={containerRef} style={{ cursor:'w-resize', position:'relative', height:'160px', whiteSpace:'nowrap', overflow:'auto hidden' }}>
            {/* 横向滚动条的样式重置 */}
            {
                list && list.length 
                ?
                list.map((item,index)=>(
                    <div className={style['card-container-wrapper']} key={item.key} style={{ width:'16.6%' }}>
                        <div className={style['card-container']} style={{ padding:'1rem', boxShadow:'none', display:'flex', flexDirection:'column', justifyContent:'space-around' }}>
                            <div style={{ fontWeight:'bold' }}>{ fieldMaps[item.key].title }</div>
                            <div>
                                <span style={{ fontSize:'2rem', fontWeight:'bold', color:fieldMaps[item.key].color || 'rgba(0, 0, 0, 0.65)' }}>{ data[item.key] ? data[item.key][fieldMaps[item.key].dataIndex] : 0 }</span>
                                <span style={{ fontSize:'0.8rem', marginLeft:'4px' }}>{ fieldMaps[item.key].unit }</span>
                            </div>
                            <div>
                                {
                                    fieldMaps[item.key].subTitle && fieldMaps[item.key].subTitle.length 
                                    ?
                                    fieldMaps[item.key].subTitle.map((sub, index)=>{
                                        let obj = data[item.key] || {};
                                        return (<span key={sub.dataIndex} style={{ marginRight:'1rem' }}>
                                            <span style={{ marginRight:'4px' }}>{ sub.title }</span>
                                            <span style={{ color: obj[sub.dataIndex] > 0 ? '#f53f3f' : '#14cb3f' }}>
                                                { !obj[sub.dataIndex] || !sub.hasArrow ? null : obj[sub.dataIndex] > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined /> } 
                                                { obj[sub.dataIndex] || 0.0 }
                                                { sub.unit }
                                            </span>
                                        </span>)
                                    })
                                    :
                                    null
                                }
                            </div>
                        </div>
                    </div>
                ))
                :
                null
            }
        </div>
        </Tooltip>
    )
}


export default React.memo(DataCardList);