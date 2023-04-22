import React, { useEffect, useState } from 'react';
import { Select, Input, Button, DatePicker } from 'antd';
import { SearchOutlined, ReloadOutlined  } from '@ant-design/icons';
import style from '@/pages/IndexPage.css';
import zhCN from 'antd/es/date-picker/locale/zh_CN';

function TableSelector({ onSearch }){
    const [sensorName, setSensorName] = useState('');
    const [sensorCode, setSensorCode] = useState('');
    return (
        <div className={style['card-container']} style={{ boxShadow:'none' }}>
                    <div className={style['card-title']}><span>查询表格</span></div>
                    <div className={style['card-content']} style={{ padding:'0', display:'flex', alignItems:'center', padding:'0 1rem' }}>
                        <div style={{ display:'inline-flex', alignItems:'center', width:'260px', marginRight:'1rem' }}>
                            <span>传感器名称</span>
                            <Input placeholder='输入名称查询' style={{ flex:'1', marginLeft:'0.5rem' }} value={sensorName} onChange={e=>setSensorName(e.target.value)} allowClear />
                        </div>
                        <div style={{ display:'inline-flex', alignItems:'center', width:'260px', marginRight:'1rem'  }}>
                            <span>传感器编码</span>
                            <Input placeholder='输入编码查询' style={{ flex:'1', marginLeft:'0.5rem' }} value={sensorCode} onChange={e=>setSensorCode(e.target.value)} allowClear />
                        </div>
                        <div style={{ marginLeft:'1rem' }}>
                            <Button type='primary' icon={<SearchOutlined />} style={{ marginRight:'0.5rem' }} onClick={()=>{
                                onSearch({ sensorName, sensorCode });
                            }}>查询</Button>
                            <Button icon={<ReloadOutlined />} onClick={()=>{
                                onSearch({});
                                setSensorName('');
                                setSensorCode('');
                            }}>重置</Button>
                        </div>
                    </div>
                </div>
    )
}

export default TableSelector;