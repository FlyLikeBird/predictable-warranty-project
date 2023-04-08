import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Button, Table, Modal } from 'antd';
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import OrderSelector from './components/OrderSelector';
import OrderForm from './components/OrderForm';
import style from '@/pages/IndexPage.css'

function OrderManager({ dispatch, user, order, mach, userList }){
    const { authorized } = user;
    const { orderList, currentPage, total } = order;
    const [info, setInfo] = useState({ visible:false });
    useEffect(()=>{
        if ( authorized ){
            dispatch({ type:'order/initOrder'});
        }
    },[authorized])
    const columns = [
        { title:'工单编号' },
        { title:'工单类型'},
        { title:'关联设备'},
        { title:'预计完成时间'},
        { title:'生成日期'},
        { title:'负责人'},
        { title:'联系方式' },
        { title:'工单状态'},
        {
            title:'操作',
            render:row=>(
                <>
                    <span>操作</span>
                    <span>删除</span>
                </>
            )
        }
    ]
    return (
        <>
            <div style={{ height:'90px' }}>
                <OrderSelector />
            </div>
            <div style={{ height:'calc( 100% - 90px)', paddingTop:'1rem' }}>
                <div className={style['card-container']} style={{ boxShadow:'none', paddingTop:'1rem' }}>
                    <div className={style['card-title']}>
                        <div>
                            <Button type='primary' icon={<PlusOutlined />} style={{ marginRight:'0.5rem' }} onClick={()=>setInfo({ visible:true })}>新建</Button>
                            <Button>批量导入</Button>
                        </div>
                        <Button icon={<DownloadOutlined />}>下载</Button>
                    </div>
                    <div className={style['card-content']} >
                        <Table
                            columns={columns}
                            style={{ padding:'0' }}
                            className={style['self-table-container']}
                            dataSource={[]}
                        />
                    </div>
                </div>
                <Modal
                    title={info.forEdit ? '修改工单' : '新建工单'}
                    open={info.visible ? true : false}
                    onCancel={()=>setInfo({ visible:false })}
                    footer={null}
                >
                    <OrderForm 
                        info={info}
                        userList={userList.list}
                        machList={mach.list}
                        onDispatch={action=>dispatch(action)}
                        onClose={()=>setInfo({ visible:false })}
                    />
                </Modal>
            </div> 
        </> 
    )
}

export default connect(({ user, order, mach, userList })=>({ user, order, mach, userList }))(OrderManager);