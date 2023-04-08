import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Row, Col, Table, Button, Card, Modal, Select, Spin, Switch, message, Popconfirm, Form, Input } from 'antd';
import { FireOutlined, DownloadOutlined, DoubleLeftOutlined, DoubleRightOutlined, PlusOutlined } from '@ant-design/icons'
import RuleForm from './components/RuleForm';
import style from '../IndexPage.css';

const { Option } = Select;
const typeMaps = { 0:{ text:'电表', unit:'kwh'}, 1:{ text:'震动', unit:'mm/s'}, 2:{ text:'温度', unit:'℃'} };
function AlarmSetting({ dispatch, user, alarm, mach }){
    let { companyList, currentCompany, authorized } = user;
    let { ruleList, ruleType, ruleMachs } = alarm;
    let [info, setInfo] = useState({});
    let [ruleId, setRuleId] = useState('');
    let [selectedMachs, setSelectedMachs] = useState([]);
    useEffect(()=>{
        if ( authorized ) {
            dispatch({ type:'alarm/fetchRuleList'});
            dispatch({ type:'mach/fetchMachList'});
        }
        return ()=>{
            dispatch({ type:'alarm/cancelAll'});
        }
    },[authorized]);
    useEffect(()=>{
        if ( ruleMachs.length ) {
            setSelectedMachs(ruleMachs.map(i=>i.equipmentInfo.equipmentCode));
        }
    },[ruleMachs])
    const columns = [
        {
            title:'序号',
            width:'60px',
            fixed:'left',
            render:(text,record,index)=>{
                return index + 1;
                // return `${ ( pageNum - 1) * pagesize + index + 1}`;
            }
        },
        { title:'规则名称', dataIndex:'warningRuleName' },
        // { title:'所属公司', dataIndex:'company_name' },
        // { title:'告警等级(1级为最高)', dataIndex:'level' },
        { title:'告警类型', dataIndex:'warningRuleType', render:value=>(<span>{ typeMaps[value] ? typeMaps[value].text : '' }</span>) },
        { title:'告警最小阈值', dataIndex:'warningMin', render:(value)=>(<span style={{ color:'#1890ff'}}>{ value }</span>)},
        { title:'告警最大阈值', dataIndex:'warningMax', render:(value)=>(<span style={{ color:'#1890ff'}}>{ value }</span>)},
        { title:'单位', dataIndex:'unitName' },
        { 
            title:'创建时间',  
            dataIndex:'createTime',
        },
        {
            title:'操作',
            render:(row)=>{
                return (
                    <div>
                        <a style={{ marginRight:'1rem' }} onClick={()=>{
                            setRuleId(row.warningRuleId);
                            dispatch({ type:'alarm/fetchRuleMachs', payload:{ warningRuleId:row.warningRuleId }});
                        }}>关联设备</a>
                        <a style={{ marginRight:'1rem' }} onClick={()=>{
                            setInfo({ visible:true, current:row, forEdit:true });
                        }}>更新</a>
                        <Popconfirm 
                            title="确定删除此条规则吗?" 
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

    return (
                <div className={style['card-container']}>
                    <div style={{ padding:'10px 20px 0 20px'}}>
                        <Button type="primary"  onClick={() => setInfo({ visible:true, forEdit:false }) }>添加规则</Button>                
                    </div>
                    <Table
                        className={style['self-table-container']}
                        columns={columns}
                        dataSource={ruleList}
                        locale={{emptyText:(<div style={{ margin:'1rem 0' }}>还没有设置规则</div>)}}
                        bordered={true}
                        rowKey="warningRuleId"
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
                        <RuleForm 
                            info={info} 
                            ruleType={ruleType}
                            bindMachs={mach.machList}
                            onClose={()=>setInfo({})} 
                            onDispatch={action=>dispatch(action) }
                        />
                    </Modal>
                    <Modal
                        title='关联设备'
                        open={ruleId ? true : false}
                        width="40%"
                        bodyStyle={{ padding:'40px'}}
                        closable={false}
                        className={style['modal-container']}
                        onCancel={()=>setRuleId('')}
                        cancelText='取消'
                        okText='关联'
                        onOk={()=>{    
                            let result = [];
                            let prevMachs = ruleMachs.map(i=>({ code:i.equipmentInfo.equipmentCode, id:i.equipmentWarningRuleId}));
                            let prevMachIds = prevMachs.map(i=>i.code);
                            // 移除已关联的设备    
                            prevMachs.forEach(i=>{
                                if ( !selectedMachs.includes(i.code)) {
                                    result.push({ action:'unbind', payload:i.id })
                                }
                            })
                            // 关联新设备
                            selectedMachs.forEach(i=>{
                                if(!prevMachIds.includes(i)){
                                    result.push({ action:'bind', payload:i })
                                }
                            });
                            new Promise((resolve, reject)=>{
                                dispatch({ type:'alarm/bindRuleAsync', payload:{ resolve, reject, warningRuleId:ruleId, result }})
                            })
                            .then(()=>{
                                message.success('更新关联设备成功');
                                setRuleId('');
                            })
                            .catch(msg=>message.error(msg));
                        }}
                    >
                        <div style={{ display:'flex', alignItems:'center' }}>
                            <div>选择设备:</div>
                            {
                                mach.list.length 
                                ?
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ flex:'1', marginLeft:'0.5rem' }}
                                    placeholder="选择要关联的设备"
                                    value={selectedMachs}
                                    onChange={value=>setSelectedMachs(value)}
                                    options={                                              
                                        mach.list.map(i=>({ value:i.equipmentCode, label:i.equipmentName }))                                          
                                    }
                                />
                                :
                                <Button type='primary' onClick={()=>history.push('/mach_manage/mach_manage_archive')}>请先添加设备</Button>
                            } 
                        </div>
                    </Modal>
                </div>
             
    )
};

export default connect( ({ user, alarm, mach }) => ({ user, alarm, mach }))(AlarmSetting);