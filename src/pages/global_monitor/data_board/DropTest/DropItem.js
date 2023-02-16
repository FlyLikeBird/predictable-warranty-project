import React, { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

function DropItem({ data, index, moveRow, onDelItem }){
    const itemRef = useRef(null);
    const [{ isDragging }, drag] = useDrag({
        type:'subItem',
        item:{ index, type:'subItem', x:10 },
        collect:(monitor)=>({
            isDragging:monitor.isDragging()
        })
    })
    const [, drop] = useDrop({
        accept:'subItem',
        drop:item=>{
            
            moveRow(item.index, index);
        }
    })
    drop(drag(itemRef))
    return (
        <div style={{ display:'flex', height:'60px' }}>
            <div ref={itemRef} style={{ flex:'1' }}>{ data.label }</div>
            <span style={{ paddingLeft:'20px' }}>删除</span>
        </div>
    )
}

export default DropItem;