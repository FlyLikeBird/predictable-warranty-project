import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import DropItem from './DropItem';

function CustDrop({ onChange }){
    const [list, setList] = useState([]);
    const [error, setError] = useState('');
    const [{ canDrop, isOver }, dropRef] = useDrop({
        accept:'field',
        // canDrop:(item)=>{
        //     setError('');
        //     const filter = list.filter(i => i.value === item.value );
        //     if ( filter.length ){
        //         setError('数据已经被放置');
        //         return false;
        //     }
        //     return true;
        // },
        drop:(item)=>{
            // drop 之前判断canDrop的逻辑，如果返回false,则不触发drop事件;
            let newArr = [...list];
            newArr.push(item);
            setList(newArr);
            onChange(newArr);
        },
        collect:(monitor)=>{
            // console.log(monitor);
            return { 
                isOver:monitor.isOver(), 
                canDrop:monitor.canDrop() 
            }
        }
    });
    
    const showCanDrop = ()=>{
        if ( error && isOver ) return <div>{ error }</div> 
        if ( canDrop && !isOver ) {
            return (<div>请拖拽至此处</div>)
        }
    }
    const delItem = (index)=>{
        let newArr = [...list];
        newArr.splice(index, 1);
        setList(newArr);
        console.log(newArr);
        onChange(newArr);
    }
    const moveRow = (sourceIndex, targetIndex)=>{
        // 根据拖拽元素的索引值，和放置区的索引值重新排序
        let newArr = [...list];
        let temp = newArr[targetIndex];
        newArr[targetIndex] =  newArr[sourceIndex];
        newArr[sourceIndex] = temp;
        setList(newArr);
    }
    console.log(list);
    const showValue = ()=>{
        return list.map((item, index)=>{
            return (
                // <div key={item.value}>{ item.label }<span onClick={()=>delItem(index)}>删除</span></div>
                <DropItem key={item.value} data={item} index={index} moveRow={moveRow} onDelItem={delItem} />
            )
        })
        
    }
    // console.log('render');
    return (
        <div ref={dropRef} style={{ border:'1px solid #000', minHeight:'200px' }}>
            { showCanDrop() }
            { showValue() }
        </div>
    )
}

export default CustDrop;

