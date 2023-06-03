import React, { useRef } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Radio } from 'antd';
import XLSX from 'xlsx';
import { FileExcelOutlined, FileImageOutlined } from '@ant-design/icons';
import { downloadExcel } from '@/utils/array';
import html2canvas from 'html2canvas';
import style from '@/pages/IndexPage.css';

const statusMaps = {
  completedOnTime: { text: '按时完成', color: '#00b42a' },
  timeoutComplete: { text: '超时完成', color: '#ff7d00' },
  unFinish: { text: '未完成', color: '#fadc19' },
};
function OrderCheckBarChart({ data, forReport }) {
  let echartsRef = useRef();
  let seriesData = [];
  let categoryData = [];
  let typesData = {};

  // 构建堆叠柱图表所需的数据
  Object.keys(data).forEach((user) => {
    categoryData.push(user);
    Object.keys(data[user]).forEach((type) => {
      if (!typesData[type]) {
        typesData[type] = [];
        typesData[type].push(data[user][type]);
      } else {
        typesData[type].push(data[user][type]);
      }
    });
  });

  Object.keys(typesData).forEach((type) => {
    seriesData.push({
      type: 'bar',
      barWidth: 14,
      name: statusMaps[type].text,
      data: typesData[type],
      stack: 'order',
      itemStyle: { color: statusMaps[type].color },
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
            let fileTitle = '人员工单完成情况';
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
                thead = ['完成情况', '单位'];
              categoryData.forEach((key) => thead.push(key));
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
            text: '人员工单完成情况',
            textStyle: {
              fontSize: 14,
            },
            left: 20,
            top: 20,
          },
          legend: {
            top: 20,
            data: Object.keys(statusMaps).map((type) => statusMaps[type].text),
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

export default React.memo(OrderCheckBarChart);
