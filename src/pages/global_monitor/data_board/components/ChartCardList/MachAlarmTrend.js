import React, { useRef, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import html2canvas from 'html2canvas';
import { Radio } from 'antd';
import XLSX from 'xlsx';
import { FileExcelOutlined, FileImageOutlined, BarChartOutlined, LineChartOutlined } from '@ant-design/icons';
import { downloadExcel } from '@/utils/array';
import CustomDatePicker from './CustomDatePicker';
import style from '@/pages/IndexPage.css';

function MachAlarmTrend({ item, data, chartMaps, onDispatch }){
    let [chartType, setChartType] = useState('bar');
    let echartsRef = useRef();
    let seriesData = [];
    let categoryData = [];
    let preAlarmData = [], alarmData = [];
    if ( data ){
        categoryData = Object.keys(data).sort((a,b)=>{
            let prevTime = new Date(a).getTime();
            let nowTime = new Date(b).getTime();
            return prevTime < nowTime ? -1 : 1;
        });
    }

    // 获取所有告警类型
    categoryData.forEach(key=>{
        if ( data[key] && data[key].length ) {
            let obj = data[key].reduce((sum, cur)=>{
                if(!sum['0']) {
                    sum['0'] = 0;
                }
                if(!sum['1']) {
                    sum['1'] = 0;
                }
                if ( cur.warningType == '0') {
                    sum['0'] += cur.totalNum;
                }
                if ( cur.warningType == '1') {
                    sum['1'] += cur.totalNum;
                }
                return sum;
            },{})
            preAlarmData.push(obj['0']);
            alarmData.push(obj['1']);
        } else {
            preAlarmData.push(0);
            alarmData.push(0);
        }
    })
    seriesData.push({
        type:chartType,
        barWidth:10,
        name:'预警',
        symbol:'emptyCircle',
        symbolSize:6,
        showSymbol:false,
        smooth:true,
        data:preAlarmData,
        itemStyle:{
            color:'#ff7d00'
        }
    })
    seriesData.push({
        type:chartType,
        barWidth:10,
        name:'告警',
        symbol:'emptyCircle',
        symbolSize:6,
        showSymbol:false,
        smooth:true,
        data:alarmData,
        itemStyle:{
            color:'#f53f3f'
        }
    })
    
    return (
        <div className={style['card-container']} style={{ boxShadow:'none', padding:'0' }}>
            <div className={style['card-title']} style={{ height:'2.6rem', lineHeight:'2.6rem' }}>
                <div style={{ display:'flex' }}>
                    <span style={{ marginRight:'1rem' }}>{ chartMaps[item.key] }</span>
                    <CustomDatePicker onDispatch={action=>onDispatch({ type:'board/fetchWarningTrend', payload:action })} />            
                </div>
                <Radio.Group size='small' onChange={e=>{
                    let value = e.target.value;
                    let fileTitle = chartMaps[item.key];
                    if ( value === 'bar' || value === 'line'){
                        setChartType(value);
                    }
                    if ( value === 'download' && echartsRef.current ){
                        html2canvas(echartsRef.current.ele, { allowTaint:false, useCORS:false, backgroundColor:'#fff' })
                        .then(canvas=>{
                            let MIME_TYPE = "image/png";
                            let url = canvas.toDataURL(MIME_TYPE);
                            let linkBtn = document.createElement('a');
                            linkBtn.download = fileTitle ;          
                            linkBtn.href = url;
                            let event;
                            if( window.MouseEvent) {
                                event = new MouseEvent('click');
                            } else {
                                event = document.createEvent('MouseEvents');
                                event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                            }
                            linkBtn.dispatchEvent(event);
                        })
                    }
                    if ( value === 'excel' ) {
                        var aoa = [], thead = ['对比项', '单位' ];
                        categoryData.forEach(i=>thead.push(i));
                        aoa.push(thead);
                        seriesData.forEach((item, index)=>{
                            let temp = [];
                            temp.push(item.name, '次', ...item.data);
                            aoa.push(temp);
                        })
                        
                        var sheet = XLSX.utils.aoa_to_sheet(aoa);
                        sheet['!cols'] = thead.map(i=>({ wch:16 }));
                        downloadExcel(sheet, fileTitle + '.xlsx' );
                    }
                }}>
                    <Radio.Button value='bar'><BarChartOutlined /></Radio.Button>
                    <Radio.Button value='line'><LineChartOutlined /></Radio.Button>   
                    <Radio.Button value='excel'><FileExcelOutlined /></Radio.Button>
                    <Radio.Button value='download'><FileImageOutlined /></Radio.Button>
                </Radio.Group>
            </div>
            <div className={style['card-content']} style={{ height:'calc( 100% - 2.6rem)' }}>
                <ReactEcharts 
                    ref={echartsRef}
                    style={{ height:'100%' }}
                    notMerge={true}
                    option={{
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
                            top: 30,
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
                            minInterval:1,
                            name:'(次)',
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
                
            </div>
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data ){
        return false;
    } else {
        return true;
    }
} 

export default React.memo(MachAlarmTrend, areEqual);