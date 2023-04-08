import React from 'react';
import ReactEcharts from 'echarts-for-react';
import style from '@/pages/IndexPage.css';
const warningTypeMaps = {
    '震动预警': { color:'#ff7d00' },
    '震动告警': { color:'#f53f3f'},
    '电流越限': { color:'#0fc6c2'},
    '电压越限': { color:'#fadc19'},
    '温度越限': { color:'#9fdb1d' }
}
let chartData = [];
for ( var i=1;i<=30;i++){
    chartData.push({ date:i, preAlarm:10 + Math.random() * 10, alarm:10 + Math.random() * 10, ele:10 + Math.random() * 10, vol:10 + Math.random() * 10, temp:10 + Math.random() * 10  });
}

function MultiBarChart({ data, title }){
    let seriesData = [];
    let categoryData = [], preAlarmData = [], alarmData = [], eleData = [], volData = [], tempData = [];
    chartData.forEach(item=>{
        categoryData.push(item.date);
        preAlarmData.push(item.preAlarm);
        alarmData.push(item.alarm);
        eleData.push(item.ele);
        volData.push(item.vol);
        tempData.push(item.temp);
    })
    seriesData.push({
        type:'bar',
        stack:'alarm',
        barWidth:10,
        name:'预警',
        data:preAlarmData,
        itemStyle:{
            color:'#ff7d00'
        }
    })
    seriesData.push({
        type:'bar',
        stack:'alarm',
        barWidth:10,
        name:'告警',
        data:alarmData,
        itemStyle:{
            color:'#f53f3f'
        },
       
    })
    seriesData.push({
        type:'bar',
        stack:'alarm',
        barWidth:10,
        name:'电流越限',
        data:eleData,
        itemStyle:{
            color:'#00b42a'
        },
       
    })
    seriesData.push({
        type:'bar',
        stack:'alarm',
        barWidth:10,
        name:'电压越限',
        data:volData,
        itemStyle:{
            color:'#0fc6c2'
        },
       
    })
    seriesData.push({
        type:'bar',
        stack:'alarm',
        barWidth:10,
        name:'温度越限',
        data:tempData,
        itemStyle:{
            color:'#f7ba1e'
        },
       
    })
    return (
        
                <ReactEcharts 
                    style={{ height:'100%', background:'#f7f8fa' }}
                    notMerge={true}
                    option={{
                        title:{
                            text:title,
                            left:4,
                            top:4,
                            textStyle:{
                                fontSize:14
                            }
                        },
                        tooltip: {
                            trigger: 'axis',                            
                        },
                       
                        legend:{
                            top:4,
                            data:['预警','告警'],
                            icon:'circle',
                            itemWidth:10,
                            itemHeight:10
                        },
                        grid: {
                            top: 40,
                            left: 20,
                            right: 40,
                            bottom:10,
                            containLabel: true
                        },
                        // dataZoom:[
                        //     {
                        //         type:'slider',
                        //         show:true,
                        //         left:'93%',
                        //         yAxisIndex:[0],
                        //         startValue:0,
                        //         endValue:6
                        //     }
                        // ],
                        xAxis: {
                            type:'category',
                            data:categoryData,
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
                            splitArea:{
                                show:false,
                            },
                            axisLine:{ show:false },
                            axisTick:{ show:false },
                            splitLine:{ show:true, lineStyle:{ color:'#f0f0f0' }},

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

export default React.memo(MultiBarChart, areEqual);