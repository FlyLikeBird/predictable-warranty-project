import React, { useRef, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Link, Route, Switch } from 'dva/router';
import { Radio, Card, Button, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DownloadOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import html2canvas from 'html2canvas';

const alarmStatedColors = {
    'undeal':'#198efb',
    'dealed':'#e6e6e6',
    'keep':'#96c8f6'
};

const warningTypeMaps = {
    '震动预警': { color:'#ff7d00' },
    '震动告警': { color:'#f53f3f'},
    '电流越限': { color:'#0fc6c2'},
    '电压越限': { color:'#fadc19'},
    '温度越限': { color:'#9fdb1d' }
}
const statusMaps = {
    '已处理':{ color:'#ff7d00' },
    '未处理':{ color:'#f53f3f' },
    '自动转工单':{ color:'#165dff' },
    '手动转工单':{ color:'#00b42a' }
}
const orderTypeMaps = {
    '维修工单':{ color:'#ff7d00'},
    '保养工单':{ color:'#fadc19'},
    '手动新建工单':{ color:'#f53f3f'}
}
const orderStatusMaps = {
    '已处理':{ color:'#00b42a'},
    '未处理':{ color:'#f53f3f'},
    '挂起':{ color:'#ff7d00'}
}
function WarningTypePieChart({ data, title, type, hasLabel, theme }) {  
    let textColor = 'rgba(0, 0, 0, 0.85)';
    let seriesData = [];
    let total = 0;
    Object.keys(data).forEach(key=>{
        total += +data[key];
        seriesData.push({
            name:key,
            value:data[key],
            itemStyle:{ 
                color: 
                    type === 'warningType' ? warningTypeMaps[key].color : 
                    type === 'warningStatus' ? statusMaps[key].color :
                    type === 'orderType' ? orderTypeMaps[key].color :
                    type === 'orderStatus' ? orderStatusMaps[key].color :
                    '' 
            }
        })
    })
   
    return (   
            
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
                        legend:[
                            {
                                data:seriesData.map(i=>i.name),
                                left: '54%',
                                top:'middle',
                                // top:'12%',
                                // bottom:'10%',
                                orient:'vertical',
                                type:'scroll',
                                itemWidth:8,
                                itemHeight:8,
                                icon:'circle',
                                formatter:(name)=>{
                                    // let temp = findData(name, seriesData);
                                    
                                    return `${name}\xa0\xa0\xa0\xa0{value|${data[name]}}{title|件}`
                                },
                                textStyle:{
                                    color:textColor,
                                    rich: {
                                        title: {
                                            fontSize: 12,
                                            lineHeight: 12,

                                            color: textColor
                                        },
                                        value: {
                                            fontSize: 14,
                                            fontWeight:'bold',
                                            lineHeight: 20,
                                            color: textColor
                                        }
                                    }
                                }
                            }                           
                        ],
                        tooltip:{
                            trigger:'item'
                        },
                        series:[
                            {
                                label: {
                                    show: hasLabel ? true : false ,
                                    position:'center',
                                    formatter:(params)=>{
                                        return `{a|${total}}{b|件}\n{b|总告警}`
                                    },
                                    rich:{
                                        'a':{
                                            color:textColor,
                                            fontSize:22,
                                            padding:[0,4,0,0]                                
                                        },
                                        'b':{
                                            color:'#8a8a8a',
                                            fontSize:12,
                                            padding:[6,0,6,0]
                                        }
                                    }
                                },
                                itemStyle:{
                                    borderWidth: 2,
                                    borderColor:'#fff',
                                },
                                labelLine:{
                                    show:false
                                },
                                type:'pie',
                                radius:['48%','56%'],
                                center:['30%','50%'],
                                data:seriesData
                            }
                        
                        ]
                      
                       
                    }}
                />
    );
}

export default React.memo(WarningTypePieChart);
