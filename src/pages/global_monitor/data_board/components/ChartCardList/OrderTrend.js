import React, { useRef, useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Radio, Button } from 'antd';
import {
  FileExcelOutlined,
  FileImageOutlined,
  PieChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { downloadExcel } from '@/utils/array';
import style from '@/pages/IndexPage.css';
import CustomDatePicker from './CustomDatePicker';

let orderTypeMaps = {
  0: { text: '保养', color: '#722ed1' },
  1: { text: '维修', color: '#2568ff' },
};

function OrderTrend({ item, data, chartMaps, onDispatch }) {
  let echartsRef = useRef();
  let [chartType, setChartType] = useState('bar');
  let seriesData = [];
  let categoryData = [];
  let typesData = {};
  if (data) {
    categoryData = Object.keys(data).sort((a, b) => {
      let prevTime = new Date(a).getTime();
      let nowTime = new Date(b).getTime();
      return prevTime < nowTime ? -1 : 1;
    });
  }

  // 获取所有工单类型
  if (categoryData.length) {
    Object.keys(data[categoryData[0]]).forEach((type) => {
      typesData[type] = [];
    });
  }

  // 构建堆叠柱图表所需的数据
  categoryData.forEach((key) => {
    if (data[key]) {
      Object.keys(data[key]).forEach((type) => {
        typesData[type].push(data[key][type]);
      });
    }
  });
  if (chartType === 'pie') {
    let arr = Object.keys(typesData).map((type) => {
      return {
        name: orderTypeMaps[type].text + '工单',
        itemStyle: { color: orderTypeMaps[type].color },
        value: typesData[type].reduce((sum, cur) => {
          sum += cur;
          return sum;
        }, 0),
      };
    });
    seriesData.push({
      type: 'pie',
      radius: '50%',
      label: { show: false },
      labelLine: { show: false },
      data: arr,
    });
  } else {
    Object.keys(typesData).forEach((type) => {
      seriesData.push({
        type: chartType,
        barWidth: 14,
        name: orderTypeMaps[type].text + '工单',
        data: typesData[type],
        stack: 'order',
        itemStyle: { color: orderTypeMaps[type].color },
      });
    });
  }

  return (
    <div className={style['card-container']} style={{ boxShadow: 'none' }}>
      <div
        className={style['card-title']}
        style={{ height: '2.6rem', lineHeight: '2.6rem' }}
      >
        <div style={{ display: 'flex' }}>
          <span style={{ marginRight: '1rem' }}>{chartMaps[item.key]}</span>
          <CustomDatePicker
            noDay
            onDispatch={(action) =>
              onDispatch({ type: 'board/fetchOrderTrend', payload: action })
            }
          />
        </div>
        <Radio.Group
          size="small"
          onChange={(e) => {
            let value = e.target.value;
            let fileTitle = chartMaps[item.key];
            if (value === 'bar' || value === 'line' || value === 'pie') {
              setChartType(value);
            }
            if (value === 'download' && echartsRef.current) {
              html2canvas(echartsRef.current.ele, {
                allowTaint: false,
                useCORS: false,
                backgroundColor: '#fff',
              }).then((canvas) => {
                let MIME_TYPE = 'image/png';
                let url = canvas.toDataURL(MIME_TYPE);
                let linkBtn = document.createElement('a');
                linkBtn.download = fileTitle;
                linkBtn.href = url;
                let event;
                if (window.MouseEvent) {
                  event = new MouseEvent('click');
                } else {
                  event = document.createEvent('MouseEvents');
                  event.initMouseEvent(
                    'click',
                    true,
                    false,
                    window,
                    0,
                    0,
                    0,
                    0,
                    0,
                    false,
                    false,
                    false,
                    false,
                    0,
                    null,
                  );
                }
                linkBtn.dispatchEvent(event);
              });
            }
            if (value === 'excel') {
              var aoa = [],
                thead = ['工单类型', '单位'];
              categoryData.map((i) => thead.push(i));
              aoa.push(thead);
              seriesData.forEach((item) => {
                let temp = [];
                temp.push(item.name, '件', ...item.data);
                aoa.push(temp);
              });

              var sheet = XLSX.utils.aoa_to_sheet(aoa);
              sheet['!cols'] = thead.map((i) => ({ wch: 16 }));
              downloadExcel(sheet, fileTitle + '.xlsx');
            }
          }}
        >
          <Radio.Button value="pie">
            <PieChartOutlined />
          </Radio.Button>
          <Radio.Button value="bar">
            <BarChartOutlined />
          </Radio.Button>
          <Radio.Button value="line">
            <LineChartOutlined />
          </Radio.Button>
          <Radio.Button value="excel">
            <FileExcelOutlined />
          </Radio.Button>
          <Radio.Button value="download">
            <FileImageOutlined />
          </Radio.Button>
        </Radio.Group>
      </div>
      <div
        className={style['card-content']}
        style={{ height: 'calc( 100% - 2.6rem)' }}
      >
        <ReactEcharts
          ref={echartsRef}
          style={{ height: '100%' }}
          notMerge={true}
          option={{
            tooltip: {
              trigger: chartType === 'pie' ? 'item' : 'axis',
            },
            legend: {
              top: 4,
              data: seriesData.map((i) => i.name),
            },
            grid: {
              top: 40,
              left: 20,
              right: 40,
              bottom: 10,
              containLabel: true,
            },
            xAxis: {
              type: 'category',
              data: categoryData,
              silent: false,
              splitLine: {
                show: false,
              },
              splitArea: {
                show: false,
              },
              axisLabel: {
                show: true,
                color: 'rgba(0, 0, 0, 0.65)',
              },
              axisTick: { show: false },
              axisLine: { show: true, lineStyle: { color: '#f0f0f0' } },
            },
            yAxis: {
              type: 'value',
              splitArea: {
                show: false,
              },
              name: '(件)',
              minInterval: 1,
              axisLine: { show: false },
              axisTick: { show: false },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#f0f0f0',
                },
              },
              axisLabel: {
                show: true,
                color: 'rgba(0, 0, 0, 0.65)',
              },
            },
            series: seriesData,
          }}
        />
      </div>
    </div>
  );
}

function areEqual(prevProps, nextProps) {
  if (prevProps.data !== nextProps.data) {
    return false;
  } else {
    return true;
  }
}

export default React.memo(OrderTrend, areEqual);
