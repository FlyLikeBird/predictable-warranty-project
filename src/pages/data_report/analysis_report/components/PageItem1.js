import React from 'react';
import MultiPieChart from './charts/MultiPieChart';
import MultiBarChart from './charts/MultiBarChart';
import VerticalBarChart from './charts/VerticalBarChart';
import style from '../AnalysisReport.css';

function PageItem0(){
    return (
        <div className={style['page-container']}>
            <div className={style['page-title']}>
                <div className={style['text-container']}>平台告警趋势</div>
                <div className={style['symbol']}></div>
            </div>          
          
            <div style={{ height:'300px', display:'flex', paddingBottom:'1rem' }}>
                <div style={{ flex:'1', background:'#f7f8fa' }}>
                    <MultiPieChart title='告警类型分布'  hasLabel={true} data={{ '震动告警':10, '震动预警':30, '电流越限':3, '电压越限':5, '温度越限':14 }} type='warningType' />
                </div>
                <div style={{ flex:'1', background:'#f7f8fa' }}>
                    <MultiPieChart title='处理情况占比'  data={{ '已处理':10, '未处理':30, '自动转工单':25, '手动转工单':40 }} type='warningStatus' />
                </div>
            </div>
            <div style={{ height:'340px', paddingBottom:'1rem' }}>
                <MultiBarChart title='告警趋势'  />
            </div>
            <div style={{ height:'340px', paddingBottom:'1rem' }}>
                <VerticalBarChart title='电机告警排名' />
            </div>
        </div>
    )
}

export default PageItem0;