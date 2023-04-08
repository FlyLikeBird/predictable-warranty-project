import React from 'react';
import ReactEcharts from 'echarts-for-react';
import style from '@/pages/IndexPage.css';

let chartData = [];
for ( var i=0;i<=8;i++){
    chartData.push({ category:'电机DJ-' + i, preAlarm:10 + Math.random() * 10, alarm:10 + Math.random() * 10 });
}

function MachAlarmRank({ data, title }){
    let seriesData = [];
    let categoryData = [], preAlarmData = [], alarmData = [];
    chartData.forEach(item=>{
        categoryData.push(item.category);
        preAlarmData.push(item.preAlarm);
        alarmData.push(item.alarm);
    })
    seriesData.push({
        type:'bar',
        barWidth:6,
        name:'告警',
        data:preAlarmData,
        itemStyle:{
            color:'#ff7d00'
        }
    })
   
    return (
        
                <ReactEcharts 
                    style={{ height:'100%', background:'#f7f8fa' }}
                    notMerge={true}
                    option={{
                    
                        tooltip: {
                            trigger: 'axis',                            
                        },
                        title:{
                            text:title,
                            left:4,
                            top:4,
                            textStyle:{
                                fontSize:14
                            }
                        },
                        grid: {
                            top: 40,
                            left: 20,
                            right: 40,
                            bottom:10,
                            containLabel: true
                        },
                        dataZoom:[
                            {
                                type:'slider',
                                show:true,
                                left:'93%',
                                yAxisIndex:[0],
                                startValue:0,
                                endValue:10
                            }
                        ],
                        xAxis: {
                            type:'value',
                            position:'top',
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
                            type:'category',
                            data:categoryData,
                            inverse:true,
                            splitArea: {
                                show: false
                            },
                            splitArea:{
                                show:false,
                            },
                            axisLine:{ show:false },
                            axisTick:{ show:false },
                            
                            axisLabel:{
                                show:true,
                                color:'rgba(0, 0, 0, 0.65)'
                            }
                        },
                        series: seriesData
                    }}
                />
        
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data ){
        return false;
    } else {
        return true;
    }
} 

export default React.memo(MachAlarmRank, areEqual);