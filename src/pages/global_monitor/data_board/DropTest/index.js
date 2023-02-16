import React, { useState } from 'react';
import { connect } from 'dva';
import { Form, Switch, DatePicker  } from 'antd';
import style from '@/pages/IndexPage.css';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import CustDrag from './CustDrag';
import CustDrop from './CustDrop';

const dndList = [
    { label: "标签1", value: "值1" },
    { label: "标签2", value: "值2" },
    { label: "标签3", value: "值3" },
  ];
function DataBoardManager({ board }){
    const [list, setList] = useState(dndList);
    const handleDrop = (res)=>{
        let ids = res.map(item=>item.value);
        let newArr = dndList.filter(item=> !ids.includes(item.value));
        setList(newArr);
    }
    console.log(list);
    return (
        <DndProvider backend={HTML5Backend}>
            <div>
                <span>请拖拽:</span>
                <div style={{ border:'1px solid #000', minHeight:'200px' }}>
                    {
                        list.map((item,index)=>(
                            <CustDrag key={item.value} data={item} />
                        ))
                    }
                </div>
                <div style={{ marginTop:'20px' }}>请放置:</div>
                <CustDrop onChange={handleDrop} />
            </div>
        </DndProvider>
    )
}

export default connect(({ board })=>({ board }))(DataBoardManager);