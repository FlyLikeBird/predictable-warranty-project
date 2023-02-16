import React, { useState } from 'react';
import { connect } from 'dva';
import { Button, Drawer } from 'antd';
import DataCardList from './components/DataCardList';
import BoardDrawer from './components/BoardDrawer';
import style from '@/pages/IndexPage.css';

function DataBoardManager({ dispatch, board }){
    const { boardList, currentIndex } = board;
    const currentBoad = boardList[currentIndex];
    const [visible, setVisible] = useState(false);
    console.log('parent render()...');
    return (
        <div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
                <div>
                {
                    boardList.map(item=>(
                        <span key={item.key}>{ item.label }</span>
                    ))
                }
                </div>
                <Button type='primary' onClick={()=>setVisible(true)}>看板设置</Button>
            </div>
            <div style={{ height:'140px', overflow:'hidden' }}>
                <DataCardList data={(currentBoad.dataCardList || []).filter(i=>i.isSelected )} />
            </div>
            <div>
                
            </div>
            <Drawer
                width='40%'
                open={visible}
                className={style['custom-drawer']}
                onClose={()=>setVisible(false)}
                headerStyle={{ display:'none' }}
                bodyStyle={{ padding:'0' }}
               
            >
                <BoardDrawer dispatch={dispatch} data={boardList} />
            </Drawer>
        </div>
    )
}

export default connect(({ board })=>({ board }))(DataBoardManager);