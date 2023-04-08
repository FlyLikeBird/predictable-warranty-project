import React, { useRef, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Link, Route, Switch } from 'dva/router';
import { Radio, Card, Button, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DownloadOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import html2canvas from 'html2canvas';
console.log(echarts);
function NormalPieChart({ data, title }) {  
    let textColor = 'rgba(0, 0, 0, 0.85)';
    const echartsRef = useRef();
    let seriesData = [];
    let total = 0;
    let keys = Object.keys(data);
    let maxValue = keys.length ? data[keys[0]].value : '';
    let maxLabel = '';
    keys.forEach(key=>{
        total += data[key].value;
        if ( data[key].value >= maxValue ) {
            maxLabel = key;
        }
    })
    keys.forEach(key=>{
        seriesData.push({
            name:key,
            value:data[key].value,
            itemStyle:{ color:data[key].color },
            emphasis:{
                labelLine:{
                    show:true
                },
                label:{
                    show:true,
                    formatter:params=>{
                        let ratio = total ? (params.data.value / total * 100).toFixed(1) : 0.0
                        return ratio + '%'
                    }
                }
            }
        })
    })
    // 默认选中饼图中的最大占比项
    const handleChartReady = (chart)=>{
        chart.dispatchAction({
            type:'highlight',
            seriesIndex:0,
            name:maxLabel
        })
    }
    return (   
            <div style={{ height:'100%', position:'relative' }}>
                <ReactEcharts
                    ref={echartsRef}
                    onChartReady={handleChartReady}
                    notMerge={true}
                    style={{ height:'100%'}}
                    option={{
                        title:{
                            text:title,
                            left:4,
                            top:4,
                            textStyle:{
                                fontSize:14
                            }
                        },
                        
                        series:[
                            {
                                label:{
                                    show:false
                                },
                                labelLine:{
                                    show:false
                                },
                                type:'pie',
                                radius:'52%',
                                center:['50%','46%'],
                                data:seriesData
                            }
                        ]        
                    }}
                />
                <div style={{ position:'absolute', bottom:'1rem', width:'100%', display:'flex', justifyContent:'space-around' }}>
                    {
                        keys.map(item=>(
                            <div key={item} style={{ textAlign:'center' }}>
                                <div style={{ color:data[item].color, fontSize:'1.4rem', lineHeight:'1.4rem' }}>{ data[item].value }</div>
                                <div style={{ color:'rgba(0, 0, 0, 0.65)', fontSize:'0.8rem' }}>{ item }</div>
                            </div>
                        ))
                    }
                </div>
            </div>
    );
}


export default React.memo(NormalPieChart)
