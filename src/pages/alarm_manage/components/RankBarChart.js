import React from 'react';
import ReactEcharts from 'echarts-for-react';
import style from '@/pages/IndexPage.css';

function RankBarChart({ data }){
    let seriesData = [];
    let categoryData = [], preAlarmData = [], alarmData = [];
    // 按预警和告警值的累加值倒序排列
    Object.keys(data).sort((a,b)=>{
        let value1 = ( data[a]['0'] || 0 ) + ( data[a]['1'] || 0 );
        let value2 = ( data[b]['0'] || 0 ) + ( data[b]['1'] || 0 );
        return value1 < value2 ? 1 : -1;
    }).forEach(key=>{
        categoryData.push(key);
        preAlarmData.push(data[key]['0'] || 0);
        alarmData.push(data[key]['1'] || 0);
    })
 
    seriesData.push({
        type:'bar',
        barWidth:6,
        name:'预警',
        data:preAlarmData,
        itemStyle:{
            color:'#ff7d00'
        }
    })
    seriesData.push({
        type:'bar',
        barWidth:6,
        name:'告警',
        data:alarmData,
        itemStyle:{
            color:'#f53f3f'
        }
    })
    return (
        
                <ReactEcharts 
                    style={{ height:'100%' }}
                    notMerge={true}
                    option={{
                    
                        tooltip: {
                            trigger: 'axis',                            
                        },
                        legend:{
                            top:4,
                            data:['预警','告警']
                        },
                        grid: {
                            top: 30,
                            left: 20,
                            right: 60,
                            bottom:10,
                            containLabel: true
                        },
                        dataZoom:[
                            {
                                type:'slider',
                                show:true,
                                right:'20',
                                yAxisIndex:[0],
                                startValue:0,
                                endValue:6
                            }
                        ],
                        xAxis: {
                            type:'value',
                            position:'top',
                            silent: false,
                            minInterval:1,
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

export default React.memo(RankBarChart, areEqual);