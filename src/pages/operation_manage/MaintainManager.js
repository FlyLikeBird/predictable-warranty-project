import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, message } from 'antd';
import { WalletFilled, ToolFilled, HistoryOutlined, CheckCircleFilled } from '@ant-design/icons';
import TableSelector from './components/TableSelector';
import style from '@/pages/IndexPage.css';

const infoList = [
    { key:'1', title:'本月需保养电机数', value:31, unit:'台' },
    { key:'2', title:'下月需保养电机数', value:12, unit:'台'},
    { key:'3', title:'超时未保养电机数', value:12, unit:'台'},
    { key:'4', title:'维保准时率', value:92, unit:'%' }
]

function MaintainManager({ dispatch, user, order }){
    const { authorized } = user;
    const { maintainList, maintainDetail } = order;
    useEffect(()=>{
        if ( authorized ){
            dispatch({ type:'order/fetchMaintainList'});
        }
    },[authorized])
    const columns = [
        { title:'设备名称', dataIndex:'equipmentName' },
        { title:'功率', dataIndex:'equipmentPower', render:value=>(<span>{ ( value || '--' ) + 'kw' }</span>)  },
        { title:'型号', dataIndex:'equipmentModel' },
        { title:'保修截止日期', dataIndex:'equipmentMaintenanceEndDate' },
        { title:'建议下次保养时间', dataIndex:'suggestionUpkeepDate' },
        { title:'负责人', dataIndex:'equipmentHeadName' },
        { title:'实际保养时间', dataIndex:'actualUpkeepDate', render:value=>(<span>{ value || '--' }</span>)},
        { title:'上次保养成本', dataIndex:'lastUpkeepCost', render:value=>(<span>{ value || '--' }</span>)},
        { title:'上次保养用时', dataIndex:'lastUpkeepTakeTime', render:value=>(<span>{ value || '--' }</span>)},
        { title:'保养状态', dataIndex:'upkeepStatus',  render:value=>(<span style={{ color:value ? 'rgb(0, 180, 42)' : 'rgb(245, 63, 63)'}}>{ value ? '已保养' : '未保养' }</span>) },
        {
            title:'操作',
            render:(row)=>{
                return (
                    <>
                        <span onClick={()=>{
                            message.info('工单开发中...');
                        }}>详情</span>
                    </>
                )
            }
        }
    ]
    
    return (
        <>
            <div style={{ height:'90px' }}>
                <TableSelector list={maintainList} onSearch={obj=>{
                    dispatch({ type:'order/setOptional', payload:obj });
                    dispatch({ type:'order/fetchMaintainList'});
                }} />
            </div>
            <div style={{ height:'calc( 100% - 90px)', paddingTop:'1rem' }}>
                <div className={style['card-container']} style={{ boxShadow:'none', padding:'1rem' }}>
                    <div style={{ height:'100px', display:'flex', justifyContent:'space-between', marginBottom:'1rem' }}>
                        {
                            infoList.map((item,index)=>(
                                <div style={{ width:'calc(( 100% - 3rem)/4)', border:'1px solid #efeff3', padding:'1rem', display:'flex', justifyContent:'space-around', alignItems:'center' }}>
                                    <div style={{ width:'50px', height:'50px', lineHeight:'54px', textAlign:'center', borderRadius:'50%', background:'#f6f7fb', marginRight:'1rem' }}>
                                        {
                                            item.key === '1' 
                                            ?
                                            <ToolFilled style={{ fontSize:'1.6rem', color:'#6988ef' }} />
                                            :
                                            item.key === '2' 
                                            ?
                                            <WalletFilled style={{ fontSize:'1.6rem', color:'#4bc7ff' }} />
                                            :
                                            item.key === '3' 
                                            ?
                                            <HistoryOutlined style={{ fontSize:'1.6rem', color:'#d06dff' }} />
                                            :
                                            <CheckCircleFilled style={{ fontSize:'1.6rem', color:'#00b42a' }} />
                                        }
                                    </div>
                                    <div style={{ flex:'1' }}>{ item.title }</div>
                                    <div style={{ flex:'1' }}>
                                        <span style={{ fontSize:'2rem', color:'#000' }}>{ item.value }</span>
                                        <span style={{ fontSize:'0.8rem' }}>{ item.unit }</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <Table
                        columns={columns}
                        rowKey='equipmentCode'
                        style={{ padding:'0' }}
                        className={style['self-table-container']}
                        dataSource={maintainList}
                    />
                </div>
            </div>
        </>
    )
}

export default connect(({ user, order })=>({ user, order }))(MaintainManager);

