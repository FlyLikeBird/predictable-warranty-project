import React, { useEffect, useState } from 'react';
import { Select, Button, Input, DatePicker } from 'antd';
import { SearchOutlined, ReloadOutlined  } from '@ant-design/icons';
import CustomDatePicker from '@/components/CustomDatePicker';
import style from '@/pages/IndexPage.css';
import zhCN from 'antd/es/date-picker/locale/zh_CN';

function TableSelector({ operateType, onChangeType, operateUserName, onChangeName, onSearch }){
    return (
        <div className={style['card-container']} style={{ boxShadow:'none' }}>
                    <div className={style['card-title']}><span>查询表格</span></div>
                    <div className={style['card-content']} style={{ padding:'0', display:'flex', alignItems:'center', padding:'0 1rem' }}>
                        <div style={{ display:'inline-flex', alignItems:'center', flex:'1', marginRight:'1rem' }}>
                            <span>日志类型</span>
                            <Select style={{ flex:'1', marginLeft:'0.5rem' }} value={operateType} onChange={value=>onChangeType(value)}>
                                <Option value=''>全部</Option>
                                <Option value='增'></Option>
                                <Option value='删'></Option>
                                <Option value='改'></Option>
                                <Option value='查'></Option>
                            </Select>
                        </div>
                        <div style={{ display:'inline-flex', alignItems:'center', flex:'1', marginRight:'1rem'  }}>
                            <span>用户名</span>
                            <Input style={{ flex:'1', marginLeft:'0.5rem' }} value={operateUserName} onChange={e=>onChangeName(e.target.value)} />
                        </div>
                        {/* <div style={{ display:'inline-flex', alignItems:'center', flex:'3', marginRight:'1rem' }}>
                            <span style={{ marginRight:'0.5rem' }}>时间区间</span>
                            <CustomDatePicker />
                        </div> */}
                        <div style={{ flex:'2', marginLeft:'1rem' }}>
                            <Button type='primary' icon={<SearchOutlined />} style={{ marginRight:'0.5rem' }} onClick={()=>{
                                onSearch({ type:'userList/fetchLogList', payload:{ operateType, operateUserName }});
                            }}>查询</Button>
                            <Button icon={<ReloadOutlined />} onClick={()=>{
                                onChangeName('');
                                onChangeType('');
                            }}>重置</Button>
                        </div>
                    </div>
                </div>
    )
}
export default React.memo(TableSelector);