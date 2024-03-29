import React, { useEffect, useRef, useState } from 'react';
import { Switch, } from 'antd';
import { MenuFoldOutlined } from '@ant-design/icons';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import DragItem from './DragItem';
import style from '../DataBoard.css';

function DragList({ title, data, maps, onUpdateItems }){
    const handleChecked = key=>{
        let newArr = data.map(item=>{
            if ( item.key === key ) {
                return { ...item, a:item.a === 1 ? 0 : 1 };
            } else {
                return item;
            }
        });                         
        onUpdateItems(newArr);
    }
    const handleSort = ( dragIndex, index )=>{
        let newArr = [...data];
        let [removeItem] = newArr.splice(dragIndex, 1);
        newArr.splice(index, 0, removeItem);
        onUpdateItems(newArr);
    }
    return (
        <div className={style['drag-list']}>
            <div className={style['drag-list-header']}>
                <div style={{ fontWeight:'bold' }}>{ title }</div>
                <div>拖拽排序</div>
            </div>
            <DndProvider backend={HTML5Backend}>
                <div className={style['drag-list-content']}>             
                {
                    data.map((item, index)=>(
                        <DragItem key={item.key} data={item} maps={maps} index={index} onChecked={handleChecked} onMoveRows={handleSort} />
                    ))
                }
                </div>
            </DndProvider>                
        </div>
    )
}


export default DragList;
