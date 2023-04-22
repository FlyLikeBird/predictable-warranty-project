import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { connect } from 'dva';
import { Button, Table, Modal, Popconfirm, message } from 'antd';
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import AddForm from './AddForm';
import TableSelector from './TableSelector';
import style from '@/pages/IndexPage.css';

function SensorManager({ dispatch, user, mach }){
    const { authorized } = user;
    const { sensorList, currentPage, total, sensorTypes, sensorModelMaps } = mach;
    const [info, setInfo] = useState({});
    const columns = [
        { title:'序号', render:(text, record, index)=>{ return (currentPage - 1) * 12 + index + 1 }},
        { title:'编码', dataIndex:'sensorCode' },
        { title:'名称', dataIndex:'sensorName'},
        { title:'型号', dataIndex:'sensorModel'},
        { title:'类型', dataIndex:'sensorType', render:value=>{
            let info = sensorTypes.filter(i=>i.key === value )[0] || {};
            return (<span>{ info.title || '--' }</span>)
        }},
        { title:'采用标准', dataIndex:'sensorCriteria'},
        { title:'添加时间', dataIndex:'createTime' },
        {
            title:'操作',
            render:row=>(
                <div>
                    <a onClick={()=>setInfo({ visible:true, current:row, forEdit:true })} style={{ marginRight:'0.5rem' }}>更新</a>
                    <Popconfirm title='确定删除此传感器吗' okText='确定' cancelText='取消' onConfirm={()=>{
                        new Promise((resolve, reject)=>{
                            dispatch({ type:'mach/addSensorAsync', payload:{ values:row, resolve, reject, forEdit:true, forDel:true }})
                        })
                        .then(()=>{
                            message.success(`删除${row.sensorName}成功`)
                        })
                        .catch(msg=>message.error(msg));
                    }}><a>删除</a></Popconfirm>
                </div>
            )
        }
    ];
    
    useEffect(()=>{
        if ( authorized ){
            dispatch({ type:'mach/fetchSensorList' });
            dispatch({ type:'mach/fetchSensorModels'});
        }
    },[authorized])
    
    return (
        <>
            
            <div style={{ height:'90px' }}>
                <TableSelector onSearch={obj=>{
                    dispatch({ type:'mach/setOptional', payload:obj });
                    dispatch({ type:'mach/fetchSensorList'});
                }} />
            </div>  
            <div style={{ height:'calc( 100% - 90px)', paddingTop:'1rem' }}>
                <div className={style['card-container']} style={{ padding:'1rem 0', boxShadow:'none' }}>
                    <div className={style['card-title']}>
                        <div>
                            <Button type='primary' icon={<PlusOutlined />} style={{ marginRight:'0.5rem' }} onClick={()=>setInfo({ visible:true })}>新建</Button>
                            <Button>批量导入</Button>
                        </div>
                        <Button icon={<DownloadOutlined />}>下载</Button>
                    </div>
                    <div className={style['card-content']} style={{ padding:'0' }}>
                        <Table
                            className={style['self-table-container']}
                            columns={columns}
                            dataSource={sensorList}
                            rowKey='sensorCode'
                            pagination={{ current:currentPage, total, pageSize:12, showSizeChanger:false }}
                            onChange={pagination=>{
                                dispatch({type:'mach/fetchSensorList', payload:{ currentPage:pagination.current }});
                            }}
                                
                        />
                    </div>
                </div>
                <Modal
                    open={info.visible ? true : false }
                    onCancel={()=>setInfo({})}
                    title={info.forEdit ? '更新传感器' : '添加传感器'}
                    footer={null}
                >
                    <AddForm 
                        info={info}
                        onDispatch={action=>dispatch(action)}
                        sensorTypes={sensorTypes}
                        sensorModelMaps={sensorModelMaps}
                        onClose={()=>setInfo({})}
                    />
                </Modal>
                  
            </div>
        </>
    )
}

export default connect(({ user, mach })=>({ user, mach }))(SensorManager);

