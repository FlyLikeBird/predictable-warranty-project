import React, { useEffect, useState } from 'react';
import { Select, Button, DatePicker } from 'antd';
import { SearchOutlined, ReloadOutlined  } from '@ant-design/icons';
import CustomDatePicker from '@/components/CustomDatePicker';
import style from '@/pages/IndexPage.css';

import zhCN from 'antd/es/date-picker/locale/zh_CN';

function TableSelector({ onSearch }){
    const [type, setType] = useState(0);
    const [status, setStatus] = useState(0);
    const [date, setDate] = useState(null);
    const [brand, setBrand] = useState(0);
    console.log('selector-render');
    return (
        <div className={style['card-container']} style={{ boxShadow:'none' }}>
                    <div className={style['card-title']}><span>查询条件</span></div>
                    <div className={style['card-content']} style={{ padding:'0', display:'flex', alignItems:'center', padding:'0 1rem' }}>
                        <div style={{ display:'inline-flex', alignItems:'center', flex:'1', marginRight:'1rem' }}>
                            <span>设备选择</span>
                            <Select style={{ flex:'1', marginLeft:'0.5rem' }}>
                                <Option value={1}>电机</Option>
                            </Select>
                        </div>
                        <div style={{ display:'inline-flex', alignItems:'center', flex:'3', marginRight:'1rem' }}>
                            <span style={{ marginRight:'0.5rem' }}>时间区间</span>
                            <CustomDatePicker />
                        </div>
                       
                        <div style={{ marginLeft:'1rem' }}>
                            <Button type='primary' icon={<SearchOutlined />} style={{ marginRight:'0.5rem' }} onClick={()=>{
                                onSearch({ x: 10, date:date.format('YYYY-MM-DD') });
                            }}>查询</Button>
                            <Button icon={<ReloadOutlined />} onClick={()=>{
                                
                            }}>重置</Button>
                        </div>
                    </div>
                </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.onSearch !== nextProps.onSearch ){
        return false;
    } else {
        return true;
    }
}

export default React.memo(TableSelector, areEqual);