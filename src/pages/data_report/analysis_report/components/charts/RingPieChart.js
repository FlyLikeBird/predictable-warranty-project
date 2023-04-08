import React, { useRef, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Link, Route, Switch } from 'dva/router';
import { Radio, Card, Button, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DownloadOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import html2canvas from 'html2canvas';
function RingPieChart({ data, title }) {  
    let textColor = 'rgba(0, 0, 0, 0.85)';
    let seriesData = [];
    let total = 0;
    let keys = Object.keys(data);
   
    keys.forEach(key=>{
        total += data[key].value;
        seriesData.push({
            name:key,
            value:data[key].value,
            itemStyle:{ color:data[key].color },
            label:{
                show:key === '发生异常' ? true : false,
                formatter:params=>{
                    let ratio = (data['发生异常'].value / total * 100 ).toFixed(1);
                    return ratio + '%';
                },
                fontSize:14,
                position:'center'
            }
        })
    })
  
    return (   
            <div style={{ height:'100%', position:'relative' }}>
                <ReactEcharts
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
                                label:{ show:false },
                                silent:true,
                                labelLine:{
                                    show:false
                                },
                                type:'pie',
                                radius:['43%', '46%'],
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


export default React.memo(RingPieChart)
