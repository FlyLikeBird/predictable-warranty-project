import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

function CustDrag({ data }){
    const itemRef = useRef();
    const [{ opacity }, drag] = useDrag({
        type:'field',
        item:{ ...data },
        end:()=>{
            console.log('drag end');
        },
        collect:(monitor)=>{
            // console.log(monitor);
            // console.log('monitor func');
            // console.log(monitor.getItem());
            return {  x:10, y:20, opacity:monitor.isDragging() ? 0.5 : 1 }
        }
    })
    const [, drop] = useDrop({
        accept:'field',

        collect:(monitor)=>{
            console.log(monitor.getItem());
        }
    })
    // console.log('render');
    drop(drag(itemRef));
    return (
          <div ref={itemRef} style={{ opacity, cursor:'move' }}>{ data.label }</div>
    )
}

export default CustDrag;