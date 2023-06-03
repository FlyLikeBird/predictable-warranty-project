import React, { useRef, useState, useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import html2canvas from 'html2canvas';
import { Radio } from 'antd';
import XLSX from 'xlsx';
import {
  FileExcelOutlined,
  FileImageOutlined,
  PieChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { downloadExcel } from '@/utils/array';
import CustomDatePicker from './CustomDatePicker';
import moment from 'moment';
import style from '@/pages/IndexPage.css';
function MachAlarmRank({ item, data, onDispatch, chartMaps }) {
  const [chartType, setChartType] = useState('bar');
  let echartsRef = useRef();
  let seriesData = [];
  let categoryData = [],
    preAlarmData = [],
    alarmData = [];
  data = data || {};

  // 按预警和告警值的累加值倒序排列
  Object.keys(data)
    .sort((a, b) => {
      let value1 = (data[a]['0'] || 0) + (data[a]['1'] || 0);
      let value2 = (data[b]['0'] || 0) + (data[b]['1'] || 0);
      return value1 < value2 ? 1 : -1;
    })
    .forEach((key) => {
      categoryData.push(key);
      preAlarmData.push(data[key]['0'] || 0);
      alarmData.push(data[key]['1'] || 0);
    });
  if (chartType === 'pie') {
    seriesData.push({
      type: 'pie',
      radius: '50%',
      label: { show: false },
      labelLine: { show: false },
      data: [
        {
          name: '预警',
          itemStyle: { color: '#ff7d00' },
          value: preAlarmData.reduce((sum, cur) => {
            sum += cur;
            return sum;
          }, 0),
        },
        {
          name: '告警',
          itemStyle: { color: '#f53f3f' },
          value: alarmData.reduce((sum, cur) => {
            sum += cur;
            return sum;
          }, 0),
        },
      ],
    });
  } else {
    seriesData.push({
      type: chartType,
      barWidth: 6,
      name: '预警',
      data: preAlarmData,
      itemStyle: {
        color: '#ff7d00',
      },
    });
    seriesData.push({
      type: chartType,
      barWidth: 6,
      name: '告警',
      data: alarmData,
      itemStyle: {
        color: '#f53f3f',
      },
    });
  }

  return (
    <div
      className={style['card-container']}
      style={{ boxShadow: 'none', padding: '0' }}
    >
      <div
        className={style['card-title']}
        style={{ height: '2.6rem', lineHeight: '2.6rem' }}
      >
        <div style={{ display: 'flex' }}>
          <span style={{ marginRight: '1rem' }}>{chartMaps[item.key]}</span>
          <CustomDatePicker
            noDay
            onDispatch={(action) =>
              onDispatch({ type: 'board/fetchWarningRank', payload: action })
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
                thead = ['对比项', '单位', '预警', '告警'];
              aoa.push(thead);
              categoryData.forEach((item, index) => {
                let temp = [];
                temp.push(
                  item,
                  '次',
                  seriesData[0].data[index],
                  seriesData[1].data[index],
                );
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
              trigger: 'axis',
            },
            legend: {
              top: 4,
              data: ['预警', '告警'],
            },
            grid: {
              top: 30,
              left: 20,
              right: 60,
              bottom: 10,
              containLabel: true,
            },
            dataZoom: [
              {
                type: 'slider',
                show: true,
                right: '20px',
                yAxisIndex: [0],
                startValue: 0,
                endValue: 6,
              },
            ],
            xAxis: {
              type: 'value',
              position: 'top',
              silent: false,
              name: '(次)',
              minInterval: 1,
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
              type: 'category',
              data: categoryData,
              inverse: true,
              splitArea: {
                show: false,
              },
              splitArea: {
                show: false,
              },
              axisLine: { show: false },
              axisTick: { show: false },

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

export default React.memo(MachAlarmRank);
