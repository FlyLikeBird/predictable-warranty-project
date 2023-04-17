import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import { DatePicker, Select, Radio } from 'antd';
import { LeftOutlined, RightOutlined, FileExcelOutlined } from '@ant-design/icons';
import style from '@/pages/IndexPage.css';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';

const { RangePicker } = DatePicker;

const date = new Date();

function getDatePicker(timeType){
    let startDate, endDate;
    let date = new Date();
    if ( timeType === '3'){
        // 小时维度
        startDate = endDate = moment(date);
    }
    if ( timeType === '2'){
        // 日维度
        startDate = moment(date).startOf('month');
        endDate = moment(date).endOf('month');
    }
    if ( timeType === '1'){
        // 月维度
        startDate = moment(date).startOf('year');
        endDate = moment(date).endOf('year');
    }
    if ( timeType === '4' ){
        // 年维度
        startDate = moment(date).subtract(1,'years').startOf('year');
        endDate = moment(date);
    }
    if ( timeType === '10' ){
        // 周维度  ，调整周的起始日从周日为周一
        startDate = moment(date).startOf('week').add(1, 'days');
        endDate = moment(date).endOf('week').add(1, 'days');
    }
    return { startDate, endDate };
}
function CustomDatePicker({ onDispatch, size, noToggle, noDay, noWeek, noMonth }){
    const [timeType, setTimeType] = useState('2');
    return (
            <Select 
                className={style['custom-select']}
                style={{ width:'100px', marginLeft:'1rem' }}
                value={timeType}
                onChange={value=>{
                    let { startDate, endDate } = getDatePicker(value);
                    setTimeType(value);
                    let finalTimeType = value === '10' ? '2' : value;
                    if ( onDispatch ) onDispatch({ startDate, endDate, timeType:finalTimeType });
                }}
                options={[
                    { label:'本日', value:'3' },
                    { label:'本周', value:'10' },
                    { label:'本月', value:'2' },
                    { label:'本年', value:'1' }
                ]}
            />
    )
}

export default CustomDatePicker;