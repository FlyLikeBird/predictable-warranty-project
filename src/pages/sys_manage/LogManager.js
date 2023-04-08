import React, { Component, useState, useEffect } from 'react';
import { connect } from 'dva';
import { Tabs, Table } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, RadarChartOutlined, CloseOutlined } from '@ant-design/icons';
import TableSelector from './components/TableSelector';
import style from '../IndexPage.css';
const { TabPane } = Tabs;

const SystemLog = ({dispatch, user, userList }) => {
    const { list, isLoading, currentPage, total } = userList;
    const { companyList, userInfo, authorized } = user;
    const [operateType, setOperateType ] = useState('');
    const [operateUserName, setOperateUserName] = useState('');
    useEffect(()=>{
        if ( authorized ) {
            dispatch({ type:'userList/fetchLogList'});
        }
    },[authorized])
    const columns = [
        {
            title:'序号',
            width:'60px',
            fixed:'left',
            render:(text,record,index)=>{
                return `${ ( currentPage - 1) * 12 + index + 1}`;
            }
        },
        {
            title:'日志类型',
            dataIndex:'operateType'
        },
        {
            title:'登录用户',
            dataIndex:'operateUserName'
        },
        {
            title:'登录IP',
            dataIndex:'ip',
        },
        // {
        //     title:'所属公司',
        //     dataIndex:'company_id',
        //     render:(text)=>{
        //         let filterCompany = companyList.filter(i=>i.company_id == text)[0];
        //         return <div>{ filterCompany ? filterCompany.company_name : '' }</div>
        //     }
        // },
        {
            title:'操作行为',
            dataIndex:'operateDesc'
        },
        {
            title:'登录时间',
            dataIndex:'operateTime'
        }
    ];
    
    return (
        <>
            <div style={{ height:'90px' }}>
                <TableSelector 
                    operateType={operateType} 
                    onChangeType={value=>setOperateType(value)} 
                    operateUserName={operateUserName} 
                    onChangeName={value=>setOperateUserName(value)}  
                    onSelect={action=>dispatch(action)}
                />
            </div>
            <div style={{ height:'calc( 100% - 90px)' }}>
                <div className={style['card-container']}>
                    <Table
                        columns={columns}
                        dataSource={list || []}
                        rowKey="logId"
                        className={style['self-table-container']}
                        loading={isLoading}
                        bordered={true}
                        pagination={{current:currentPage, total, pageSize:12, showSizeChanger:false }}
                        onChange={(pagination)=>{
                            dispatch({type:'userList/fetchLogList', payload:{ currentPage:pagination.current, operateType, operateUserName }});
                        }}
                    />
                </div>
            </div>
        </>
       
    )
    
}

export default connect(({ user, userList })=>({ user, userList }))(SystemLog);
