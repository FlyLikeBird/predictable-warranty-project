import React, { useEffect } from 'react';
import { connect } from 'dva';
import TableSelector from './components/TableSelector';
import TableContainer from './components/RunningTable';

function RunningReport({ dispatch, user, report, mach }){
    const { authorized } = user;
    const { list, category, dateColumn } = report;
    useEffect(()=>{
        if ( authorized ){
            dispatch({ type:'user/toggleTimeType', payload:'3' });
            dispatch({ type:'mach/fetchMachList'});
            dispatch({ type:'report/fetchRunningReport'});
        }
    },[authorized])
    return (
        <>
            <div style={{ height:'90px' }}>
                <TableSelector list={mach.list} onSearch={payload=>dispatch({ type:'report/fetchRunningReport', payload })} />
            </div> 
            <div style={{ height:'calc( 100% - 90px)', paddingTop:'1rem' }}>
                <TableContainer list={list} category={category} dateColumn={dateColumn} />
            </div>
        </>
    )
}

export default connect(({ user, report, mach })=>({ user, report, mach }))(RunningReport);