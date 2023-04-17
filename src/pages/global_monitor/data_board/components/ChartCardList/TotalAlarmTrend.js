import React, { useRef } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Radio, Button } from 'antd';
import { FileExcelOutlined, FileImageOutlined } from '@ant-design/icons';
import XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { downloadExcel } from '@/utils/array';
import CustomDatePicker from './CustomDatePicker';
import style from '@/pages/IndexPage.css';

function TotalAlarmChart({ item, data, chartMaps, onDispatch }){
    const echartsRef = useRef();
    let seriesData = [];
    let categoryData = [], valueData = [];
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
            let sum = data[key].reduce((total, cur)=>{
                total += cur.totalNum;
                return total;
            },0);
            valueData.push(sum);
        } else {
            valueData.push(0);
        }
    })
    seriesData.push({
        type:'line',
        symbol:'emptyCircle',
        symbolSize:6,
        name:'告警总数',
        showSymbol:false,
        smooth:true,
        data:valueData,
        lineStyle:{
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                    offset: 0, color: '#fc975e' // 0% 处的颜色
                }, {
                    offset: 1, color: '#f6533f' // 100% 处的颜色
                }],
                global: false // 缺省为 false
            },
            shadowColor:'rgba(0, 0, 0, 0.25)',
            shadowBlur:15,
            shadowOffsetY:4
        },
        itemStyle:{
            color:'#ff7d01'
        },
        areaStyle:{
            opacity:0.15,
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'rgba(253, 120, 23, 0.85)' // 0% 处的颜色
                }, {
                    offset:1, color: 'rgba(249, 153, 94, 0.1)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
            },            
        }
    })
    return (
        <div className={style['card-container']} style={{ boxShadow:'none' }}>
            <div className={style['card-title']}>
                <div>
                    <span>{ chartMaps[item.key] }</span>
                    <CustomDatePicker onDispatch={action=>onDispatch({ type:'board/fetchSumWarning', payload:action })} />            
                </div>
                <Radio.Group size='small' onChange={e=>{
                    let value = e.target.value;
                    let fileTitle = chartMaps[item.key];
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
                        var aoa = [], thead = ['对比项', '单位'];
                        chartData.map(i=>i.category).forEach(i=>{
                            thead.push(i);
                        })
                        aoa.push(thead);
                        seriesData.forEach(item=>{
                            let temp = [];
                            temp.push('告警总数', '次', ...item.data );
                            aoa.push(temp);
                        })
                        
                        var sheet = XLSX.utils.aoa_to_sheet(aoa);
                        sheet['!cols'] = thead.map(i=>({ wch:16 }));
                        downloadExcel(sheet, fileTitle + '.xlsx' );
                    }
                }}>
                    <Radio.Button value='excel'><FileExcelOutlined /></Radio.Button>
                    <Radio.Button value='download'><FileImageOutlined /></Radio.Button>
                </Radio.Group>
            </div>
            <div className={style['card-content']}>
                <ReactEcharts 
                    ref={echartsRef}
                    style={{ height:'100%' }}
                    notMerge={true}
                    option={{
                    
                        tooltip: {
                            trigger: 'axis',
                            
                        },
                        color:['#65cae3','#2c3b4d','#62a4e2','#57e29f','#f7b645'],                 
                        grid: {
                            top: 20,
                            left: 20,
                            right: 40,
                            bottom:10,
                            containLabel: true
                        },
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
                            minInterval:1,
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
        </div>
    )
}


export default React.memo(TotalAlarmChart);