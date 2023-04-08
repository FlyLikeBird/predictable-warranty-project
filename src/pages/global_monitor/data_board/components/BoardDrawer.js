import React, { useEffect, useState, useRef } from 'react';
import { Table, Switch, Tabs, Button, Input, message, Popconfirm } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import DragList from './DragList';
import style from '../DataBoard.css';

function BoardDrawer({ dispatch, data, fieldMaps, chartMaps, onClose }){
    const [items, setItems] = useState(data);
    const [activeKey, setActiveKey] = useState(data[0].key);
    const [editingKey, setEditingKey] = useState('');
    const inputRef = useRef(null);
    const newKey = useRef(1);
    const add = ()=>{
        let newTab = '自定义看板' + newKey.current;
        let newArr = [...items];
        newArr.push({
            label:newTab,
            key:newKey.current,
            dataCardList:items[0].dataCardList.map(i=>{ i.a = 1 ; return i}),
            chartCardList:items[0].chartCardList.map(i=>{ i.a = 1 ; return i })
        });
        setItems(newArr);
        setActiveKey(newKey.current);
        newKey.current++;
    }
    const remove = (targetKey)=>{
        let newActiveKey = activeKey;
        let lastIndex = -1;
        items.forEach((item, index)=>{
            if ( item.key === targetKey ){
                lastIndex = index - 1;
            }
        })
        let newPanes = items.filter(i=>i.key !== targetKey);
        if ( newActiveKey === targetKey ) {
            if ( lastIndex >= 0 ) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }            
        } 
        
        setItems(newPanes);
        setActiveKey(newActiveKey);
    }
    const onEdit = (targetKey, action)=>{
        if ( action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    }
    useEffect(()=>{
        if ( inputRef.current ){
            inputRef.current.focus();
        }
    },[editingKey])
    // console.log('drawer render()...');
    return (
        <div style={{ height:'100%', position:'relative' }}>
        <Tabs
            type='card'
            // type="editable-card"
            // onChange={onChange}
            className={style['flex-tabs']}
            tabBarStyle={{ margin:0 }}
            activeKey={activeKey}
            onEdit={onEdit}
            onChange={activeKey=>setActiveKey(activeKey)}
            items={items.map((item, index)=>({
                label:(
                    editingKey === item.key 
                    ?
                    <div>
                        <Input ref={inputRef} defaultValue={item.label} onBlur={()=>setEditingKey('')} onPressEnter={e=>{
                            if ( e.target.value ) {
                                let newArr = items.map(item=>{
                                    if ( item.key === editingKey ) {
                                        item.label = e.target.value;
                                    }
                                    return item;
                                })
                                setItems(newArr);
                                setEditingKey('');
                            } else {
                                message.info('看板名不能为空');
                            }
                        }} />
                    </div>
                    :
                    <div>
                        <span style={{ marginRight:'0.5rem'}}>{ item.label }</span>
                        <span onClick={()=>setEditingKey(item.key)}><EditOutlined /></span>
                    </div>
                ),
                key:item.key,
                closable:index === 0 ? false : true,
                children:(
                    <div >
                        <div className={style['drag-container']}>
                            {/* 数据卡片设置 */}
                            <div>
                                <DragList title='数据卡片设置' data={item.dataCardList} maps={fieldMaps} onUpdateItems={arr=>{
                                    let result = items.map(item=>{
                                        if ( item.key === activeKey ) {
                                            return { ...item, dataCardList:arr }
                                        } else {
                                            return item;
                                        }
                                    })
                                    setItems(result);
                                }} />  
                            </div>
                            {/* 图表卡片设置 */}
                            <div>
                                <DragList title='图表卡片设置' data={item.chartCardList} maps={chartMaps} onUpdateItems={arr=>{
                                     let result = items.map(item=>{
                                        if ( item.key === activeKey ) {
                                            return { ...item, chartCardList:arr }
                                        } else {
                                            return item;
                                        }
                                    })
                                    setItems(result);
                                }} />
                            </div>
                        </div> 
                    </div>
                )
            }))}
        />
        <div style={{ borderTop:'1px solid #f0f0f0', display:'flex', justifyContent:'flex-end', alignItems:'center', paddingRight:'1rem', height:'60px' }}>
            <Popconfirm title='看板编辑的状态会清空，确认取消吗' cancelText='取消' okText='确认' onConfirm={()=>{
                // 重置状态
                setItems([...data]);
                setActiveKey(data[0].key);
                onClose();
            }}><Button style={{ marginRight:'1rem' }}>取消</Button></Popconfirm>
            <Button type='primary' onClick={()=>{
                new Promise((resolve, reject)=>{
                    dispatch({ type:'board/updateBoardListAsync', payload:{ resolve, reject, json:items }})
                })
                .then(()=>{
                    message.success('看报保存成功');
                    onClose();
                })
                .catch(msg=>message.error(msg))
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