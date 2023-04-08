import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'dva';
import { Row, Col, Table, Button, Card, Modal, Select, Spin, Switch, message, Popconfirm, Form, Input } from 'antd';
import { FireOutlined, DownloadOutlined, DoubleLeftOutlined, DoubleRightOutlined, PlusOutlined } from '@ant-design/icons'
import TableSelector from './components/TableSelector';
import style from '../IndexPage.css';

const { Option } = Select;
const typeMaps = { 0:{ text:'电表', unit:'kwh'}, 1:{ text:'震动', unit:'mm/s'}, 2:{ text:'温度', unit:'℃'} };
function AlarmList({ dispatch, user, alarm, mach }){
    let { companyList, currentCompany, authorized } = user;
    let { alarmList, currentPage, total } = alarm;
    let [info, setInfo] = useState({});
    useEffect(()=>{
        if ( authorized ) {
            dispatch({ type:'user/toggleTimeType', payload:'2' });
            dispatch({ type:'alarm/fetchAlarmList'});
            dispatch({ type:'mach/fetchMachList'});
        }
        return ()=>{
            dispatch({ type:'alarm/cancelAll'});
        }
    },[authorized]);
  
    const columns = [
        {
            title:'序号',
            width:'60px',
            fixed:'left',
            render:(text,record,index)=>{
                return `${ ( currentPage - 1) * 12 + index + 1}`;
            }
        },
        { title:'设备名称', dataIndex:'equipmentName' },
        { title:'告警时间', dataIndex:'createTime' },
        // { title:'告警等级(1级为最高)', dataIndex:'level' },
        { title:'告警类型', dataIndex:'warningRuleType' },
        { title:'告警详情', dataIndex:'warningDetail' },
        { title:'处理状态', dataIndex:'status', render:(value)=>(<span style={{ color:'#1890ff'}}>已转维修工单</span>)},
        {
            title:'操作',
            render:(row)=>{
                return (
                    <div>
                        <a style={{ marginRight:'1rem' }} onClick={()=>{
                            message.info('工单开发中...');
                        }}>操作</a>
                        <Popconfirm 
                            title="确定删除此条告警吗?" 
                            onText="确定" 
                            cancelText="取消" 
                            onConfirm={()=>{
                                new Promise((resolve, reject)=>{
                                    dispatch({ type:'alarm/delRulesAsync', payload:{ ruleId:row.warningRuleId }})
                                })
                                .then(()=>{
                                    message.success(`删除${row.warningRuleName}规则成功`)
                                })
                                .catch(msg=>message.error(msg));
                            }}
                        >
                            <a>删除</a>
                        </Popconfirm>

                    </div>
                )
            }
        }
    ];
    const handleSearch = useCallback((obj)=>{
        dispatch({ type:'alarm/setOptional', payload:obj });
        dispatch({ type:'alarm/fetchAlarmList'});
    },[]);
    
    return (
        <>
            <div style={{ height:'90px' }}>
                <TableSelector machList={mach.list} onSearch={handleSearch} />
            </div> 
                <div style={{ height:'calc( 100% - 90px)', paddingTop:'1rem' }}>
                    <div className={style['card-container']}>
                        <Table
                            className={style['self-table-container']}
                            columns={columns}
                            dataSource={alarmList}
                            locale={{emptyText:(<div style={{ margin:'1rem 0' }}>还没有告警记录</div>)}}
                            bordered={true}
                            rowKey="equipmentWarningId"
                            pagination={false}
                            // onChange={pagination=>{
                            //     dispatch({ type:'alarm/setPageNum', payload:pagination.current });
                            //     dispatch({ type:'alarm/fetchRecordList', payload:{ cate_code:activeKey, keywords:value }} )
                            // }}
                        />
                        <Modal         
                            title={info.forEdit ? '更新规则' : '添加规则'}          
                            open={info.visible ? true : false}
                            footer={null}
                            width="40%"
                            bodyStyle={{ padding:'40px'}}
                            closable={false}
                            className={style['modal-container']}
                            onCancel={()=>setInfo({})}
                        >
                            {/* <RuleForm 
                                info={info} 
                                ruleType={ruleType}
                                bindMachs={mach.machList}
                                onClose={()=>setInfo({})} 
                                onDispatch={action=>dispatch(action) }
                            /> */}
                        </Modal>
                    </div>
                </div>
        </>
             
    )
};

export default connect( ({ user, alarm, mach }) => ({ user, alarm, mach }))(AlarmList);