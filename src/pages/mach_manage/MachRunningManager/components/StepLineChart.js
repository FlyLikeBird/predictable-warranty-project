import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'dva';
import { Radio, Card, Button, message } from 'antd';
import { LineChartOutlined, BarChartOutlined, PieChartOutlined, DownloadOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import html2canvas from 'html2canvas';
import CustomDatePicker from '@/components/CustomDatePicker';

const data = [];
for ( var i=0;i<24;i++){
    data.push({ date:( i < 10 ? '0' + i : i ) + ':00', value:30 + Math.random() * 30 })
}
const optionList = [
    { label:'加速度', key:0 }, { label:'平均速度', key:1 }, { label:'温度', key:2 }, { label:'电压', key:3 }, { label:'峭度', key:4 },
    { label:'偏斜度', key:5 }, { label:'偏差度', key:6  }, { label:'峰值因子', key:7 }
]
function StepLineChart({ onDispatch, currentMach }) {
    const [optionType, setOptionType] = useState(optionList[0]);
    const [chartInfo, setChartInfo] = useState({});
    useEffect(()=>{
        if ( Object.keys(currentMach).length ) {
            new Promise((resolve, reject)=>{
                onDispatch({ type:'mach/fetchMachRunningChart', payload:{ resolve, reject, equipmentCode:currentMach.equipmentCode, optionType:optionType.key }})
            })
            .then((data)=>{
                console.log(data);
            })
            .catch(msg=>message.error(msg))
        }
    },[currentMach])
    let seriesData = [];
    seriesData.push({
        name:'hello',
        type:'line',
        step:'middle',
        symbol:'none',
        itemStyle:{ color:'#f9bc81' },
        areaStyle:{
            color:'#f9bc81',
            opacity:0.2
        },
        data:data.map(i=>i.value)
    })
    return (   
        <div style={{ height:'100%', position:'relative' }}>
            <div style={{ position:'absolute', top:'0', display:'flex', justifyContent:'space-between' }}>
                
            </div>
            <ReactEcharts 
                    style={{ height:'100%' }}
                    notMerge={true}
                    option={{
                    
                        tooltip: {
                            trigger: 'axis',
                            
                        },
                        grid: {
                            top: 60,
                            left: 20,
                            right: 40,
                            bottom:10,
                            containLabel: true
                        },
                        xAxis: {
                            type:'category',
                            data:data.map(i=>i.date),
                            silent: false,
                            splitLine: {
                                show: false
                            },
                            splitArea: {
                                show: false
                            },
                            axisLabel:{
                                show:true,
                                color:'rgba(0, 0, 0, 0.65)'
                            },
                            axisTick:{ show:false },
                            axisLine:{ show:true, lineStyle:{ color:'#f0f0f0' }}
                        },
                        yAxis: {
                            type:'value',
                            splitArea: {
                                show: false
                            },
                            axisLine:{ show:false },
                            axisTick:{ show:false },
                            splitLine:{
                                show:true,
                                lineStyle:{
                                    color:'#f0f0f0'
                                }
                            },
                            axisLabel:{
                                show:true,
                                color:'rgba(0, 0, 0, 0.65)'
                            }
                        },
                        series: seriesData 
                    }}
                />
        </div> 
        
           
    );
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data ) {
        return false;
    } else {
        return true;
    }
}

export default React.memo(StepLineChart, areEqual);
