import React, { useRef } from 'react';
import { Switch, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import style from '../DataBoard.css';

const DragItem = ({ data, list, index, onChecked, onMoveRows })=>{
    const itemRef = useRef(null);
    const [{ }, drag] = useDrag({
        type:'sort',
        item:{ index, ...data },
        collect:(monitor)=>({
            
        })
    })
    const [{ isOver, dropClassName }, drop] = useDrop({
        accept:'sort',
        drop:item=>{
            // 根据拖拽的当前位置和索引更新列表
            onMoveRows(item.index, index);
        },
        collect:(monitor)=>{
            // console.log('collect func');
            let { index : dragIndex } = monitor.getItem() || {};
            if ( dragIndex === index ) {
                return {};
            }
            return { isOver:monitor.isOver(), dropClassName:dragIndex < index ? 'border-bottom' : 'border-top' }
        }
    })
    drop(drag(itemRef));
    // console.log('child render()...');
    return (
      
        <div ref={itemRef} className={ style['drag-list-item'] + ' ' + ( isOver ? style[dropClassName] : '' )}  style={{ padding:'6px 0' }} >
            <Switch size='small' style={{ marginRight:'0.5rem' }} checked={data.isSelected} onChange={()=>onChecked(data.title)} />
            <div style={{ flex:'1' }}>{ data.title }</div>
            <div><MenuOutlined style={{ float:'right', verticalAlign:'middle' }} /></div>
            
        </div>
    )
}

export default DragItem;