import React, { useEffect, useState } from 'react';
import { Select, Button, DatePicker } from 'antd';
import { SearchOutlined, ReloadOutlined  } from '@ant-design/icons';
import CustomDatePicker from '@/components/CustomDatePicker';
import style from '@/pages/IndexPage.css';
import zhCN from 'antd/es/date-picker/locale/zh_CN';

function TableSelector({ list, onSearch }){
    const [equipmentCode, setEquipmentCode] = useState(0);
    return (
        <div className={style['card-container']} style={{ boxShadow:'none' }}>
                    <div className={style['card-title']}><span>查询条件</span></div>
                    <div className={style['card-content']} style={{ padding:'0', display:'flex', alignItems:'center', padding:'0 1rem' }}>
                        <div style={{ display:'inline-flex', alignItems:'center', marginRight:'1rem' }}>
                            <span>设备选择</span>
                            <Select style={{ width:'240px', marginLeft:'0.5rem' }} value={equipmentCode} onChange={value=>{
                                setEquipmentCode(value);
                            }}>
                                <Option value={0}>全部</Option>
                                {
                                    list.map(item=>(
                                        <Option key={item.equipmentCode} value={item.equipmentCode}>{ item.equipmentName }</Option>
                                    ))
                                }
                            </Select>
                        </div>
                        <div style={{ display:'inline-flex', alignItems:'center', marginRight:'1rem' }}>
                            <span style={{ marginRight:'0.5rem' }}>时间区间</span>
                            <CustomDatePicker noToggle={true} />
                        </div>
                       
                        <div style={{ marginLeft:'1rem' }}>
                            <Button type='primary' icon={<SearchOutlined />} style={{ marginRight:'0.5rem' }} onClick={()=>{
                                onSearch({ equipmentCode });
                            }}>查询</Button>
                            <Button icon={<ReloadOutlined />} onClick={()=>{
                                setEquipmentCode('');
                                onSearch({});
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