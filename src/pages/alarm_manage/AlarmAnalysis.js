import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import TableSelector from './components/TableSelector';
import PieChart from './components/PieChart';
import RankBarChart from './components/RankBarChart';
import MultiBarChart from './components/MultiBarChart';
import style from '@/pages/IndexPage.css';

function AlarmAnalysis({ dispatch, user, mach, alarm, board }){
    const { authorized } = user;
    const { alarmPercent, alarmTrend } = alarm;
    const { chartSourceData } = board;
    useEffect(()=>{
        if ( authorized ) {
            dispatch({ type:'user/toggleTimeType', payload:'2' });
            dispatch({ type:'mach/fetchMachList'});
            dispatch({ type:'alarm/initAnalysis'});
        }
        return ()=>{
            dispatch({ type:'alarm/cancelAll'});
        }
    },[authorized]);
    const handleSearch = useCallback((obj)=>{
        dispatch({ type:'alarm/setOptional', payload:obj });
        dispatch({ type:'alarm/initAnalysis'});
    },[])
    return (
        <>
            <div style={{ height:'90px' }}>
                <TableSelector machList={mach.list} onSearch={handleSearch} />
            </div>  
            <div style={{ height:'calc( 100% - 90px)', paddingTop:'1rem' }}>
                <div style={{ height:'50%' }}>
                    <div className={style['card-container-wrapper']} style={{ width:'50%' }}>
                        <div className={style['card-container']} style={{ boxShadow:'none' }}>
                            <div className={style['card-title']}>告警占比</div>
                            <div className={style['card-content']}>
                                {
                                    Object.keys(alarmPercent).length 
                                    ?
                                    <PieChart data={alarmPercent} />
                                    :
                                    <Spin className={style['spin']} />
                                }
                            </div>
                        </div>
                    </div>
                    <div className={style['card-container-wrapper']} style={{ width:'50%', paddingRight:'0' }}>
                        <div className={style['card-container']} style={{ boxShadow:'none' }}>
                            <div className={style['card-title']}>电机异常排名</div>
                            <div className={style['card-content']}>
                                {
                                    chartSourceData['mach-alarm-rank'] 
                                    ?
                                    <RankBarChart data={chartSourceData['mach-alarm-rank']} />
                                    :
                                    <Spin className={style['spin']} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ height:'50%' }}>
                    <div className={style['card-container']} style={{ boxShadow:'none' }}>
                        <div className={style['card-title']}>告警趋势</div>
                        <div className={style['card-content']}>
                            {
                                Object.keys(alarmTrend).length 
                                ?
                                <MultiBarChart data={alarmTrend} />
                                :
                                <Spin className={style['spin']} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default connect(({ user, alarm, mach, board })=>({ user, alarm, mach, board }))(AlarmAnalysis);