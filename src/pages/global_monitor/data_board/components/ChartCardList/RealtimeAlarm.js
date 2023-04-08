import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import style from '@/pages/IndexPage.css';
let mock = [];
for ( let i=0;i<8;i++){
    mock.push({ title:'电机DJ23', type:'电机', alarmType:'指标越限', power:20, brand:'Mabashi', model:'ME-1002', register_code:'F1392929', position:'南厂A生产车间', date:'2020-10-1' })
}
let scrollNum = 6, timer;
function RealtimeAlarm({ data, item, chartMaps }){
    data = mock;
    const [list, setList] = useState([]);
    const [index, setIndex] = useState(0);
    useEffect(()=>{
        
        return ()=>{

        }
    },[]);
    useEffect(()=>{
        setList(data.slice(index, 6));
    },[index])
    const columns = [
        { title:'告警设备', dataIndex:'title' },
        { title:'告警类型', dataIndex:'alarmType', render:value=>(<span style={{ color:'red'}}>{ value }</span>)},
        { title:'告警时间', dataIndex:'date'},
        { title:'负责人', render:row=>(<span>张三</span>)},
        { 
            title:'操作',
            render:row=>(
                <div>
                    <span>查看</span>
                </div>
            )
        }
    ]
    return (
        <div className={style['card-container']} style={{ boxShadow:'none', padding:'0' }}>
            <div className={style['card-title']}>
                <div>
                    <span>{ chartMaps[item.key] }</span>                  
                </div>
                <div><span style={{ color:'#1890ff', fontSize:'0.8rem' }}>查看更多</span></div>
            </div>
            <div className={style['card-content']}>
                <Table 
                    className={style['self-table-container'] + ' ' + style['small']}
                    size='small'
                    columns={columns}
                    dataSource={list}
                    pagination={false}
                />
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
export default React.memo(RealtimeAlarm);