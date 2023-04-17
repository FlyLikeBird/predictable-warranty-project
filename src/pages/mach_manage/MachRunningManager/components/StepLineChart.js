import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'dva';
import { Radio, Card, Button, DatePicker, message } from 'antd';
import { FileExcelOutlined, FileImageOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import html2canvas from 'html2canvas';
import { downloadExcel } from '@/utils/array';
import XLSX from 'xlsx';
import style from '@/pages/IndexPage.css';
import zhCN from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';

const optionList = [
    { label:'加速度', key:'0', unit:'g', dataIndexArr:['acceleroXPeakmg', 'acceleroYPeakmg', 'acceleroZPeakmg'], },
    { label:'平均速度', key:'1', unit:'mm/s', dataIndexArr:['acceleroXRmsmg', 'acceleroYRmsmg', 'acceleroZRmsmg'] },
    // { label:'开机时长', key:'2', unit:'h', dataIndexArr:[''] },
    { label:'温度', key:'3', unit:'℃', dataIndexArr:['temphumiSenval'] },
    { label:'电压', key:'4', unit:'V', dataIndexArr:['deviceBatteryvolt']},
    // { label:'电流', key:'5', unit:'', dataIndexArr },
    { label:'峭度', key:'6', unit:'', dataIndexArr:['acceleroXKurtosis', 'acceleroYKurtosis', 'acceleroZKurtosis']},
    { label:'偏斜度', key:'7', unit:'', dataIndexArr:['acceleroXSkewness', 'acceleroYSkewness', 'acceleroZSkewness']},
    { label:'偏差度', key:'8', unit:'', dataIndexArr:['acceleroXDeviation', 'acceleroYDeviation', 'acceleroZDeviation'] },
    { label:'峰值因子', key:'9', unit:'', dataIndexArr:['acceleroXCrestfactor', 'acceleroYCrestfactor', 'acceleroZCrestfactor'] }
]

function initSeriesData(data){
    let result = {}, categoryData = [];
    if( data.length ) {
        data.forEach((item, index)=>{
            categoryData.push(item.recordTime);
            if ( index === 0 ) {
                // 初始化各个选项的数据结构
                optionList.forEach(option=>{
                    result[option.key] = [];
                    option.dataIndexArr.forEach((dataIndex)=>{
                        let temp = [item[dataIndex] === -1 ? null : item[dataIndex]];
                        result[option.key].push(temp)
                    });
                })
            } else {
                optionList.forEach((option)=>{
                    option.dataIndexArr.forEach((dataIndex, j)=>{
                        result[option.key][j].push(item[dataIndex] === -1 ? null : item[dataIndex])
                    });
                })
            } 
        })
    }
    return { result, categoryData }
}

function StepLineChart({ onDispatch, currentMach }) {
    const [optionType, setOptionType] = useState(optionList[0]);
    const [category, setCategory] = useState([]);
    const [mapChart, setMapChart] = useState({});
    const [currentDate, setCurrentDate] = useState(moment('2023-04-06'));
    let echartsRef = useRef();
    let seriesData = [];
    useEffect(()=>{
        if ( Object.keys(currentMach).length ) {
            onDispatch({ type:'mach/fetchMachRunningParams', payload:{ equipmentCode:currentMach.equipmentCode } } );
            new Promise((resolve, reject)=>{
                onDispatch({ type:'mach/fetchMachRunningChart', payload:{ resolve, reject, currentDate, equipmentCode:currentMach.equipmentCode }})
            })
            .then((data)=>{
                let { result, categoryData } = initSeriesData(data);
                setMapChart(result);
                setCategory(categoryData);
            })
            .catch(msg=>message.error(msg))
        }
    },[currentMach, currentDate]);
    
    if ( mapChart[optionType.key] ) {
        mapChart[optionType.key].forEach((item, index)=>{
            let color = index === 0 ? '#21ccff' : index === 1 ? '#313ca9' : '#ff7d00';
            let text = index === 0 ? 'X轴' : index === 1 ? 'Y轴' : 'Z轴';
            seriesData.push({
                name: mapChart[optionType.key].length > 1 ? text + optionType.label : optionType.label,
                type:'line',
                step:'middle',
                symbol:'none',
                itemStyle:{ color },
                areaStyle:{
                    color,
                    opacity:0.05
                },
                data:item
            })
        })
    }
    return (   
        <div style={{ height:'100%', position:'relative' }}>
            <Radio.Group 
                className={style['custom-radio']} 
                value={optionType.key} 
                style={{ display:'flex', zIndex:'10', position:'absolute', top:'0', display:'flex', justifyContent:'space-between' }} 
                onChange={e=>{
                    let obj = optionList.filter(i=>i.key === e.target.value)[0];
                    setOptionType(obj);
                }}
            >                
                {
                    optionList.map(item=>(
                        <Radio.Button key={item.key} value={item.key} >{ item.label }</Radio.Button>
                    ))
                }
            </Radio.Group>
            <div style={{ zIndex:'10', position:'absolute', top:'0', right:'0' }}>
                <DatePicker locale={zhCN} value={currentDate} allowClear={false} onChange={value=>setCurrentDate(value)} />
            </div>
            <div style={{ zIndex:'10', position:'absolute', top:'50px', right:'0' }}>
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
                        // var aoa = [], thead = ['对比项', '单位'];
                        // chartData.map(i=>i.category).forEach(i=>{
                        //     thead.push(i);
                        // })
                        // aoa.push(thead);
                        // seriesData.forEach(item=>{
                        //     let temp = [];
                        //     temp.push('成本', '元', ...item.data );
                        //     aoa.push(temp);
                        // })
                        
                        // var sheet = XLSX.utils.aoa_to_sheet(aoa);
                        // sheet['!cols'] = thead.map(i=>({ wch:16 }));
                        // downloadExcel(sheet, fileTitle + '.xlsx' );
                    }
                }}>
                    <Radio.Button value='excel'><FileExcelOutlined /></Radio.Button>
                    <Radio.Button value='download'><FileImageOutlined /></Radio.Button>
                </Radio.Group>
            </div>
            
            <ReactEcharts 
                    ref={echartsRef}
                    style={{ height:'100%' }}
                    notMerge={true}
                    option={{
                    
                        tooltip: {
                            trigger: 'axis',
                            
                        },
                        grid: {
                            top: 90,
                            left: 20,
                            right: 40,
                            bottom:40,
                            containLabel: true
                        },
                        legend:{
                            data:seriesData.map(i=>i.name),
                            top:50,
                            left:'center'
                        },
                        dataZoom:[
                            {
                                type:'slider',
                                show:true,
                                bottom:10,
                                xAxisIndex:[0],
                            }
                        ],
                        xAxis: {
                            type:'category',
                            data:category,
                            silent: false,
                            
                            splitLine: {
                                show: false
                            },
                            splitArea: {
                                show: false
                            },
                            axisLabel:{
                                show:true,
                                color:'rgba(0, 0, 0, 0.65)',
                                formatter:params=>{
                                    let strArr = params.split('T');                                
                                    return strArr[1];
                                },
                            },
                            axisTick:{ show:false },
                            axisLine:{ show:true, lineStyle:{ color:'#f0f0f0' }}
                        },
                        yAxis: {
                            type:'value',
                            name:optionType.unit,
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

export default React.memo(StepLineChart);
