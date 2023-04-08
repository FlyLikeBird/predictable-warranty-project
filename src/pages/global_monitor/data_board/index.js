import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { Button, Drawer } from 'antd';
import DataCardList from './components/DataCardList';
import ChartCardList from './components/ChartCardList';
import BoardDrawer from './components/BoardDrawer';
import style from '@/pages/IndexPage.css';

function DataBoardManager({ dispatch, user, board }){
    const { authorized } = user;
    const { boardList, currentIndex, chartSourceData, statusSourceData,  fieldMaps, chartMaps } = board;
    const currentBoad = boardList.filter(i=>i.key === currentIndex)[0] || {};
    const [visible, setVisible] = useState(false);
    useEffect(()=>{
        if ( authorized ){
            dispatch({ type:'user/toggleTimeType', payload:'2' });
            dispatch({ type:'board/initBoard'});
        }
    },[authorized])
    const handleDispatch = useCallback((action)=>{
        dispatch(action);
    },[]);
    console.log(board);
    return (
        <div style={{ height:'100%' }}>
            <div style={{ height:'40px', display:'flex', justifyContent:'space-between' }}>
                <div>
                {
                    boardList.map(item=>(
                        <span key={item.key} style={{ marginRight:'1rem', color:item.key === currentIndex ? '#1890ff' : 'rgba(0, 0, 0, 0.65)', padding:'4px 16px', background: item.key === currentIndex ? 'rgb(235 235 235)' : 'rgb(247, 248, 250)', borderRadius:'12px', cursor:'pointer'  }} onClick={()=>{
                            dispatch({ type:'board/setCurrentIndex', payload:item.key });
                        }}>{ item.label }</span>
                    ))
                }
                </div>
                <Button type='primary' onClick={()=>setVisible(true)}>看板设置</Button>
            </div>
            <div style={{ height:'140px', overflow:'hidden' }}>
                <DataCardList list={(currentBoad.dataCardList || []).filter(i=>i.a )} data={statusSourceData} fieldMaps={fieldMaps}  />
            </div>
            <div style={{ height:'calc( 100% - 180px)', paddingTop:'1rem' }}>
                <ChartCardList list={(currentBoad.chartCardList || []).filter(i=>i.a)} data={chartSourceData} chartMaps={chartMaps} onDispatch={handleDispatch} />
            </div>
            <Drawer
                width='40%'
                open={visible}
                className={style['custom-drawer']}
                onClose={()=>setVisible(false)}
                closable={false}
                maskClosable={false}
                headerStyle={{ display:'none' }}
                bodyStyle={{ padding:'0' }}
            >
                <BoardDrawer 
                    dispatch={dispatch} 
                    data={boardList} 
                    fieldMaps={fieldMaps}
                    chartMaps={chartMaps}
                    onClose={()=>setVisible(false)} />
            </Drawer>
        </div>
    )
}

export default connect(({ user, board })=>({ user, board }))(DataBoardManager);