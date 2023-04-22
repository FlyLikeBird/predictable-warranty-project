import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'dva';
import { DatePicker, Select, Radio } from 'antd';
import { LeftOutlined, RightOutlined, FileExcelOutlined } from '@ant-design/icons';
import style from './CustomDatePicker.css';
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

function getAddedDate(startDate, timeType, action){
    let start, end;
    let temp = new Date(startDate.format('YYYY-MM-DD'));
    let timeStr = 
        timeType === '3' ? 'day' :
        timeType === '2' ? 'month' :
        timeType === '1'|| timeType === '4' ? 'year' :
        timeType === '10' ? 'week' : '';
    if ( action === 'add' ) {
        if ( timeType === '10') {
            start = moment(temp).startOf('week').add(1,'weeks').add( 1, 'days');
            end = moment(temp).endOf('week').add(1, 'weeks').add( 1, 'days');
        } else {
            start = moment(temp).add(1, timeStr + 's').startOf(timeStr);
            end = moment(temp).add(1, timeStr + 's').endOf(timeStr);
        }
    } else {
        if ( timeType === '10') {
            start = moment(temp).startOf('week').subtract(1, 'weeks').add(1, 'days');
            end = moment(temp).endOf('week').subtract(1, 'weeks').add(1, 'days');
        } else {
            start = moment(temp).subtract(1, timeStr + 's').startOf(timeStr);
            end = moment(temp).subtract(1, timeStr + 's').endOf(timeStr);
        }
    }
    return { startDate:start, endDate:end };
}

function CustomDatePicker({ onDispatch, size, noToggle, noDay, noWeek, noMonth, noYear }){
    const [timeType, setTimeType] = useState('2');
    const [startDate, setStartDate] = useState(moment(date).startOf('month'));
    const [endDate, setEndDate] = useState(moment(date).endOf('month'));
    const inputRef = useRef();
    useEffect(()=>{
        if ( onDispatch ){
            onDispatch({ startDate, endDate, timeType })
        }
    },[])
    return (
        <div>
            {
                noToggle 
                ?
                null
                :
                <Radio.Group size='small' className={style['custom-radio']}  style={{ marginRight:'1rem' }} buttonStyle='solid' value={timeType} onChange={e=>{
                    setTimeType(e.target.value);
                    let { startDate, endDate } = getDatePicker(e.target.value);
                    setStartDate(startDate);
                    setEndDate(endDate);
                    if(onDispatch && typeof onDispatch === 'function') onDispatch({ startDate, endDate, timeType:e.target.value });
                }}>
                    {
                        noDay 
                        ?
                        null
                        :
                        <Radio.Button value='3'>日</Radio.Button>
                    }
                    {
                        noWeek 
                        ?
                        null
                        :
                        <Radio.Button value='10'>周</Radio.Button>
                    }
                    {
                        noMonth
                        ?
                        null
                        :
                        <Radio.Button value='2'>月</Radio.Button>
                    }
                    {
                        noYear 
                        ?
                        null
                        :
                        <Radio.Button value='1'>年</Radio.Button>
                    }
                </Radio.Group>
            }
            
            <div style={{ display:'inline-flex'}}>
                <div className={style['date-picker-button-left']} onClick={()=>{
                    let result = getAddedDate(startDate, timeType, 'subtract');
                    setStartDate(result.startDate);
                    setEndDate(result.endDate);
                    if(onDispatch && typeof onDispatch === 'function') onDispatch({ startDate:result.startDate, endDate:result.endDate, timeType });
                }}><LeftOutlined /></div>
                {
                    timeType === '3' 
                    ?
                    <DatePicker ref={inputRef} size='small' locale={zhCN} allowClear={false} className={style['custom-date-picker']} value={startDate} onChange={value=>{
                        setStartDate(value);
                        if(onDispatch && typeof onDispatch === 'function') onDispatch({ startDate:value, endDate:value, timeType });
                        if ( inputRef.current && inputRef.current.blur ) inputRef.current.blur();
                    }} />
                    :
                    timeType === '10' 
                    ?
                    <DatePicker ref={inputRef} size='small' locale={zhCN} picker='week' allowClear={false} className={style['custom-date-picker']} value={startDate} onChange={value=>{
                        let start = moment(value.format('YYYY-MM-DD')).startOf('week').add(1, 'days');
                        let end = moment(value.format('YYYY-MM-DD')).endOf('week').add(1, 'days');
                        setStartDate(start);
                        setEndDate(end);
                        if(onDispatch && typeof onDispatch === 'function') onDispatch({ startDate:value, endDate:value, timeType });
                        if ( inputRef.current && inputRef.current.blur ) inputRef.current.blur();
                    }} />
                    :
                    <RangePicker ref={inputRef} size='small' locale={zhCN} picker={ timeType === '1' ? 'month' : timeType === '4' ? 'year' : 'date' } allowClear={false} className={style['custom-date-picker']} value={[startDate, endDate]} onChange={arr=>{
                        let start = arr[0];
                        let end = arr[1];
                        if ( timeType === '1' ) {
                            start = arr[0].startOf('month');
                            end = arr[1].endOf('month');
                        }
                        if ( timeType === '4'){
                            start = arr[0].startOf('year');
                            end = arr[1].endOf('year');
                        }
                        setStartDate(start);
                        setEndDate(end);
                        if(onDispatch && typeof onDispatch === 'function') onDispatch({ startDate:value, endDate:value, timeType });
                        if ( inputRef.current && inputRef.current.blur ) inputRef.current.blur();
                    }}/>
                }
                
                <div className={style['date-picker-button-right']} onClick={()=>{
                    let result = getAddedDate(startDate, timeType, 'add');
                    setStartDate(result.startDate);
                    setEndDate(result.endDate);
                    if(onDispatch && typeof onDispatch === 'function') onDispatch({ startDate:result.startDate, endDate:result.endDate, timeType });
                }}><RightOutlined /></div>
            </div>
            
        </div>
    )
}

export default CustomDatePicker;