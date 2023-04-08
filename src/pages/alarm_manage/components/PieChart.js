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
    '0':'已处理',
    '1':'未处理',
    '自动转工单':'#165dff',
    '手动转工单':'#00b42a'
}
const mapsToText = {
    '已处理':0,
    '未处理':1
}
function WarningTypePieChart({ data, type, statusData, theme }) {  
    // data = { '震动告警':10, '震动预警' : 30, '电流越限' : 3, '电压越限' : 5, '温度越限' : 14 }; 
    // let data2 = { '已处理':10, '未处理':30, '自动转工单':25, '手动转工单':40 };
    let textColor = 'rgba(0, 0, 0, 0.85)';
    let seriesData = [], seriesData2 = [];
    if ( data.warningGroupByRuleMap ) {
        Object.keys(data.warningGroupByRuleMap).forEach(key=>{
            seriesData.push({
                name:key,
                value:data.warningGroupByRuleMap[key],
            })
        })
    }
    if ( data.warningGroupByStatusMap ) {
        Object.keys(data.warningGroupByStatusMap).forEach(key=>{
            seriesData2.push({
                name:statusMaps[key] || '',
                value:data.warningGroupByStatusMap[key]
            })
        })
    }
   
    return (   
            
                <ReactEcharts
                    notMerge={true}
                    style={{ height:'100%'}}
                    option={{
                        legend:[
                            {
                                data:seriesData.map(i=>i.name),
                                left: '26%',
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
                                    
                                    return `${name}\xa0\xa0\xa0\xa0{value|${ data.warningGroupByRuleMap ? data.warningGroupByRuleMap[name] : 0}}{title|件}`
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
                            },
                            {
                                data:seriesData2.map(i=>i.name),
                                left: '74%',
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
                                    return `${name}\xa0\xa0\xa0\xa0{value|${ data.warningGroupByStatusMap ? data.warningGroupByStatusMap[mapsToText[name]] : 0 }}{title|件}`
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
                            },
                        ],
                        tooltip:{
                            trigger:'item'
                        },
                        color:['#ff7d00', '#f53f3f', '#0fc6c2', '#fadc19', '#9fdb1d'],
                        series:[
                            {
                                label:{
                                    show:true,
                                    position:'center',
                                    formatter:(params)=>{
                                        return `{a|${data.warningTotal || 0}}{b|件}\n{b|总告警}`
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
                                radius:['38%','46%'],
                                center:['14%','50%'],
                                data:seriesData
                            },
                            {
                                itemStyle:{
                                    borderWidth: 2,
                                    borderColor:'#fff',
                                },
                                label:{ show:false },
                                labelLine:{
                                    show:false
                                },
                                type:'pie',
                                radius:['38%','46%'],
                                center:['60%', '50%'],
                                data:seriesData2
                            }
                        ]
                      
                       
                    }}
                />
    );
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data || prevProps.theme !== nextProps.theme  ) {
        return false;
    } else {
        return true;
    }
}

export default React.memo(WarningTypePieChart, areEqual);
