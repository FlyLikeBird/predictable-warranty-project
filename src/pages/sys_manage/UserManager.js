import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'dva';
import { Link, Route, Switch } from 'dva/router';
import { Table, Button, Modal, Drawer, Popconfirm, Select, message, Tree, Spin, Tag } from 'antd';
import UserForm from './components/UserForm';
import style from '../IndexPage.css';

const { Option } = Select;

function AdminManager({dispatch, user, userList }){
    const { companyList, currentCompany, authorized } = user;
    const { list, total, currentPage, roleList, selectedRowKeys } = userList;
    const [regionVisible, setRegionVisible] = useState(false);
    const [info, setInfo] = useState({ visible:false });
    const columns = [
        {
            title:'序号',
            width:'60px',
            render:(text,record,index)=>{
                return `${ ( currentPage - 1) * 12 + index + 1}`;
            }
        },
        {
            title:'用户名',
            dataIndex:'userName',
            key:'userName',
            render:(value, row)=>{
                if ( +row.userId === +localStorage.getItem('userId') ) {
                    return <span>{ value } <Tag color="geekblue">登录账号</Tag></span>
                } else {
                    return <span>{ value }</span>
                }
            }
        },
        // {
        //     title:'归属代理商',
        //     dataIndex:'agent_name',
        //     key:'agent_name'
        // },
        // {
        //     title:'归属公司',
        //     dataIndex:'company_name',
        //     key:'company_name'
        // },
        {
            title:'真实姓名',
            dataIndex:'realName',
        },
        // {
        //     title:'角色类型',
        //     dataIndex:'role_name',
        //     key:'role_name',
        //     render: value=>(<span>{ value ? value : '还未分配角色' }</span>)
        // },
        {
            title:'最后登录IP',
            dataIndex:'lastLoginIp',
            key:'last_login_ip',
            render: value=>(<span>{ value ? value : '还未登录过' }</span>)
        },
        {
            title:'最后登录时间',
            dataIndex:'lastLoginTime',
            key:'last_login_time',
            render: value=>(<span>{ value ? value : '还未登录过' }</span>)
        },
        {
            title:'是否可登录',
            dataIndex:'isActived',
            key:'isActived',
            render:(text,record)=>(
                <span>{record.isActived==1 ?'是':'否'}</span>
            )
        },
        {
            title:'操作',
            key:'action',     
            render:(row, record)=>(
                <div className={style['action-container']}>
                    {/* <a style={{marginRight:'10px'}} onClick={()=>{
                        setRegionVisible(true);
                        setCurrentUser(record.user_id);
                        dispatch({type:'userList/fetchUserRegion', payload : record.user_id });
                    }}>管辖区域</a> */}
                    <a onClick={()=>setInfo({ visible:true, forEdit:true, current:row })}>编辑</a>
                </div>
            )       
        }
    ];
    const rowSelection = {
        selectedRowKeys,
        getCheckboxProps:record=>({
            disabled:record.userId === +localStorage.getItem('userId')
        }),
        onChange: selectedRowKeys => {       
            dispatch({type:'userList/setSelectedRowKeys', payload:selectedRowKeys })
        }
    };

    useEffect(()=>{
        if ( authorized ){
            dispatch({ type:'userList/fetchUserList'});
        }
    },[authorized]);
    const onDispatch = useCallback((action)=>{
        dispatch(action);
    },[]);
    const handleClose = useCallback((action)=>{
        setInfo({ visible:false });
    },[]);
    return (
                <div className={style['card-container']}>
                    <div style={{ padding:'20px 0 0 20px'}}>
                        <Button style={{ marginRight:'10px' }} type="primary" onClick={()=>setInfo({ visible:true })}>添加用户</Button>
                        <Popconfirm title="确定要删除用户吗?" okText="确定" cancelText="取消" onConfirm={()=>{
                            if ( !selectedRowKeys.length ) {
                                message.info('请先选择要删除的用户');
                            } else {
                                new Promise((resolve, reject)=>{
                                    dispatch({ type:'userList/delUserAsync', payload:{ resolve, reject }})
                                })
                                .then(()=>{
                                    message.success('删除用户成功');
                                })
                                .catch(msg=>message.error(msg))
                            }
                        }}><Button type="primary">删除用户</Button></Popconfirm>
                       
                    </div> 
                    
                    <Table 
                        rowKey="userId" 
                        columns={columns} 
                        dataSource={list} 
                        bordered={true}
                        className={style['self-table-container']}
                        rowSelection={rowSelection}
                        pagination={{current:currentPage, total, pageSize:12, showSizeChanger:false }}
                        onChange={(pagination)=>{
                            dispatch({type:'userList/fetchUserList', payload:{ pageNum:pagination.current}});
                        }}
                    />
                    <Modal
                        title={info.forEdit ? '修改用户':'创建新用户'}
                        visible={info.visible ? true : false }
                        destroyOnClose={true}
                        onCancel={()=>setInfo({ visible:false })}
                        footer={null}
                    >
                        <UserForm 
                            companyList={[]}
                            roleList={roleList}
                            info={info}
                            onDispatch={onDispatch}
                            onClose={handleClose}
                        />
                    </Modal>
                        
                    {/* <Drawer
                        title="管辖区域设置"
                        placement="right"
                        closable={false}
                        width="40%"
                        onClose={()=>setRegionVisible(false)}
                        visible={ regionVisible }
                    >        
                        {
                            treeLoading 
                            ?
                            <Spin />
                            :
                            <Tree
                                checkable
                                // checkStrictly
                                defaultExpandAll={true}
                                checkedKeys={regionList}
                                onCheck={(checkedKeys)=>{
                                    dispatch({type:'userList/selectRegion', payload:checkedKeys});                                                                     
                                }}
                                treeData={allRegions}
                            />
                        }   
                        <div style={{ margin:'40px 0'}}>
                            <Button type='primary' onClick={()=>{
                                new Promise((resolve, reject)=>{
                                    dispatch({ type:'userList/setUserRegion', payload:{ currentUser, resolve, reject }});
                                })
                                .then(()=>{
                                    message.info('设置成功');
                                    setRegionVisible(false);
                                })
                                .catch(msg=>{
                                    message.error(msg);
                                })
                            }}>确定</Button>
                            <Button onClick={()=>setRegionVisible(false)} style={{marginLeft:'10px'}}>取消</Button>
                        </div>
                        
                    </Drawer>  */}
                </div>         
    )
}
AdminManager.propTypes = {
};

export default connect(({userList, user })=>({userList, user }))(AdminManager);
