import React, { useEffect, useState } from 'react';
import { Select, Button, DatePicker } from 'antd';
import { SearchOutlined, ReloadOutlined  } from '@ant-design/icons';
import CustomDatePicker from '@/components/CustomDatePicker';
import style from '@/pages/IndexPage.css';

import zhCN from 'antd/es/date-picker/locale/zh_CN';

function TableSelector({ machList, onSearch }){
    const [equipmentCode, setEquipmentCode] = useState('');
    
    return (
        <div className={style['card-container']} style={{ boxShadow:'none' }}>
                    <div className={style['card-title']}><span>查询条件</span></div>
                    <div className={style['card-content']} style={{ padding:'0', display:'flex', alignItems:'center', padding:'0 1rem' }}>
                        <div style={{ display:'inline-flex', alignItems:'center', flex:'1', marginRight:'1rem' }}>
                            <span>设备选择</span>
                            <Select style={{ flex:'1', marginLeft:'0.5rem' }} onChange={value=>setEquipmentCode(value)}>
                                {
                                    machList.map(item=>(
                                        <Option key={item.equipmentCode} value={item.equipmentCode}>{ item.equipmentName }</Option>
                                    ))
                                }
                            </Select>
                        </div>
                        <div style={{ display:'inline-flex', alignItems:'center', flex:'1', marginRight:'1rem'  }}>
                            <span>告警类型</span>
                            <Select style={{ flex:'1', marginLeft:'0.5rem' }}>
                                <Option value={1}>电机</Option>
                            </Select>
                        </div>
                        <div style={{ display:'inline-flex', alignItems:'center', flex:'3', marginRight:'1rem' }}>
                            <span style={{ marginRight:'0.5rem' }}>时间区间</span>
                            <CustomDatePicker />
                        </div>
                       
                        <div style={{ marginLeft:'1rem' }}>
                            <Button type='primary' icon={<SearchOutlined />} style={{ marginRight:'0.5rem' }} onClick={()=>onSearch({ equipmentCode })}>查询</Button>
                            <Button icon={<ReloadOutlined />} onClick={()=>{
                                setEquipmentCode('');
                                onSearch({});
                                
                            }}>重置</Button>
                        </div>
                    </div>
                </div>
    )
}

export default React.memo(TableSelector);