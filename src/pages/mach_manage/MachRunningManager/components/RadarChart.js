import React, { useState, useRef } from 'react';
import { connect } from 'dva';
import { Radio, Card, Button,  } from 'antd';
import { LineChartOutlined, BarChartOutlined, PieChartOutlined, DownloadOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import html2canvas from 'html2canvas';

const indicatorTypes = {
    '1':'保养周期',
    '2':'速度均方根',
    '3':'加速度峰值',
    '4':'平稳冲击烈度',
    '5':'优化峭度',
    '6':'加速度均方根'
};

const typesToKeys = {
    '电压偏差':'voltage',
    '频率偏差':'freq',
    '功率因素':'PFavg',
    '负载率':'power',
    '三相不平衡':'balance'
};

function RadarChart({ data }) {
    data = { 1:30, 2:40, 3:20, 4:60, 5:80, 6:10 };
    let seriesData = [], indicator = [];
    Object.keys(data).forEach(key=>{
        indicator.push({ name:indicatorTypes[key], max:100 });
        seriesData.push(data[key]);
    });
    return (    
        <ReactEcharts
            notMerge={true}
            style={{ width:'100%', height:'100%'}}
            option={{
                tooltip:{
                    trigger:'item'
                },
                radar: {
                    // shape: 'circle',
                    name: {
                        // formatter:(value, indicator)=>{
                        //     return `${value}`
                        // },
                        textStyle:{ color:'rgba(0, 0, 0, 0.85)'}
                    },
                    radius:'60%',
                    splitNumber:4,
                    splitArea: {
                        areaStyle: {
                            color:'#fff'
                        }
                    },
                    splitLine:{
                        lineStyle:{
                            width:2,
                            color:'#eeeef2'
                        }
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#eeeef2'
                        }
                    },
                    indicator
                },                    
                series:{
                    type: 'radar',
                    name:'健康评分',
                    symbol:'none',
                    label:{
                        distance:2
                    },
                    data: [
                        {
                            value: seriesData,
                            lineStyle:{
                                color:'rgba(76, 175, 254, 1)'
                            },
                            areaStyle:{
                                color:'rgba(76, 175, 254, 0.5)'
                            }
                        }

                    ]
                }
            }}
        /> 
           
    );
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data ) {
        return false;
    } else {
        return true;
    }
}

export default React.memo(RadarChart, areEqual);
