import React, { useRef } from 'react';
import ReactEcharts from 'echarts-for-react';
import html2canvas from 'html2canvas';
import { Radio } from 'antd';
import XLSX from 'xlsx';
import { FileExcelOutlined, FileImageOutlined } from '@ant-design/icons';
import { downloadExcel } from '@/utils/array';
import style from '@/pages/IndexPage.css';

let chartData = [];
for ( var i=0;i<=8;i++){
    chartData.push({ category:'电机DJ-' + i, fix:10 + Math.random() * 10, maintain:10 + Math.random() * 10 });
}

function MachAlarmRank({ item, data, chartMaps }){
    let echartsRef = useRef();
    let seriesData = [];
    let categoryData = [], fixData = [], maintainData = [];
    chartData.forEach(item=>{
        categoryData.push(item.category);
        fixData.push(item.fix);
        maintainData.push(item.maintain);
    })
    seriesData.push({
        type:'bar',
        barWidth:10,
        stack:'1',
        name:'维修',
        data:fixData,
        itemStyle:{
            color:'#165dff'
        }
    })
    seriesData.push({
        type:'bar',
        barWidth:10,
        name:'保养',
        stack:'1',
        data:maintainData,
        itemStyle:{
            color:'#0fc6c2'
        }
    })
    return (
        <div className={style['card-container']} style={{ boxShadow:'none', padding:'0' }}>
            <div className={style['card-title']}>
                <div>
                    <span>{ chartMaps[item.key] }</span>                
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
                        var aoa = [], thead = ['对比项', '单位', '维修', '保养'];
                        aoa.push(thead);
                        categoryData.forEach((item, index)=>{
                            let temp = [];
                            temp.push(item, '元', seriesData[0].data[index], seriesData[1].data[index] );
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
                        legend:{
                            top:4,
                            data:['维修','保养']
                        },
                        grid: {
                            top: 30,
                            left: 20,
                            right: 50,
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
                                endValue:6
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

export default React.memo(MachAlarmRank, areEqual);