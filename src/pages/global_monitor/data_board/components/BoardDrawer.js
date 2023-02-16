import React, { useEffect, useState, useRef } from 'react';
import { Table, Switch, Tabs, Button } from 'antd';
import DragList from './DragList';
import style from '../DataBoard.css';

function BoardDrawer({ dispatch, data, onClose }){
    const [items, setItems] = useState(data);
    const [activeKey, setActiveKey] = useState(data[0].key);
    const newKey = useRef(1);
    
    return (
        <div style={{ height:'100%', position:'relative' }}>
        <Tabs
            type="editable-card"
            // onChange={onChange}
            className={style['flex-tabs']}
            tabBarStyle={{ margin:0 }}
            activeKey={activeKey}
            // onEdit={onEdit}
            items={items.map(item=>({
                label:item.label,
                key:item.key,
                children:(
                    <div className={style['drag-container']}>
                        {/* 数据卡片设置 */}
                        <div>
                            <DragList title='数据卡片设置' data={item.dataCardList} onUpdateItems={arr=>{
                                let result = items.map(item=>{
                                    if ( item.key === activeKey ) {
                                        return { ...item, dataCardList:arr }
                                    } else {
                                        return item;
                                    }
                                })
                                console.log(result);
                                setItems(result);
                            }} />  
                        </div>
                        {/* 图表卡片设置 */}
                        <div>
                            {/* <DragList title='图表卡片设置' data={item.chartCardList} /> */}
                        </div>
                    </div> 
                )
            }))}
        />
        <div style={{ borderTop:'1px solid #f0f0f0', display:'flex', justifyContent:'flex-end', alignItems:'center', height:'60px' }}>
            <Button onClick={onClose} style={{ marginRight:'1rem' }}>取消</Button>
            <Button type='primary' onClick={()=>{
                dispatch({ type:'board/updateBoardList', payload:items });
            }}>确定</Button>
        </div>
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data ){
        return false;
    } else {
        return true;
    }
} 
export default React.memo(BoardDrawer, areEqual);