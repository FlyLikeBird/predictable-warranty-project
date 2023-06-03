import React, { useRef } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Radio } from 'antd';
import XLSX from 'xlsx';
import { FileExcelOutlined, FileImageOutlined } from '@ant-design/icons';
import { downloadExcel } from '@/utils/array';
import html2canvas from 'html2canvas';
import style from '@/pages/IndexPage.css';

function MultiBarChart({ data, orderTypeMaps, forReport }) {
  let echartsRef = useRef();
  let seriesData = [];
  let categoryData = [];
  let typesData = {};
  categoryData = Object.keys(data).sort((a, b) => {
    let prevTime = new Date(a).getTime();
    let nowTime = new Date(b).getTime();
    return prevTime < nowTime ? -1 : 1;
  });

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
  Object.keys(typesData).forEach((type) => {
    seriesData.push({
      type: 'bar',
      barWidth: 14,
      name: orderTypeMaps[type].text + '工单',
      data: typesData[type],
      stack: 'order',
      itemStyle: { color: orderTypeMaps[type].color },
    });
  });

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      {forReport ? null : (
        <Radio.Group
          size="small"
          style={{
            position: 'absolute',
            top: '20px',
            right: '0',
            zIndex: '10',
          }}
          onChange={(e) => {
            let value = e.target.value;
            let fileTitle = '工单趋势';
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
              categoryData.forEach((i) => thead.push(i));
              aoa.push(thead);
              seriesData.forEach((item, index) => {
                let temp = [];
                temp.push(item.name, '次', ...item.data);
                aoa.push(temp);
              });

              var sheet = XLSX.utils.aoa_to_sheet(aoa);
              sheet['!cols'] = thead.map((i) => ({ wch: 16 }));
              downloadExcel(sheet, fileTitle + '.xlsx');
            }
          }}
        >
          <Radio.Button value="excel">
            <FileExcelOutlined />
          </Radio.Button>
          <Radio.Button value="download">
            <FileImageOutlined />
          </Radio.Button>
        </Radio.Group>
      )}
      <ReactEcharts
        ref={echartsRef}
        style={{ height: '100%' }}
        notMerge={true}
        option={{
          tooltip: {
            trigger: 'axis',
          },
          title: {
            text: '工单趋势',
            textStyle: {
              fontSize: 14,
            },
            left: 20,
            top: 20,
          },
          legend: {
            top: 20,
            data: Object.keys(orderTypeMaps).map(
              (type) => orderTypeMaps[type].text + '工单',
            ),
            icon: 'circle',
            itemWidth: 10,
            itemHeight: 10,
          },
          grid: {
            top: 80,
            left: 20,
            right: 40,
            bottom: 10,
            containLabel: true,
          },
          // dataZoom:[
          //     {
          //         type:'slider',
          //         show:true,
          //         left:'93%',
          //         yAxisIndex:[0],
          //         startValue:0,
          //         endValue:6
          //     }
          // ],
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
              formatter: (value) => {
                let strArr = value.split('-');
                return strArr[2];
              },
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
            splitArea: {
              show: false,
            },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: true, lineStyle: { color: '#f0f0f0' } },

            axisLabel: {
              show: true,
              color: 'rgba(0, 0, 0, 0.65)',
            },
          },
          series: seriesData,
        }}
      />
    </div>
  );
}

export default React.memo(MultiBarChart);
