import React from 'react';
import NormalPieChart from './charts/NormalPieChart';
import RingPieChart from './charts/RingPieChart';
import MultiPieChart from './charts/MultiPieChart';
import style from '../AnalysisReport.css';

function PageItem0(){
    return (
        <div className={style['page-container']}>
            <div className={style['page-title']}>
                <div className={style['text-container']}>平台概览</div>
                <div className={style['symbol']}></div>
            </div>
            <div style={{ height:'128px', paddingBottom:'1rem' }}>
                <div style={{ display:'flex', height:'100%', justifyContent:'space-between' }}>
                    <div style={{ width:'calc((100% - 3rem )/4 )', borderRadius:'4px', backgroundImage:'linear-gradient(to Right, #16aeff, #1676ff)', color:'#fff', display:'flex', flexDirection:'column', justifyContent:'space-around', alignItems:'center' }}>
                        <div style={{ fontWeight:'bold' }}>电机总数</div>
                        <div>
                            <span style={{ fontSize:'2rem' }}>42</span>
                            <span>台</span>
                        </div>
                        <div>
                            <span style={{ marginRight:'4px' }}>运行中</span>
                            <span>41</span>
                            <span style={{ marginLeft:'1rem' }}>42.63%</span>
                        </div>
                    </div>
                    <div style={{ width:'calc((100% - 3rem )/4 )', borderRadius:'4px', background:'#f7f8fa', display:'flex', flexDirection:'column', justifyContent:'space-around', alignItems:'center' }}>
                        <div style={{ fontWeight:'bold' }}>采集设备数</div>
                        <div style={{ color:'#195fff' }}>
                            <span style={{ fontSize:'2rem' }}>45</span>
                            <span>台</span>
                        </div>
                        <div>
                            <span style={{ marginRight:'4px' }}>上月</span>
                            <span>3482</span>
                            <span style={{ marginLeft:'1rem' }}>42.63%</span>
                        </div>
                    </div>
                    <div style={{ width:'calc((100% - 3rem )/4 )', borderRadius:'4px', background:'#f7f8fa', display:'flex', flexDirection:'column', justifyContent:'space-around', alignItems:'center' }}>
                        <div style={{ fontWeight:'bold' }}>采集设备异常次数</div>
                        <div style={{ color:'#f54b4c' }}>
                            <span style={{ fontSize:'2rem' }}>3</span>
                            <span>次</span>
                        </div>
                        <div>
                            <span style={{ marginRight:'4px' }}>上月</span>
                            <span>10</span>
                            <span style={{ marginLeft:'1rem' }}>42.63%</span>
                        </div>
                    </div>
                    <div style={{ width:'calc((100% - 3rem )/4 )', borderRadius:'4px', background:'#f7f8fa', display:'flex', flexDirection:'column', justifyContent:'space-around', alignItems:'center' }}>
                        <div style={{ fontWeight:'bold' }}>电机运行成本</div>
                        <div style={{ color:'#195fff' }}>
                            <span style={{ fontSize:'2rem' }}>3400</span>
                            <span>元</span>
                        </div>
                        <div>
                            <span style={{ marginRight:'4px' }}>上月</span>
                            <span>3482</span>
                            <span style={{ marginLeft:'1rem' }}>42.63%</span>
                        </div>
                    </div>
                </div>
            </div>
            {/*  */}
            <div style={{ height:'260px', paddingBottom:'1rem' }}>
                <div style={{ height:'100%', display:'flex', justifyContent:'space-between' }}>
                    <div style={{ width:'calc((100% - 2rem )/3 )', borderRadius:'4px', background:'#f7f8fa' }}>
                        <RingPieChart title='设备异常率' data={{ '发生异常':{ value:10, color:'#ff7b00'}, '未有异常':{ value:30, color:'#e5e6eb'}}} />
                    </div>
                    <div style={{ width:'calc((100% - 2rem )/3 )', borderRadius:'4px', background:'#f7f8fa' }}>
                        <NormalPieChart title='电机状态分布' data={{ '良好':{ value:23, color:'#00b42a'}, '一般':{ value:13, color:'#165dff'}, '隐患':{ value:3, color:'#ff7d00' }, '故障':{ value:3, color:'#f53f3f'}}} />
                    </div>
                    <div style={{ width:'calc((100% - 2rem )/3 )', borderRadius:'4px', background:'#f7f8fa' }}>
                        <NormalPieChart title='电机投产时长分布' data={{ '0-1年':{ value:5, color:'#00b42a'}, '1-5年':{ value:6, color:'#165dff'}, '5-15年':{ value:28, color:'#ff7d00' }, '15年+':{ value:3, color:'#f53f3f'}}} />
                    </div>
                </div>
            </div>
            {/*  */}
            <div style={{ height:'240px', display:'flex', paddingBottom:'1rem' }}>
                <div style={{ flex:'1', background:'#f7f8fa' }}>
                    <MultiPieChart title='告警类型分布'  hasLabel={true} data={{ '震动告警':10, '震动预警':30, '电流越限':3, '电压越限':5, '温度越限':14 }} type='warningType' />
                </div>
                <div style={{ flex:'1', background:'#f7f8fa' }}>
                    <MultiPieChart title='处理情况占比'  data={{ '已处理':10, '未处理':30, '自动转工单':25, '手动转工单':40 }} type='warningStatus' />
                </div>
            </div>
            <div style={{ height:'240px', display:'flex', paddingBottom:'1rem' }}>
                <div style={{ flex:'1', background:'#f7f8fa' }}>
                    <MultiPieChart title='工单类型占比'  hasLabel={true}  data={{ '维修工单':5, '保养工单':30, '手动新建工单':40 }} type='orderType' />
                </div>
                <div style={{ flex:'1', background:'#f7f8fa' }}>
                    <MultiPieChart title='工单情况占比'  data={{ '已处理':8, '未处理':30, '挂起':10 }} type='orderStatus' />
                </div>
            </div>
            <div style={{ height:'120px', display:'flex', background:'#f7f8fa' }}>
                <div style={{ width:'60px', height:'60px', borderRadius:'50%', backgroundImage:'linear-gradient(to Bottom, #2368ff, #a0d0ff)' }}></div>
                <ul style={{ color:'#1860ff'}}>
                    <li>XXXXXXXXXX</li>
                    <li>XXXXXXXXXX</li>
                    <li>XXXXXXXXXX</li>
                    <li>XXXXXXXXXX</li>
                    <li>XXXXXXXXXX</li>

                </ul>
            </div>
        </div>
    )
}

export default PageItem0;