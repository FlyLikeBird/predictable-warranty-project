import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { Table } from 'antd';
import style from '@/pages/IndexPage.css';
let mock = [];
for ( let i=0;i<8;i++){
    mock.push({ title:'电机DJ23', type:'电机', alarmType:'指标越限', power:20, brand:'Mabashi', model:'ME-1002', register_code:'F1392929', position:'南厂A生产车间', date:'2020-10-1' })
}
let scrollNum = 6, timer;
function RealtimeAlarm({ data, item, chartMaps }){
    const [list, setList] = useState(data);
    const [index, setIndex] = useState(0);
    useEffect(()=>{
        setList(data);
    },[data])
    // useEffect(()=>{
    //     setList(data.slice(index, 6));
    // },[index])
    const columns = [
        { title:'注册码', dataIndex:'equipmentCode' },
        { title:'告警设备', dataIndex:'equipmentName' },
        { title:'告警类型', dataIndex:'warningType', render:value=>(<span style={{ color:'red'}}>{ value ? '告警' : '预警' }</span>)},
        { title:'告警时间', dataIndex:'createTime', render:value=>(<span>{ value || '--' }</span>)},
        // { title:'负责人', render:row=>(<span>张三</span>)},
        // { 
        //     title:'操作',
        //     render:row=>(
        //         <div>
        //             <span>查看</span>
        //         </div>
        //     )
        // }
    ]
    return (
        <div className={style['card-container']} style={{ boxShadow:'none', padding:'0' }}>
            <div className={style['card-title']}>
                <div>
                    <span>{ chartMaps[item.key] }</span>                  
                </div>
                <div><span style={{ color:'#1890ff', fontSize:'0.8rem' }} onClick={()=>history.push('/alarm_manage/alarm_manage_list')}>查看更多</span></div>
            </div>
            <div className={style['card-content']}>
                <Table 
                    className={style['self-table-container'] + ' ' + style['small']}
                    size='small'
                    columns={columns}
                    dataSource={list}
                    locale={{
                        emptyText:(<div style={{ margin:'2rem 0'}}>暂时没有新告警</div>)
                    }}
                    pagination={{
                        defaultCurrent:1,
                        total:data.length,
                        pageSize:6
                    }}
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